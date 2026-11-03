"""Iteration 3: Secret Layer 'Find the Whisper' plates, Bonus dialog (riddles, final, share card), content, print, regressions."""
import asyncio
import json
import os
import re
import traceback
from pathlib import Path
import numpy as np
from PIL import Image
from playwright.async_api import async_playwright

ROOT = Path('/app')
URL = next(x.split('=', 1)[1].strip() for x in (ROOT/'frontend/.env').read_text().splitlines() if x.startswith('REACT_APP_BACKEND_URL=')).rstrip('/')
OUT = ROOT/'test_reports/runtime'; OUT.mkdir(parents=True, exist_ok=True)
RESULTS = []; ERRORS = []
CH = ['red', 'green', 'blue']
EXPECT = {1: 2, 2: 0, 3: 1}  # plate -> channel carrying FIND / THE / WHISPER
BANNED = ['Source:', 'Résumé-reported', 'self-assessed', 'awaiting confirmation', 'Evidence needed']

REF = {}
for i in (1, 2, 3):
    a = np.asarray(Image.open(ROOT/f'frontend/public/clues/plate-0{i}.png').convert('RGB'))
    REF[i] = [float((a[..., c] & 1).mean()) for c in range(3)]

STATS_JS = '''() => {const c=document.querySelector('[data-testid="decipher-canvas"]'); const x=c.getContext('2d'); const d=x.getImageData(0,0,c.width,c.height).data;
 let all=0,n=0,cen=0,cn=0; for(let y=0;y<c.height;y++)for(let X=0;X<c.width;X++){const v=d[(y*c.width+X)*4]>127?1:0; all+=v;n++; if(y>=300&&y<420&&X>=200&&X<520){cen+=v;cn++}}
 return {w:c.width,h:c.height,mean:all/n,center:cen/cn}}'''


async def case(name, fn):
    try:
        d = await fn(); RESULTS.append({'name': name, 'passed': True, 'detail': d}); print('PASS', name, d if d is not None else '', flush=True)
    except Exception:
        RESULTS.append({'name': name, 'passed': False, 'error': traceback.format_exc()}); print('FAIL', name, traceback.format_exc(), flush=True)


async def click(p, tid):
    loc = p.get_by_test_id(tid); await loc.scroll_into_view_if_needed(); await loc.click()


def norm(t):
    return re.sub(r'[^a-z]', '', t.lower())


async def solve_secret(page, text='find the whisper'):
    await page.get_by_test_id('easter-egg-input').scroll_into_view_if_needed()
    await page.get_by_test_id('easter-egg-input').fill(text); await click(page, 'easter-egg-submit-btn')
    await page.get_by_test_id('bonus-dialog').wait_for()


async def main():
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(executable_path=os.environ['PLAYWRIGHT_CHROME_EXECUTABLE_PATH'], headless=True, args=['--no-sandbox'])
        ctx = await browser.new_context(viewport={'width': 1440, 'height': 1000})
        await ctx.grant_permissions(['clipboard-read', 'clipboard-write'], origin=URL)
        page = await ctx.new_page(); page.set_default_timeout(9000)
        page.on('pageerror', lambda e: ERRORS.append(str(e)))
        await page.goto(URL); await page.get_by_test_id('secret-section').wait_for()

        # Secret: answer absent from DOM pre-solve; old decoder removed
        async def no_answer_no_decoder():
            html = await page.content()
            for w in ['findthewhisper', 'accesspoint']:
                assert w not in norm(await page.locator('body').inner_text()), w
            assert 'whisper' not in (await page.get_by_test_id('secret-section').inner_html()).lower()
            for tid in ['decoder-panel', 'decipher-text-route-btn', 'decoder-source-master-btn', 'decoder-run-btn', 'bonus-dialog']:
                assert await page.get_by_test_id(tid).count() == 0, tid
            assert 'master-plate' not in html
            return 'ok'
        await case('answer_absent_pre_solve_and_no_decoder', no_answer_no_decoder)

        async def bitplanes():
            out = {}
            assert await page.get_by_test_id('decipher-slider').input_value() == '7'
            for i in (1, 2, 3):
                await click(page, f'plate-tab-{i}'); await page.get_by_test_id('decipher-canvas').wait_for(); await page.wait_for_timeout(250)
                await page.get_by_test_id('decipher-slider').fill('0')
                for c in range(3):
                    await click(page, f'decipher-channel-{CH[c]}'); await page.wait_for_timeout(150)
                    s = await page.evaluate(STATS_JS)
                    assert s['w'] == 720 and abs(s['mean'] - REF[i][c]) < 0.002, (i, c, s, REF[i][c])
                    if c == EXPECT[i]: assert s['center'] > 0.6, (i, c, s)
                    else: assert s['center'] < 0.55, (i, c, s)
                    out[f'p{i}-{CH[c]}'] = round(s['center'], 3)
                await click(page, f'decipher-channel-{CH[EXPECT[i]]}'); await page.wait_for_timeout(150)
                await page.get_by_test_id('decipher-canvas').screenshot(path=str(OUT/f'it3-plate{i}-plane0.jpg'), type='jpeg', quality=40)
                await page.get_by_test_id('decipher-slider').fill('1'); await page.wait_for_timeout(150)
                s1 = await page.evaluate(STATS_JS)
                assert s1['center'] < 0.55, ('plane1 shows letters', i, s1)
            return out
        await case('plates_reveal_word_only_right_channel_plane0', bitplanes)

        async def answers():
            await click(page, 'easter-egg-submit-btn')
            assert await page.get_by_test_id('easter-egg-feedback').inner_text() == 'Enter an answer first.'
            await page.get_by_test_id('easter-egg-input').fill('out loud'); await click(page, 'easter-egg-submit-btn'); await page.wait_for_timeout(250)
            assert 'Not quite' in await page.get_by_test_id('easter-egg-feedback').inner_text()
            assert await page.get_by_test_id('bonus-dialog').count() == 0
            await page.get_by_test_id('easter-egg-input').fill('3000'); await click(page, 'easter-egg-submit-btn'); await page.wait_for_timeout(250)
            assert await page.get_by_test_id('bonus-dialog').count() == 0
            await click(page, 'easter-egg-spoiler-btn'); await page.wait_for_timeout(200)
            sec = await page.get_by_test_id('secret-section').inner_text()
            assert 'whisper' not in sec.lower(), 'method leaks answer'
            await solve_secret(page, 'FINDTHEWHISPER')
            t = await page.get_by_test_id('bonus-dialog').inner_text()
            assert 'Bonus Section Unlocked' in t
            await page.keyboard.press('Escape'); await page.get_by_test_id('bonus-dialog').wait_for(state='detached', timeout=3000)
            st = await page.get_by_test_id('easter-egg-solve-status').text_content()
            await click(page, 'open-bonus-btn'); await page.get_by_test_id('bonus-dialog').wait_for()
            await page.keyboard.press('Escape'); await page.wait_for_timeout(300)
            await click(page, 'easter-egg-reset-btn')
            await solve_secret(page, '  Find the whisper ')
            await page.keyboard.press('Escape'); await page.wait_for_timeout(300)
            return {'status_after_method': st}
        await case('secret_empty_wrong_variants_open_and_reopen_bonus', answers)

        async def bonus_flow():
            await page.reload(); await page.get_by_test_id('secret-section').wait_for()
            await solve_secret(page, 'find the whisper')
            d = page.get_by_test_id('bonus-dialog')
            a = page.get_by_test_id('bonus-audio')
            info = await a.evaluate('e=>({src:e.getAttribute("src"),paused:e.paused,autoplay:e.autoplay,ct:e.currentTime})')
            assert info['src'] == '/audio/bonus-clip.mp3' and info['paused'] and not info['autoplay'], info
            r = await ctx.request.get(URL + '/audio/bonus-clip.mp3'); info['clip_status'] = r.status; info['clip_type'] = r.headers.get('content-type')
            assert r.status == 200 and len(await r.body()) > 10000
            assert 'AI voice' in await page.get_by_test_id('bonus-clip').text_content()
            assert not await page.get_by_test_id('bonus-transcript').is_visible()
            await click(page, 'bonus-transcript-toggle'); assert await page.get_by_test_id('bonus-transcript').is_visible()
            await click(page, 'bonus-replay-btn'); await page.wait_for_timeout(1500)
            info['after_replay'] = await a.evaluate('e=>({paused:e.paused,ct:e.currentTime,err:e.error&&e.error.code})')
            await a.evaluate('e=>e.pause()')
            info['story'] = await page.get_by_test_id('bonus-story').inner_text()
            assert await page.get_by_test_id('bonus-final').count() == 0
            for n, ans in ((1, 'ACCESS'), (2, ' point ')):
                await click(page, f'bonus-riddle-{n}-submit')
                assert 'Enter an answer' in await page.get_by_test_id(f'bonus-riddle-{n}-feedback').inner_text()
                await page.get_by_test_id(f'bonus-riddle-{n}-input').fill('token'); await click(page, f'bonus-riddle-{n}-submit'); await page.wait_for_timeout(200)
                assert 'Not quite' in await page.get_by_test_id(f'bonus-riddle-{n}-feedback').inner_text()
                await click(page, f'bonus-riddle-{n}-hint'); await click(page, f'bonus-riddle-{n}-hint'); await click(page, f'bonus-riddle-{n}-hint')
                hs = await page.get_by_test_id(f'bonus-riddle-{n}-feedback').locator('p').all_inner_texts()
                info[f'r{n}_hints'] = hs
                assert len([h for h in hs if 'Not quite' not in h]) == 2, hs
                if n == 1: assert await page.get_by_test_id('bonus-final').count() == 0
                await page.get_by_test_id(f'bonus-riddle-{n}-input').fill(ans); await click(page, f'bonus-riddle-{n}-submit')
                await page.get_by_test_id(f'bonus-riddle-{n}-word').wait_for()
                info[f'r{n}_word'] = await page.get_by_test_id(f'bonus-riddle-{n}-word').inner_text()
            assert info['r1_word'] == 'Access' and info['r2_word'] == 'Point', info
            await page.get_by_test_id('bonus-final').wait_for()
            await click(page, 'bonus-final-submit')
            assert 'Enter an answer' in await page.get_by_test_id('bonus-final-feedback').inner_text()
            await page.get_by_test_id('bonus-final-input').fill('Point Access'); await click(page, 'bonus-final-submit'); await page.wait_for_timeout(200)
            assert 'Not quite' in await page.get_by_test_id('bonus-final-feedback').inner_text()
            await page.get_by_test_id('bonus-final-input').fill('ACCESS POINT'); await click(page, 'bonus-final-submit')
            await page.get_by_test_id('bonus-success').wait_for(); await page.get_by_test_id('bonus-share-card').wait_for()
            src = await page.get_by_test_id('bonus-share-card').get_attribute('src')
            assert src.startswith('data:image/png'), src[:40]
            nat = await page.get_by_test_id('bonus-share-card').evaluate('e=>[e.naturalWidth,e.naturalHeight]')
            assert nat == [1200, 630], nat
            dl = page.get_by_test_id('bonus-download-btn')
            assert await dl.get_attribute('download') == 'out-loud-access-point.png' and (await dl.get_attribute('href')).startswith('data:image/png')
            async with page.expect_download() as di: await dl.click()
            dwn = await di.value; info['download_name'] = dwn.suggested_filename
            await click(page, 'bonus-copy-btn'); await page.wait_for_timeout(300)
            info['copy_note'] = await page.get_by_test_id('bonus-share-note').inner_text()
            clip = await page.evaluate('navigator.clipboard.readText()')
            assert 'Access Point' in clip, clip
            async with ctx.expect_page() as pi: await click(page, 'bonus-linkedin-btn')
            lp = await pi.value; info['linkedin_url'] = lp.url; await lp.close()
            assert 'linkedin.com/sharing/share-offsite' in info['linkedin_url'] or 'linkedin.com' in info['linkedin_url']
            info['linkedin_note'] = await page.get_by_test_id('bonus-share-note').inner_text()
            xh = await page.get_by_test_id('bonus-x-btn').get_attribute('href')
            assert 'twitter.com/intent/tweet' in xh and 'WisprFlow' in xh and 'emergentlabs' in xh, xh
            info['x_href'] = xh; info['native_btn'] = await page.get_by_test_id('bonus-native-share-btn').count()
            await page.get_by_test_id('bonus-success').screenshot(path=str(OUT/'it3-bonus-success.jpg'), type='jpeg', quality=40)
            await page.keyboard.press('Escape'); await page.wait_for_timeout(300)
            await click(page, 'open-bonus-btn'); await page.get_by_test_id('bonus-dialog').wait_for()
            info['reopen_keeps_success'] = await page.get_by_test_id('bonus-success').count()
            info['reopen_words'] = [await page.get_by_test_id(f'bonus-riddle-{n}-word').count() for n in (1, 2)]
            await page.keyboard.press('Escape'); await page.wait_for_timeout(300)
            return info
        await case('bonus_dialog_audio_riddles_final_share', bonus_flow)

        async def bonus_mobile():
            res = {}
            for w in (390, 320):
                p = await ctx.new_page(); await p.set_viewport_size({'width': w, 'height': 700})
                await p.goto(URL); await p.get_by_test_id('secret-section').wait_for()
                await solve_secret(p)
                m = await p.get_by_test_id('bonus-dialog').evaluate('e=>{const r=e.getBoundingClientRect();return {sh:e.scrollHeight,ch:e.clientHeight,left:r.left,right:r.right,top:r.top,bottom:r.bottom,ov:getComputedStyle(e).overflowY,W:innerWidth,H:innerHeight}}')
                await p.get_by_test_id('bonus-dialog').screenshot(path=str(OUT/f'it3-bonus-{w}.jpg'), type='jpeg', quality=40)
                await p.get_by_test_id('bonus-riddle-2-input').scroll_into_view_if_needed()
                await p.get_by_test_id('bonus-riddle-2-input').fill('point'); await p.get_by_test_id('bonus-riddle-2-submit').click()
                await p.get_by_test_id('bonus-riddle-2-word').wait_for()
                m['scrolled'] = await p.get_by_test_id('bonus-dialog').evaluate('e=>e.scrollTop')
                res[w] = m; await p.close()
                assert m['ov'] == 'auto' and m['sh'] > m['ch'] and m['left'] >= 0 and m['right'] <= w and m['scrolled'] > 0, m
            return res
        await case('bonus_dialog_scrolls_on_small_viewports', bonus_mobile)

        async def banned_text():
            await page.reload(); await page.get_by_test_id('secret-section').wait_for()
            for i in range(1, 7):
                t = page.get_by_test_id(f'autopsy-card-toggle-{i}')
                if await t.get_attribute('aria-expanded') != 'true': await t.scroll_into_view_if_needed(); await t.click()
            for d in await page.locator('details').all():
                await d.evaluate('e=>e.open=true')
            body = await page.locator('body').inner_text()
            hits = {b: len(re.findall(re.escape(b), body, re.I)) for b in BANNED}
            assert not any(hits.values()), hits
            um = [m for m in re.findall(r'.{0,50}Upload needed\..{0,10}', body)]
            return {'upload_needed_count': len(um), 'contexts': [x.replace('\n', ' | ') for x in um]}
        await case('no_banned_meta_labels_sitewide', banned_text)

        async def autopsy():
            out = {}
            for i in range(1, 7):
                for f in ['context', 'decision', 'reason', 'outcome', 'lesson']:
                    v = await page.get_by_test_id(f'decision-{i}-{f}').inner_text()
                    assert v.strip() and v != 'Upload needed.', (i, f, v)
            for i in (1, 2, 3):
                t = await page.get_by_test_id(f'mistake-{i}').inner_text()
                assert 'Upload needed' not in t, t
                out[f'm{i}'] = t[:90].replace('\n', ' ')
            m = norm(await page.get_by_test_id('mistakes-panel').inner_text())
            assert all(k in m for k in ['goldman', 'amazon', 'uber']), 'GS/Amazon/Uber'
            a = await page.get_by_test_id('autopsy-section').inner_text()
            for k in ['Razorpay', 'Stripe', 'Hostinger', '17,000+', '$5', '$20', '$40']:
                assert k in a, k
            rows = await page.get_by_test_id('decision-chart-6').locator('li').count()
            assert rows == 10 and await page.get_by_test_id('decision-stats-6').is_visible()
            out['chart_rows'] = rows
            return out
        await case('autopsy_6_filled_mistakes_3_chart_stats', autopsy)

        async def projects():
            cards = page.locator('[data-testid^="project-card-"]')
            n = await cards.count(); assert n == 5, n
            res = {}
            for k in range(n):
                c = cards.nth(k); pid = (await c.get_attribute('data-testid')).replace('project-card-', '')
                box = page.get_by_test_id(f'project-image-{pid}')
                img = await box.locator('img').count(); svg = await box.locator('svg').count()
                ok = True
                if img:
                    ok = await box.locator('img').evaluate('async e=>{e.loading="eager"; if(!e.complete) await new Promise(r=>{e.onload=r;e.onerror=r}); return e.naturalWidth>0}')
                links = await c.locator('[data-testid^="project-link-"]').evaluate_all('es=>es.map(e=>[e.dataset.testid,e.href,e.target])')
                res[pid] = {'img': img, 'svg': svg, 'img_ok': ok, 'links': links}
                assert (img or svg) and ok and links, res[pid]
                assert all(l[2] == '_blank' for l in links)
            ip = await page.get_by_test_id('projects-in-progress').inner_text()
            assert 'currently working on' in ip.lower()
            return res
        await case('projects_5_with_images_links_in_progress', projects)

        async def receipts():
            out = {}
            for i in range(1, 5):
                c = await page.get_by_test_id(f'receipt-card-{i}').inner_text()
                f = await page.get_by_test_id(f'receipt-flow-{i}').inner_text()
                assert 'Evidence' not in c and f.strip() and f != 'Upload needed.', (i, c)
                assert 'Recording & transcript' in c or 'RECORDING' in c.upper()
                out[i] = f[:60]
            assert await page.get_by_test_id('receipt-card-5').count() == 0
            sp = await page.get_by_test_id('speed-tests').inner_text()
            assert '3.6×' in sp and ('5m' in sp.replace(' ', '') or '5:20' in sp or '5 min' in sp), sp
            out['speed'] = sp[:200].replace('\n', ' | ')
            return out
        await case('receipts_4_flow_text_no_evidence_speed_3_6x', receipts)

        async def print_resume():
            from pypdf import PdfReader
            await page.emulate_media(media='print')
            vis = await page.evaluate('''()=>{const r=document.getElementById('print-root');const s=getComputedStyle(r);const app=[...document.body.querySelectorAll('section')].filter(e=>e.offsetParent!==null).length;return {display:s.display,sections_visible:app,text:r.innerText}}''')
            await page.pdf(path=str(OUT/'it3-print.pdf'), format='A4', print_background=True, prefer_css_page_size=True)
            await page.emulate_media(media='screen')
            r = PdfReader(str(OUT/'it3-print.pdf')); txt = '\n'.join(x.extract_text() for x in r.pages)
            t = vis['text']
            assert vis['display'] != 'none' and vis['sections_visible'] == 0, vis['display']
            for k in ['Ansik Aryan Samal', 'aryanansik@gmail.com', 'linkedin.com/in/', 'github.com/']:
                assert k in t and k.replace(' ', '') in txt.replace(' ', '').replace('\n', ''), k
            assert '+91' not in t and '7032156925' not in t and '7032156925' not in txt.replace(' ', '')
            stock = [l for l in t.split('\n') if 'Stock' in l or '$5' in l or '17,000' in l]
            assert any('$5/month' in l for l in stock) and any('17,000+' in l for l in stock), stock
            return {'pages': len(r.pages), 'display': vis['display']}
        await case('print_resume_no_phone_stock_line', print_resume)

        async def nav_theme_motion():
            res = {}
            links = await page.locator('[data-testid^="nav-link-"]').evaluate_all('es=>es.map(e=>e.dataset.testid)')
            res['links'] = links
            for tid in links[:6]:
                loc = page.get_by_test_id(tid)
                if await loc.is_visible():
                    await loc.click(); await page.wait_for_timeout(900)
            await page.get_by_test_id('nav-home-btn').click(); await page.wait_for_timeout(600)
            before = await page.evaluate('document.documentElement.dataset.theme')
            await page.get_by_test_id('theme-toggle-btn').click(); await page.wait_for_timeout(400)
            after = await page.evaluate('document.documentElement.dataset.theme')
            res['theme'] = [before, after]; assert before != after
            # light theme: project art + bonus dialog
            await page.get_by_test_id('work-section').scroll_into_view_if_needed(); await page.wait_for_timeout(600)
            await page.get_by_test_id('work-section').screenshot(path=str(OUT/'it3-work-light.jpg'), type='jpeg', quality=40)
            await solve_secret(page)
            await page.wait_for_timeout(400)
            await page.get_by_test_id('bonus-dialog').screenshot(path=str(OUT/'it3-bonus-light.jpg'), type='jpeg', quality=40)
            res['dialog_bg'] = await page.get_by_test_id('bonus-dialog').evaluate('e=>[getComputedStyle(e).backgroundColor,getComputedStyle(e).color]')
            await page.keyboard.press('Escape'); await page.wait_for_timeout(300)
            await page.get_by_test_id('theme-toggle-btn').click(); await page.wait_for_timeout(300)
            m0 = await page.evaluate('document.documentElement.dataset.motion||"on"')
            await page.get_by_test_id('motion-toggle-btn').click(); await page.wait_for_timeout(300)
            m1 = await page.evaluate('document.documentElement.dataset.motion||"on"')
            await page.get_by_test_id('motion-toggle-btn').click(); await page.wait_for_timeout(300)
            res['motion'] = [m0, m1]; assert m0 != m1
            return res
        await case('nav_theme_light_dialog_motion', nav_theme_motion)

        async def setup_private():
            hrefs = await page.locator('header a, nav a, footer a').evaluate_all('(es)=>es.map(e=>e.getAttribute("href"))')
            assert not any('setup' in (h or '') for h in hrefs)
            p = await ctx.new_page(); await p.goto(URL + '/#/setup'); await p.get_by_test_id('setup-save-btn').wait_for(); await p.close()
            return hrefs
        await case('setup_loads_not_linked', setup_private)

        async def mobile():
            res = {}
            for w in (390, 320):
                await page.set_viewport_size({'width': w, 'height': 844}); await page.wait_for_timeout(300)
                m = await page.evaluate('''()=>{const W=innerWidth;return {scroll:document.documentElement.scrollWidth,clip:[...document.querySelectorAll('header button, section button, section input, section canvas, section img, section a, #autopsy li')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&(r.left<-1||r.right>W+1)}).map(e=>e.dataset.testid||e.tagName).slice(0,10)}}''')
                res[w] = m
                await page.get_by_test_id('work-section').scroll_into_view_if_needed(); await page.wait_for_timeout(500)
                await page.screenshot(path=str(OUT/f'it3-work-{w}.jpg'), type='jpeg', quality=40)
                assert m['scroll'] <= w and not m['clip'], (w, m)
            await page.set_viewport_size({'width': 1440, 'height': 1000})
            return res
        await case('mobile_390_320_no_overflow', mobile)

        async def about_secret_3000():
            sec = await page.get_by_test_id('secret-section').inner_text()
            about = await page.locator('#about').inner_text()
            assert '3,000' not in sec and '$3,000' in about, ('3000', '3,000' in sec)
            return 'ok'
        await case('about_has_3000_plan_not_in_secret', about_secret_3000)

        async def errs():
            assert not ERRORS, ERRORS
        await case('no_page_errors', errs)
        await browser.close()
    (OUT/'it3-results.json').write_text(json.dumps(RESULTS, indent=2, ensure_ascii=False))
    print('TOTAL', sum(r['passed'] for r in RESULTS), '/', len(RESULTS))

if __name__ == '__main__':
    asyncio.run(main())
