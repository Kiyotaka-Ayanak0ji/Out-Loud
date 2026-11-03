"""Additional browser unit, keyboard, permission and narrow-layout checks."""
import asyncio
import json
import os
import traceback
import zlib
from pathlib import Path
from playwright.async_api import async_playwright, expect
from portfolio_runtime import URL, OUT, wav_bytes, setup, click

results=[]
async def check(name,fn):
    try:
        data=await fn(); results.append({'name':name,'passed':True,'detail':data}); print('PASS',name,data or '',flush=True)
    except Exception:
        error=traceback.format_exc(); results.append({'name':name,'passed':False,'error':error}); print('FAIL',name,error,flush=True)

async def main():
    async with async_playwright() as pw:
        browser=await pw.chromium.launch(executable_path=os.environ['PLAYWRIGHT_CHROME_EXECUTABLE_PATH'],headless=True,args=['--no-sandbox'])
        ctx=await browser.new_context(viewport={'width':390,'height':844},reduced_motion='reduce')
        p=await ctx.new_page(); p.set_default_timeout(7000)
        await p.goto(URL); await p.get_by_test_id('hero-section').wait_for()

        async def reduced_keyboard():
            assert await p.locator('html').get_attribute('data-motion')=='off'
            assert await p.get_by_test_id('hero-typewriter').inner_text()=='I build AI tools.'
            for step in ['autopsy','bharat','secret','receipts','work','about','contact']:
                await p.get_by_test_id('nav-menu-btn').click()
                await p.get_by_test_id('menu-link-'+step).focus()
                await p.keyboard.press('Enter')
                await expect(p.get_by_test_id('nav-menu-btn')).to_have_attribute('aria-expanded','false')
            await p.set_viewport_size({'width':320,'height':844})
            await p.get_by_test_id('nav-menu-btn').click()
            assert await p.get_by_test_id('nav-overlay').is_visible()
            await p.get_by_test_id('menu-link-autopsy').click()
            await p.get_by_test_id('nav-home-btn').click()
            heights=[]
            await click(p,'motion-toggle-btn')
            for i in range(28):
                heights.append((await p.get_by_test_id('hero-typewriter').bounding_box())['height'])
                await p.wait_for_timeout(250)
            assert max(heights)-min(heights)<1,heights
            return {'mobile_typewriter_height':heights[0],'menu_usable_despite_clipping':True}
        await check('reduced_motion_keyboard_navigation_320_menu_typewriter',reduced_keyboard)

        async def all_assets():
            await p.set_viewport_size({'width':768,'height':1024})
            if await p.get_by_test_id('motion-toggle-btn').get_attribute('aria-pressed')=='true': await click(p,'motion-toggle-btn')
            for id in ['autopsy','bharat','secret','receipts','work','about','contact']:
                await p.get_by_test_id(id+'-section').scroll_into_view_if_needed()
                await p.wait_for_timeout(120)
                await p.screenshot(path=str(OUT/f'tablet-{id}.jpg'),quality=40,full_page=False)
            images=await p.locator('.screen-only img').evaluate_all('(es)=>es.map(e=>({src:e.src,loaded:e.complete&&e.naturalWidth>0}))')
            assert all(i['loaded'] for i in images),images
            await p.evaluate('() => {window.__printCalls=0; window.print=()=>window.__printCalls++;}')
            await click(p,'nav-print-btn')
            await click(p,'nav-menu-btn'); await click(p,'menu-print-btn')
            assert await p.evaluate('__printCalls')==2
            await click(p,'nav-menu-btn')
            return {'loaded_images':len(images),'print_buttons':2}
        await check('all_images_loaded_tablet_sections_print_buttons',all_assets)

        async def editor_manual():
            await setup(p)
            await p.evaluate('() => {window.__micCalls=0; navigator.mediaDevices.getUserMedia=async()=>{window.__micCalls++;throw new Error("denied")};}')
            for step in ['autopsy','bharat','secret','receipts','projects','about','contact','intro']:
                await click(p,'setup-step-'+step)
            assert await p.evaluate('__micCalls')==0
            await p.get_by_test_id('voice-note-transcript-intro').fill('TEST_UNSAVED_MANUAL')
            await p.reload(); await p.get_by_test_id('setup-save-btn').wait_for()
            assert await p.get_by_test_id('voice-note-transcript-intro').input_value()==''
            await p.get_by_test_id('voice-note-upload-input-intro').set_input_files({'name':'TEST_large.wav','mimeType':'audio/wav','buffer':b'x'*(10*1024*1024+1)})
            await expect(p.get_by_test_id('voice-note-status-intro')).to_contain_text('between 1 byte and 10 MB')
            for width in [320,768,1024,1440]:
                await p.set_viewport_size({'width':width,'height':844 if width==320 else 1080})
                for step in ['intro','autopsy','bharat','secret','receipts','projects','about','contact','review']:
                    await click(p,'setup-step-'+step)
                    assert await p.evaluate('document.documentElement.scrollWidth<=innerWidth'),(width,step)
            return {'no_implicit_mic':True,'no_implicit_save':True,'setup_widths':[320,768,1024,1440]}
        await check('editor_explicit_only_oversize_rejection_all_steps_responsive',editor_manual)

        async def late_permission():
            await click(p,'setup-step-intro')
            await p.evaluate('''() => {window.__tracks=[]; navigator.mediaDevices.getUserMedia=()=>new Promise(r=>{window.__resolve=()=>{let a=new AudioContext(),d=a.createMediaStreamDestination();window.__tracks.push(...d.stream.getTracks());r(d.stream)}})}''')
            await click(p,'voice-note-record-btn-intro')
            await expect(p.get_by_test_id('voice-note-record-btn-intro')).to_be_disabled()
            await expect(p.get_by_test_id('voice-note-upload-btn-intro')).to_be_disabled()
            await click(p,'setup-step-contact'); await p.evaluate('__resolve()'); await p.wait_for_timeout(100)
            assert await p.evaluate('__tracks.every(t=>t.readyState==="ended")')
            await click(p,'setup-step-intro')
            assert await p.get_by_test_id('voice-note-player-intro').count()==0
        await check('pending_microphone_permission_switch_stops_late_stream',late_permission)

        async def decode_unit():
            code=(Path('/app/frontend/src/lib/steganography.js').read_text().replace('export function','function'))
            await p.evaluate('() => {'+code+'\nwindow.__decodeSecret=decodeSecret;}')
            outputs=[]
            for message in ['Upload needed.','नमस्ते తెలుగు ଓଡ଼ିଆ', 'Out Loud ♥']:
                raw=message.encode();key=b'out';data=bytes(b^key[i%3] for i,b in enumerate(raw))
                payload=len(raw).to_bytes(4,'big')+data+zlib.crc32(raw).to_bytes(4,'big')
                pixels=[128,128,128,255]*1000
                for idx,bit in enumerate([(b>>k)&1 for b in payload for k in range(7,-1,-1)]):pixels[(idx//3)*4+idx%3]|=bit
                result=await p.evaluate('(pixels)=>window.__decodeSecret(new Uint8ClampedArray(pixels),"out")',pixels)
                assert result==message
                bad=await p.evaluate('(pixels)=>{try{return window.__decodeSecret(new Uint8ClampedArray(pixels),"ouu")}catch(e){return e.message}}',pixels)
                assert bad=='badkey';outputs.append(result)
            invalid=await p.evaluate('''()=>[[],[0,0,0,255],[255,255,255,255]].map(p=>{try{return __decodeSecret(new Uint8ClampedArray(p),'out')}catch(e){return e.message}})''')
            assert invalid==['invalid']*3,invalid
            return {'round_trips':outputs,'malformed_frames':invalid}
        await check('browser_decoder_unicode_crc_bounds_units',decode_unit)
        async def public_accordions():
            await p.goto(URL); await p.get_by_test_id('hero-section').wait_for()
            for i in range(1,7):
                toggle=p.get_by_test_id(f'autopsy-card-toggle-{i}')
                if await toggle.get_attribute('aria-expanded')=='true': await toggle.click(force=True)
                await toggle.focus(); await p.keyboard.press('Enter')
                await expect(toggle).to_have_attribute('aria-expanded','true')
                assert await p.get_by_test_id(f'decision-details-{i}').is_visible()
                assert len(await p.get_by_test_id(f'decision-{i}-reason').inner_text())>0
                await toggle.focus(); await p.keyboard.press('Space')
                await expect(toggle).to_have_attribute('aria-expanded','false')
            for summary in await p.get_by_test_id('about-section').locator('summary').all():
                await summary.focus(); before=await summary.evaluate('(s)=>s.parentElement.open')
                await p.keyboard.press('Enter'); assert await summary.evaluate('(s)=>s.parentElement.open') != before
            assert await p.locator('[data-testid^="receipt-card-"]').count()==4
        await check('autopsy_six_keyboard_accordions_about_details_receipts',public_accordions)
        async def canvas_motion():
            await p.get_by_test_id('decipher-canvas').wait_for()
            measure='''(c)=>{const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let alpha=0;for(let i=3;i<d.length;i+=4)alpha+=d[i];return {width:c.width,height:c.height,alpha}}'''
            initial=await p.get_by_test_id('decipher-canvas').evaluate(measure)
            await click(p,'motion-toggle-btn'); await p.wait_for_timeout(100)
            after=await p.get_by_test_id('decipher-canvas').evaluate(measure)
            await click(p,'motion-toggle-btn'); await p.wait_for_timeout(100)
            again=await p.get_by_test_id('decipher-canvas').evaluate(measure)
            metrics={'initial':initial,'motion_on':after,'motion_off':again}
            assert after['alpha']>0 and again['alpha']>0,metrics
            return metrics
        await check('puzzle_canvas_retained_after_motion_toggle',canvas_motion)
        await browser.close()
    (OUT/'edge-results.json').write_text(json.dumps(results,indent=2))
    print('TOTAL',sum(r['passed'] for r in results),'/',len(results),flush=True)

if __name__=='__main__':asyncio.run(main())