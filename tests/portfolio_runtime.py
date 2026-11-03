"""Frontend-only Out Loud runtime regression: public, editor, media, puzzle, print."""
import asyncio
import base64
import hashlib
import io
import json
import math
import os
from pathlib import Path
import struct
import wave
import traceback
from playwright.async_api import async_playwright, expect
from pypdf import PdfReader

ROOT = Path('/app')
URL = next(x.split('=', 1)[1].strip() for x in (ROOT/'frontend/.env').read_text().splitlines() if x.startswith('REACT_APP_BACKEND_URL=')).rstrip('/')
OUT = ROOT/'test_reports/runtime'
OUT.mkdir(parents=True, exist_ok=True)
RESULTS = []
NETWORK = []
ERRORS = []
SECTIONS = ['hero', 'autopsy', 'bharat', 'secret', 'receipts', 'work', 'about', 'contact']
PROJECTS = ['stock-screener', 'job-verification', 'finance-api', 'image-messaging', 'price-prediction']
PRIVATE = 'TEST_PRIVATE_TRANSCRIPT_839172'

def wav_bytes(freq=440):
    b = io.BytesIO()
    with wave.open(b, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(16000)
        w.writeframes(b''.join(struct.pack('<h', int(3000*math.sin(2*math.pi*freq*i/16000))) for i in range(32000)))
    return b.getvalue()

async def case(name, fn):
    try:
        detail = await fn()
        RESULTS.append({'name': name, 'passed': True, 'detail': detail})
        print('PASS', name, detail or '', flush=True)
    except Exception as e:
        RESULTS.append({'name': name, 'passed': False, 'error': str(e), 'traceback':traceback.format_exc()})
        print('FAIL', name, traceback.format_exc(), flush=True)

async def click(p, id):
    await p.get_by_test_id(id).click(force=True)

async def setup(p):
    await p.goto(URL+'/#/setup')
    await p.get_by_test_id('setup-save-btn').wait_for()

async def main():
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(executable_path=os.environ['PLAYWRIGHT_CHROME_EXECUTABLE_PATH'], headless=True, args=['--no-sandbox', '--autoplay-policy=no-user-gesture-required', '--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream'])
        ctx = await browser.new_context(viewport={'width': 1440, 'height': 1080}, accept_downloads=True)
        page = await ctx.new_page()
        page.set_default_timeout(9000)
        ctx.on('request', lambda r: NETWORK.append({'url':r.url, 'method':r.method, 'data': r.post_data}))
        page.on('pageerror', lambda e: ERRORS.append(str(e)))
        await page.goto(URL)
        await page.get_by_test_id('hero-section').wait_for()
        await page.evaluate('document.fonts.ready')

        async def public():
            ids = await page.locator('main > section').evaluate_all('(es)=>es.map(e=>e.id)')
            assert ids == SECTIONS, ids
            assert await page.locator('[data-testid^="project-card-"]').count() == 5
            text = await page.locator('.screen-only').inner_text()
            assert 'Built by Voice' not in text and 'built by voice' not in text.lower()
            assert not __import__('re').search(r'\[[^\]]+\]', text)
            assert await page.locator('a[href*="setup"], [data-testid^="voice-note-"], a[href^="tel:"]').count() == 0
            assert await page.get_by_test_id('contact-email').get_attribute('href') == 'mailto:aryanansik@gmail.com'
            assert await page.get_by_test_id('contact-link-github').get_attribute('href') == 'https://github.com/Kiyotaka-Ayanak0ji'
            font = await page.evaluate('''() => ({family:getComputedStyle(document.querySelector('[data-testid="hero-typewriter"]')).fontFamily, faces:[...document.fonts].map(f=>({family:f.family,status:f.status}))})''')
            assert 'Space Grotesk' in font['family'] and any('Space Grotesk' in f['family'] and f['status']=='loaded' for f in font['faces']), font
            return {'sections':ids, 'font':font}
        await case('public_content_font_contacts_privacy', public)

        async def filters():
            for category, count in [('product',2),('ai-data',2),('security',1),('all',5)]:
                await click(page, 'project-filter-'+category)
                assert await page.locator('[data-testid^="project-card-"]').count() == count
            for id in PROJECTS:
                await click(page, 'project-details-'+id)
                assert await page.get_by_test_id('project-evidence-'+id).is_visible()
                assert 'Source:' in await page.get_by_test_id('project-evidence-'+id).inner_text()
            await click(page,'skills-toggle')
            assert not await page.get_by_test_id('skill-group-1').is_visible()
            await click(page,'skills-toggle')
        await case('project_filters_five_details_skills', filters)

        async def nav():
            await page.set_viewport_size({'width':1440,'height':1080})
            if await page.get_by_test_id('motion-toggle-btn').get_attribute('aria-pressed')=='true': await click(page,'motion-toggle-btn')
            positions = {}
            for id in SECTIONS[1:]:
                await click(page,'nav-link-'+id)
                await page.wait_for_timeout(150)
                positions[id] = (await page.get_by_test_id(id+'-section').bounding_box())['y']
                assert 65 <= positions[id] <= 160 or (id=='contact' and await page.evaluate('Math.abs(scrollY+innerHeight-document.documentElement.scrollHeight)<2')), positions
            await click(page,'nav-home-btn')
            assert await page.evaluate('scrollY') < 5
            await page.set_viewport_size({'width':390,'height':844})
            for id in SECTIONS[1:]:
                await click(page,'nav-menu-btn')
                await page.get_by_test_id('nav-overlay').wait_for()
                await click(page,'menu-link-'+id)
                await page.wait_for_timeout(150)
                assert await page.get_by_test_id('nav-menu-btn').get_attribute('aria-expanded')=='false'
                y=(await page.get_by_test_id(id+'-section').bounding_box())['y']
                assert 65 <= y <= 160 or (id=='contact' and await page.evaluate('Math.abs(scrollY+innerHeight-document.documentElement.scrollHeight)<2')), (id,y)
            return positions
        await case('desktop_mobile_all_navigation', nav)

        async def responsive():
            rows=[]
            for width in [320,768,1024,1440]:
                await page.set_viewport_size({'width':width,'height':844 if width==320 else 1080})
                for theme in ['dark','light']:
                    if await page.locator('html').get_attribute('data-theme')!=theme: await click(page,'theme-toggle-btn')
                    await click(page,'nav-home-btn')
                    await page.wait_for_timeout(100)
                    metrics=await page.evaluate('''() => {const W=innerWidth; const b=e=>{const r=e.getBoundingClientRect();return {id:e.dataset.testid,left:r.left,right:r.right,top:r.top,bottom:r.bottom}};return {width:W,scroll:document.documentElement.scrollWidth,controls:[...document.querySelectorAll('header button')].filter(e=>e.getBoundingClientRect().width).map(b),clipped:[...document.querySelectorAll('.screen-only main button,.screen-only main a,.screen-only main input,.screen-only main textarea,.screen-only main h1,.screen-only main h2,.screen-only main h3')].filter(e=>{let r=e.getBoundingClientRect(); return r.width && (r.left < -1 || r.right>W+1)}).map(b)}}''')
                    rows.append({'theme':theme,**metrics})
                    await page.screenshot(path=str(OUT/f'viewport-{width}-{theme}.jpg'),quality=40,full_page=False)
            (OUT/'responsive.json').write_text(json.dumps(rows,indent=2))
            bad=[r for r in rows if r['scroll']>r['width'] or r['clipped'] or any(c['left']<0 or c['right']>r['width'] for c in r['controls'])]
            assert not bad, bad
            return rows
        await case('responsive_320_768_1024_1440_both_themes', responsive)

        async def typewriter():
            await page.set_viewport_size({'width':1440,'height':1080})
            await click(page,'nav-home-btn')
            if await page.get_by_test_id('motion-toggle-btn').get_attribute('aria-pressed')=='false': await click(page,'motion-toggle-btn')
            sizes=[]; texts=[]
            for i in range(24):
                sizes.append((await page.get_by_test_id('hero-typewriter').bounding_box())['height'])
                texts.append(await page.get_by_test_id('hero-typewriter').inner_text())
                await page.wait_for_timeout(250)
            assert max(sizes)-min(sizes)<1, sizes
            assert len(set(texts))>3
            await click(page,'motion-toggle-btn')
            await page.wait_for_timeout(100)
            assert await page.get_by_test_id('hero-typewriter').inner_text()=='I build AI tools.'
            await page.wait_for_timeout(1000)
            assert await page.get_by_test_id('hero-typewriter').inner_text()=='I build AI tools.'
            return {'height':sizes[0],'distinct_states':len(set(texts))}
        await case('typewriter_stability_motion_toggle', typewriter)

        async def bharat():
            samples=[['Ramesh','Mason','10 years','Hyderabad','INR 500/day'],['Suresh','Electrician','5 years','Hyderabad','Not stated'],['Bijay','Mason','5 years','Bhubaneswar','Not stated']]
            for i,expected in enumerate(samples,1):
                await click(page,f'voice-bharat-sample-btn-{i}')
                await click(page,'voice-bharat-build-btn')
                values=[await page.get_by_test_id('bharat-result-'+k).input_value() for k in ['name','role','experience','city','wage']]
                assert values==expected, values
                await page.get_by_test_id('bharat-result-name').fill('Edited sample name')
                assert await page.get_by_test_id('bharat-result-name').input_value()=='Edited sample name'
            for value in ['Ramesh mason Hyderabad 500 INR', 'Mera naam Ramesh hai. Main das saal se mistri ka kaam kar raha hoon, Hyderabad mein. Rozana chhe sau rupaye leta hoon.']:
                await page.get_by_test_id('voice-bharat-input').fill(value)
                await click(page,'voice-bharat-build-btn')
                assert await page.get_by_test_id('voice-bharat-error').inner_text()=='Free-text extraction is not connected. No personal details have been inferred.'
                assert all(v=='Not stated' for v in await page.locator('[data-testid^="bharat-result-"]').evaluate_all('(es)=>es.map(e=>e.value)'))
            await page.get_by_test_id('voice-bharat-input').fill('')
            await click(page,'voice-bharat-build-btn')
            assert await page.get_by_test_id('voice-bharat-error').inner_text()=='Enter text or choose a sample.'
            assert 'confidence' not in (await page.get_by_test_id('bharat-section').inner_text()).lower()
        await case('bharat_exact_samples_edit_free_text_no_inference', bharat)

        async def puzzle():
            # Secret Layer LSB redesign: covered in detail by portfolio_secret_layer.py
            assert await page.get_by_test_id('decipher-text-route-btn').count()==0
            for i in range(1,4):
                await page.get_by_test_id(f'plate-tab-{i}').scroll_into_view_if_needed()
                await click(page,f'plate-tab-{i}')
                await page.get_by_test_id('decipher-canvas').wait_for()
            for i in range(3): await click(page,'decipher-hint-btn')
            assert await page.get_by_test_id('decipher-hints').locator('p').count()==4
            await click(page,'easter-egg-submit-btn')
            assert await page.get_by_test_id('easter-egg-feedback').inner_text()=='Enter an answer first.'
            await page.get_by_test_id('easter-egg-input').fill('out')
            await click(page,'easter-egg-submit-btn')
            await page.wait_for_timeout(200)
            assert 'Not quite' in await page.get_by_test_id('easter-egg-feedback').inner_text()
            await page.get_by_test_id('easter-egg-input').fill('out loud')
            await click(page,'easter-egg-submit-btn')
            await page.get_by_test_id('easter-egg-reveal').wait_for()
            assert await page.get_by_test_id('easter-egg-solve-status').text_content()=='Solved'
            assert 'Upload needed.' in await page.get_by_test_id('secret-bonus-story').inner_text()
            await click(page,'easter-egg-reset-btn')
            assert await page.get_by_test_id('easter-egg-input').input_value()==''
            assert not await page.get_by_test_id('easter-egg-reveal').count()
        await case('plates_hints_empty_wrong_outloud_reset', puzzle)

        async def retry():
            await page.route('**/clues/plate-01.png', lambda r:r.abort())
            await click(page,'plate-tab-2'); await page.get_by_test_id('decipher-canvas').wait_for()
            await page.evaluate("()=>{}")
            await click(page,'plate-tab-1')
            await page.get_by_test_id('decipher-error').wait_for()
            await page.unroute('**/clues/plate-01.png')
            await click(page,'decipher-retry-btn')
            await page.get_by_test_id('decipher-canvas').wait_for()
        await case('failed_plate_retry_recovers', retry)

        async def decoder():
            await click(page,'decoder-source-master-btn')
            await page.get_by_test_id('decoder-pass-input').fill('out loud')
            await click(page,'decoder-run-btn')
            await page.get_by_test_id('decoder-result').wait_for()
            assert await page.get_by_test_id('decoder-result').inner_text()=='Upload needed.'
            await page.get_by_test_id('decoder-pass-input').fill('out')
            await click(page,'decoder-run-btn')
            await page.wait_for_timeout(1200)
            assert await page.get_by_test_id('decoder-status').inner_text()=='Wrong passphrase or damaged image. Try again.'
            assert not await page.get_by_test_id('decoder-result').count()
            await click(page,'decoder-reset-btn')
            await page.get_by_test_id('decoder-file-input').set_input_files({'name':'bad.txt','mimeType':'text/plain','buffer':b'invalid'})
            assert 'No valid hidden message' in await page.get_by_test_id('decoder-status').inner_text()
            await page.get_by_test_id('decoder-file-input').set_input_files({'name':'bad.png','mimeType':'image/png','buffer':b'not an image'})
            await page.get_by_test_id('decoder-pass-input').fill('outloud')
            await click(page,'decoder-run-btn')
            await page.wait_for_timeout(700)
            assert 'Decoding failed' in await page.get_by_test_id('decoder-status').inner_text()
            response=await ctx.request.get(URL+'/clues/master-plate.png')
            remote=await response.body()
            assert hashlib.sha256(remote).hexdigest()==hashlib.sha256((ROOT/'frontend/public/clues/master-plate.png').read_bytes()).hexdigest()
            return {'master_sha256':hashlib.sha256(remote).hexdigest()}
        await case('decoder_correct_wrong_crc_invalid_image_served_hash', decoder)

        async def editor_controls():
            await setup(page)
            counts={}
            for step in ['intro','autopsy','bharat','secret','receipts','projects','about','contact']:
                await click(page,'setup-step-'+step)
                notes=page.get_by_test_id('setup-recordings-'+step)
                counts[step]=await notes.locator('[data-testid^="voice-note-record-btn-"]').count()
                assert counts[step]>0
                assert await notes.locator('[data-testid^="voice-note-transcript-"]').count()==counts[step]
                assert await notes.locator('[data-testid^="voice-note-upload-btn-"]').count()==counts[step]
            assert counts=={'intro':1,'autopsy':10,'bharat':4,'secret':1,'receipts':8,'projects':6,'about':1,'contact':1},counts
            return counts
        await case('all_setup_steps_recording_and_extra_notes',editor_controls)

        async def editor_audio():
            await click(page,'setup-step-intro')
            await page.get_by_test_id('voice-note-upload-input-intro').set_input_files({'name':'TEST_tone.wav','mimeType':'audio/wav','buffer':wav_bytes()})
            await page.get_by_test_id('voice-note-player-intro').wait_for()
            await page.get_by_test_id('voice-note-transcript-intro').fill(PRIVATE)
            src=await page.get_by_test_id('voice-note-player-intro').get_attribute('src')
            await page.get_by_test_id('voice-note-player-intro').evaluate('(a)=>a.play()')
            await page.wait_for_timeout(350)
            assert await page.get_by_test_id('voice-note-player-intro').evaluate('(a)=>a.currentTime')>0
            await click(page,'setup-step-contact'); await click(page,'setup-step-intro')
            assert await page.get_by_test_id('voice-note-player-intro').get_attribute('src')==src
            assert await page.get_by_test_id('voice-note-transcript-intro').input_value()==PRIVATE
            async with page.expect_download() as download:
                await click(page,'voice-note-download-intro')
            d=await download.value; await d.save_as(str(OUT/'individual.wav'))
            assert (OUT/'individual.wav').read_bytes()==wav_bytes()
            await page.get_by_test_id('voice-note-upload-input-intro').set_input_files({'name':'TEST_replacement.wav','mimeType':'audio/wav','buffer':wav_bytes(880)})
            await page.wait_for_timeout(100)
            assert await page.get_by_test_id('voice-note-transcript-intro').input_value()==''
            assert await page.get_by_test_id('voice-note-player-intro').get_attribute('src')!=src
            await page.get_by_test_id('voice-note-transcript-intro').fill(PRIVATE)
            await click(page,'setup-step-receipts')
            await page.get_by_test_id('voice-note-upload-input-receipt-1').set_input_files({'name':'TEST_receipt.wav','mimeType':'audio/wav','buffer':wav_bytes()})
            await page.get_by_test_id('voice-note-transcript-receipt-1').fill(PRIVATE+'_receipt')
            await page.get_by_test_id('setup-receipts-0-transcribed-input').fill(PRIVATE+'_flow')
            for step in ['autopsy','bharat','secret','receipts','projects','about','contact']:
                await click(page,'setup-step-'+step)
                await page.get_by_test_id('voice-note-upload-input-'+step).set_input_files({'name':'TEST_'+step+'.wav','mimeType':'audio/wav','buffer':wav_bytes()})
                await page.get_by_test_id('voice-note-player-'+step).wait_for()
                await page.get_by_test_id('voice-note-transcript-'+step).fill(PRIVATE+'_'+step)
            await click(page,'setup-save-btn')
            await expect(page.get_by_test_id('setup-save-status')).to_contain_text('Draft saved')
            async with page.expect_download() as download:
                await click(page,'setup-download-btn')
            d=await download.value; await d.save_as(str(OUT/'private-draft.json'))
            draft=json.loads((OUT/'private-draft.json').read_text())
            assert draft['voiceNotes']['intro']['transcript']==PRIVATE
            assert draft['voiceNotes']['receipt-1']['transcript']==PRIVATE+'_receipt'
            assert draft['voiceNotes']['intro']['audio'].startswith('data:audio/wav;base64,')
            for step in ['autopsy','bharat','secret','receipts','projects','about','contact']:
                assert draft['voiceNotes'][step]['audio'].startswith('data:audio/wav;base64,')
                assert draft['voiceNotes'][step]['transcript']==PRIVATE+'_'+step
            await page.reload(); await page.get_by_test_id('setup-save-btn').wait_for()
            await click(page,'setup-step-intro')
            assert await page.get_by_test_id('voice-note-transcript-intro').input_value()==PRIVATE
            assert await page.get_by_test_id('voice-note-player-intro').get_attribute('src')==draft['voiceNotes']['intro']['audio']
            await click(page,'setup-step-receipts')
            assert await page.get_by_test_id('voice-note-transcript-receipt-1').input_value()==PRIVATE+'_receipt'
            assert await page.get_by_test_id('setup-receipts-0-transcribed-input').input_value()==PRIVATE+'_flow'
            for step in ['autopsy','bharat','secret','receipts','projects','about','contact']:
                await click(page,'setup-step-'+step)
                assert await page.get_by_test_id('voice-note-player-'+step).get_attribute('src')==draft['voiceNotes'][step]['audio']
                assert await page.get_by_test_id('voice-note-transcript-'+step).input_value()==PRIVATE+'_'+step
        await case('wav_upload_play_navigation_replace_download_json_save_reload',editor_audio)

        async def privacy():
            await click(page,'setup-step-review'); await click(page,'setup-apply-btn'); await click(page,'setup-back-link')
            await page.get_by_test_id('hero-section').wait_for()
            assert PRIVATE not in await page.locator('body').inner_text()
            assert await page.locator('audio, [data-testid^="voice-note-"]').count()==0
            await page.evaluate('''() => localStorage.setItem('outloud-profile-v1', JSON.stringify({about:{bio:'TEST_LEGACY_OVERRIDE'},contact:{email:'legacy@example.com'},intro:{transcript:'TEST_PRIVATE_TRANSCRIPT_839172'}}))''')
            await page.reload(); await page.get_by_test_id('hero-section').wait_for()
            assert 'TEST_LEGACY_OVERRIDE' not in await page.locator('body').inner_text()
            assert PRIVATE not in await page.locator('body').inner_text()
            assert await page.get_by_test_id('contact-email').get_attribute('href')=='mailto:aryanansik@gmail.com'
            fresh=await browser.new_context()
            p=await fresh.new_page(); await p.goto(URL); await p.get_by_test_id('hero-section').wait_for()
            assert PRIVATE not in await p.locator('body').inner_text()
            assert await p.locator('audio').count()==0
            await fresh.close()
        await case('public_same_browser_preview_fresh_browser_legacy_isolation', privacy)

        async def recording():
            await setup(page)
            await page.evaluate('''() => {window.__tracks=[]; navigator.mediaDevices.getUserMedia=async()=>{const ac=new AudioContext(); const osc=ac.createOscillator(); const dest=ac.createMediaStreamDestination(); osc.connect(dest); osc.start(); window.__tracks.push(...dest.stream.getTracks()); return dest.stream;};}''')
            await click(page,'voice-note-record-btn-intro')
            await page.get_by_test_id('voice-note-stop-btn-intro').wait_for()
            await page.wait_for_timeout(1250)
            await click(page,'voice-note-stop-btn-intro')
            await page.get_by_test_id('voice-note-record-btn-intro').wait_for()
            src=await page.get_by_test_id('voice-note-player-intro').get_attribute('src')
            assert src.startswith('data:audio/webm;'),src[:80]
            assert await page.evaluate('__tracks.every(t=>t.readyState==="ended")')
            await page.get_by_test_id('voice-note-player-intro').evaluate('(a)=>a.play()')
            await page.wait_for_timeout(250)
            assert await page.get_by_test_id('voice-note-player-intro').evaluate('(a)=>a.currentTime')>0
            assert await page.get_by_test_id('voice-note-transcript-intro').input_value()==''
            await page.get_by_test_id('voice-note-transcript-intro').fill(PRIVATE)
            await click(page,'voice-note-record-btn-intro'); await page.get_by_test_id('voice-note-stop-btn-intro').wait_for()
            await page.wait_for_timeout(1200)
            await click(page,'setup-step-contact')
            await page.wait_for_timeout(350)
            assert await page.evaluate('__tracks.every(t=>t.readyState==="ended")')
            await click(page,'setup-step-intro')
            newsrc=await page.get_by_test_id('voice-note-player-intro').get_attribute('src')
            assert newsrc != src and newsrc.startswith('data:audio/webm;')
            assert await page.get_by_test_id('voice-note-transcript-intro').input_value()==''
            await click(page,'voice-note-remove-btn-intro')
            assert await page.get_by_test_id('voice-note-player-intro').count()==0
        await case('real_mediarecorder_synthetic_stream_play_replace_switch_stop_tracks',recording)

        async def media_errors():
            await page.evaluate('''() => navigator.mediaDevices.getUserMedia=async()=>{throw new DOMException('denied','NotAllowedError')}''')
            await click(page,'voice-note-record-btn-intro')
            await page.wait_for_timeout(100)
            assert 'Microphone access was denied' in await page.get_by_test_id('voice-note-status-intro').inner_text()
            await page.evaluate('window.MediaRecorder=undefined')
            await click(page,'voice-note-record-btn-intro')
            assert 'Recording is unavailable' in await page.get_by_test_id('voice-note-status-intro').inner_text()
            await page.get_by_test_id('voice-note-upload-input-intro').set_input_files({'name':'TEST_non_audio.txt','mimeType':'text/plain','buffer':b'no audio'})
            assert await page.get_by_test_id('voice-note-status-intro').inner_text()=='Choose a supported audio file.'
            await page.get_by_test_id('voice-note-upload-input-intro').set_input_files({'name':'TEST_empty.wav','mimeType':'audio/wav','buffer':b''})
            assert 'between 1 byte and 10 MB' in await page.get_by_test_id('voice-note-status-intro').inner_text()
        await case('microphone_denied_unsupported_non_audio_empty_errors',media_errors)

        async def reset():
            page.once('dialog',lambda d:d.dismiss())
            await click(page,'setup-clear-btn')
            await click(page,'setup-step-receipts')
            assert await page.get_by_test_id('voice-note-transcript-receipt-1').input_value()==PRIVATE+'_receipt'
            page.once('dialog',lambda d:d.accept())
            await click(page,'setup-clear-btn')
            await page.wait_for_timeout(250)
            assert await page.get_by_test_id('setup-save-status').inner_text()=='Local draft reset to source content.'
            assert await page.get_by_test_id('voice-note-player-receipt-1').count()==0
            assert await page.get_by_test_id('voice-note-transcript-receipt-1').input_value()==''
            await page.reload(); await page.get_by_test_id('setup-save-btn').wait_for()
            assert await page.get_by_test_id('voice-note-player-intro').count()==0
            assert await page.evaluate('localStorage.getItem("outloud-profile-v1")') is None
        await case('reset_confirmation_cancel_confirm_clears_persisted_notes',reset)

        async def storage_error():
            c=await browser.new_context(); p=await c.new_page(); p.set_default_timeout(9000)
            await p.add_init_script('''indexedDB.open=()=>{throw new Error('TEST_storage_unavailable')}''')
            await setup(p)
            assert 'Local storage is unavailable' in await p.get_by_test_id('setup-storage-error').inner_text()
            await click(p,'setup-save-btn')
            assert 'Could not save locally' in await p.get_by_test_id('setup-storage-error').inner_text()
            p.once('dialog',lambda d:d.accept()); await click(p,'setup-clear-btn')
            assert 'Could not clear the local draft' in await p.get_by_test_id('setup-storage-error').inner_text()
            async with p.expect_download() as download: await click(p,'setup-download-btn')
            assert (await download.value).suggested_filename=='out-loud-private-draft.json'
            await c.close()
        await case('indexeddb_unavailable_load_save_reset_download_fallback',storage_error)

        async def print_summary():
            await page.goto(URL); await page.get_by_test_id('hero-section').wait_for()
            findings=[]
            for theme in ['dark','light']:
                if await page.locator('html').get_attribute('data-theme')!=theme: await click(page,'theme-toggle-btn')
                await page.emulate_media(media='print')
                await page.wait_for_timeout(400)
                styles=await page.evaluate('''()=>({body:getComputedStyle(document.body).backgroundColor,html:getComputedStyle(document.documentElement).backgroundColor,screen:getComputedStyle(document.querySelector('.screen-only')).display,print:getComputedStyle(document.querySelector('#print-root')).display})''')
                assert styles=={'body':'rgb(255, 255, 255)','html':'rgb(255, 255, 255)','screen':'none','print':'block'},styles
                pdfpath=OUT/f'summary-{theme}.pdf'
                await page.pdf(path=str(pdfpath),format='A4',print_background=True,prefer_css_page_size=True)
                pdf=PdfReader(str(pdfpath)); text='\n'.join(p.extract_text() for p in pdf.pages)
                findings.append({'theme':theme,'pages':len(pdf.pages),'styles':styles})
                assert len(pdf.pages)==1,findings
                assert PRIVATE not in text and 'TEST_LEGACY_OVERRIDE' not in text
                assert 'aryanansik@gmail.com' in text and 'Kiyotaka-Ayanak0ji' in text
                assert 'Record replacement' not in text and 'Stop recording' not in text
                await page.emulate_media(media='screen')
            return findings
        await case('print_both_themes_white_one_a4_page_private_contacts',print_summary)

        async def lab():
            p=await ctx.new_page(); await p.goto(URL+'/design-lab.html')
            assert await p.title()=='Out Loud — Design Lab'
            for id in ['a','b','c','d']:
                assert await p.get_by_test_id('design-variant-'+id).count()==1
            await p.get_by_test_id('design-variant-a').get_by_test_id('anim-toggle').click(force=True)
            assert 'motion-off' in await p.get_by_test_id('design-variant-a').get_attribute('class')
            await p.close()
        await case('preserved_design_lab_four_variants_toggle',lab)

        async def no_outgoing():
            leaks=[r for r in NETWORK if r['data'] and (PRIVATE in r['data'] or 'data:audio' in r['data'] or 'TEST_' in r['data'])]
            mutations=[r for r in NETWORK if r['method'] not in ['GET','HEAD','OPTIONS'] and '/__emergent_overlay__/' not in r['url'] and '/cdn-cgi/' not in r['url']]
            assert not leaks, leaks
            assert not mutations,mutations
            assert not ERRORS,ERRORS
            error_text = await page.evaluate('''() => {const errorElements = Array.from(document.querySelectorAll('.error, [class*="error"], [id*="error"]'));return errorElements.map(el => el.textContent).join(', ');}''')
            print('Found error message: '+error_text if error_text else 'No error messages found on the page')
            return {'requests':len(NETWORK),'mutation_requests':len(mutations),'page_errors':ERRORS}
        await case('no_notes_audio_transcript_outgoing_requests_or_page_errors',no_outgoing)
        await browser.close()
    (OUT/'results.json').write_text(json.dumps({'results':RESULTS,'network':NETWORK,'page_errors':ERRORS},indent=2))
    print('TOTAL',sum(r['passed'] for r in RESULTS),'/',len(RESULTS),flush=True)

if __name__=='__main__':
    asyncio.run(main())