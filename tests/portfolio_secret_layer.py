"""Iteration 2: Secret Layer LSB puzzle, decoder, Autopsy chart, content updates, regressions."""
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
EXPECT = {1: 2, 2: 0, 3: 1}  # plate -> channel index carrying the letters

# Reference LSB plane means straight from the PNGs (proves canvas reads exact bits)
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
    except Exception as e:
        RESULTS.append({'name': name, 'passed': False, 'error': traceback.format_exc()}); print('FAIL', name, traceback.format_exc(), flush=True)

async def click(p, tid):
    loc = p.get_by_test_id(tid); await loc.scroll_into_view_if_needed(); await loc.click()

def norm_text(t):
    return re.sub(r'[^a-z]', '', t.lower())

async def main():
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(executable_path=os.environ['PLAYWRIGHT_CHROME_EXECUTABLE_PATH'], headless=True, args=['--no-sandbox'])
        ctx = await browser.new_context(viewport={'width': 1440, 'height': 1000})
        page = await ctx.new_page(); page.set_default_timeout(9000)
        page.on('pageerror', lambda e: ERRORS.append(str(e)))
        await page.goto(URL); await page.get_by_test_id('secret-section').wait_for()

        async def no_answer_in_dom():
            html = await page.content(); body = await page.locator('body').inner_text()
            sec = await page.get_by_test_id('secret-section').inner_text()
            secret_html = await page.get_by_test_id('secret-section').inner_html()
            hits_upper = 'OUT LOUD' in body
            assert 'outloud' not in norm_text(sec) and 'outloud' not in norm_text(secret_html), 'answer in secret section'
            assert await page.get_by_test_id('decipher-text-route-btn').count() == 0
            brand = [m for m in re.findall(r'.{0,30}out ?loud.{0,30}', body, re.I)]
            return {'OUT_LOUD_upper_in_body': hits_upper, 'brand_mentions_case_insensitive': brand[:6]}
        await case('answer_absent_from_secret_section_dom_and_no_text_clues', no_answer_in_dom)

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
                await page.get_by_test_id('decipher-canvas').screenshot(path=str(OUT/f'it2-plate{i}-plane0.jpg'), type='jpeg', quality=40)
                # higher planes of correct channel must equal other channels (no hidden letters)
                await page.get_by_test_id('decipher-slider').fill('7'); await page.wait_for_timeout(150)
                a = await page.evaluate(STATS_JS)
                await click(page, f'decipher-channel-{CH[(EXPECT[i]+1)%3]}'); await page.wait_for_timeout(150)
                b = await page.evaluate(STATS_JS)
                assert abs(a['mean'] - b['mean']) < 1e-6, (a, b)
            return out
        await case('bit_plane_letters_only_in_expected_channel_plane0', bitplanes)

        async def hints():
            await click(page, 'plate-tab-1')
            texts = []
            for _ in range(3):
                await click(page, 'decipher-hint-btn'); await page.wait_for_timeout(100)
            ps = await page.get_by_test_id('decipher-hints').locator('p').all_inner_texts()
            assert len(ps) == 4, ps
            assert 'blue' in ps[3].lower() and 'plane 0' in ps[3].lower(), ps
            await click(page, 'plate-tab-2'); await page.wait_for_timeout(100)
            ps2 = await page.get_by_test_id('decipher-hints').locator('p').all_inner_texts()
            assert 'red' in ps2[3].lower()
            await click(page, 'plate-tab-3'); await page.wait_for_timeout(100)
            ps3 = await page.get_by_test_id('decipher-hints').locator('p').all_inner_texts()
            assert 'green' in ps3[3].lower()
            for t in ps + ps2 + ps3: assert 'outloud' not in norm_text(t)
            assert 'All hints shown' in await page.get_by_test_id('decipher-hint-btn').inner_text()
            return ps + [ps2[3], ps3[3]]
        await case('hints_three_plus_per_plate_strong_no_answer', hints)

        async def answers():
            r = {}
            await click(page, 'easter-egg-submit-btn')
            assert await page.get_by_test_id('easter-egg-feedback').inner_text() == 'Enter an answer first.'
            await page.get_by_test_id('easter-egg-input').fill('out'); await click(page, 'easter-egg-submit-btn'); await page.wait_for_timeout(200)
            assert 'Not quite' in await page.get_by_test_id('easter-egg-feedback').inner_text()
            r['shake'] = await page.locator('.animate-shake').count()
            assert r['shake'] == 1
            assert await page.get_by_test_id('easter-egg-reveal').count() == 0
            for g in ['out loud', 'OUTLOUD', 'Out-Loud', '  out  loud ']:
                await click(page, 'easter-egg-reset-btn')
                await page.get_by_test_id('easter-egg-input').fill(g); await click(page, 'easter-egg-submit-btn')
                await page.get_by_test_id('easter-egg-reveal').wait_for()
                r[g] = await page.get_by_test_id('easter-egg-answer').inner_text()
                assert await page.get_by_test_id('easter-egg-solve-status').text_content() == 'Solved'
            await click(page, 'easter-egg-reset-btn')
            assert await page.get_by_test_id('easter-egg-input').input_value() == '' and await page.get_by_test_id('easter-egg-reveal').count() == 0
            assert await page.get_by_test_id('easter-egg-reset-btn').count() == 0
            return r
        await case('answer_empty_wrong_shake_variants_reset', answers)

        async def method():
            await page.reload(); await page.get_by_test_id('secret-section').wait_for()
            await click(page, 'plate-tab-2'); await page.get_by_test_id('decipher-canvas').wait_for()
            await click(page, 'easter-egg-spoiler-btn'); await page.wait_for_timeout(200)
            assert await page.get_by_test_id('easter-egg-method').is_visible()
            res = {}
            for i in (2, 1, 3):
                await click(page, f'plate-tab-{i}'); await page.get_by_test_id('decipher-canvas').wait_for(); await page.wait_for_timeout(250)
                ch = await page.get_by_test_id(f'decipher-channel-{CH[EXPECT[i]]}').get_attribute('aria-checked')
                pl = await page.get_by_test_id('decipher-slider').input_value()
                s = await page.evaluate(STATS_JS)
                res[i] = (ch, pl, round(s['center'], 3))
                assert ch == 'true' and pl == '0' and s['center'] > 0.6, res
            assert len(await page.get_by_test_id('decipher-hints').locator('p').all_inner_texts()) == 4
            sec = await page.get_by_test_id('secret-section').inner_html()
            assert 'outloud' not in norm_text(sec)
            # user can still move off the method state
            await click(page, 'decipher-channel-red'); await page.get_by_test_id('decipher-slider').fill('3'); await page.wait_for_timeout(100)
            res['manual_override_channel_red'] = await page.get_by_test_id('decipher-channel-red').get_attribute('aria-checked')
            await page.get_by_test_id('easter-egg-input').fill('out loud'); await click(page, 'easter-egg-submit-btn')
            await page.get_by_test_id('easter-egg-reveal').wait_for()
            res['status'] = await page.get_by_test_id('easter-egg-solve-status').text_content()
            assert res['status'] == 'Solved with the method'
            assert await page.get_by_test_id('easter-egg-method').count() == 0
            await click(page, 'easter-egg-reset-btn')
            return res
        await case('show_method_sets_channel_plane_follows_plates_no_answer', method)

        async def decoder():
            await click(page, 'decoder-source-master-btn')
            for pw_ in ['out loud', 'outloud']:
                await page.get_by_test_id('decoder-pass-input').fill(pw_); await click(page, 'decoder-run-btn')
                await page.get_by_test_id('decoder-result').wait_for()
                assert await page.get_by_test_id('decoder-status').inner_text() == 'Decoded. Checksum matches.'
            await page.get_by_test_id('decoder-pass-input').fill('out'); await click(page, 'decoder-run-btn'); await page.wait_for_timeout(1200)
            st = await page.get_by_test_id('decoder-status').inner_text()
            assert 'Wrong passphrase' in st, st
            await click(page, 'decoder-reset-btn')
            assert await page.get_by_test_id('decoder-pass-input').input_value() == '' and await page.get_by_test_id('decoder-source-name').count() == 0
            return st
        await case('decoder_master_plate_pass_wrong_retry', decoder)

        async def autopsy():
            assert await page.locator('[data-testid^="proposal-card"]').count() == 0
            await click(page, 'autopsy-card-toggle-6'); await page.get_by_test_id('decision-chart-6').wait_for()
            rows = await page.get_by_test_id('decision-chart-6').locator('li').all_inner_texts()
            rows = [r.replace('\n', ' ') for r in rows]
            assert len(rows) == 10 and rows[0].startswith('France') and '5.86k' in rows[0] and rows[-1].startswith('United States') and rows[-1].endswith('640'), rows
            widths = await page.get_by_test_id('decision-chart-6').locator('li span span').evaluate_all('(es)=>es.map(e=>e.getBoundingClientRect().width)')
            assert widths == sorted(widths, reverse=True), widths
            assert await page.get_by_test_id('decision-stats-6').is_visible()
            ev = await page.get_by_test_id('decision-evidence-6').inner_text()
            assert 'Cloudflare' in ev
            await page.get_by_test_id('decision-chart-6').screenshot(path=str(OUT/'it2-chart.jpg'), type='jpeg', quality=40)
            return rows
        await case('autopsy_d06_chart_stats_evidence_no_proposals', autopsy)

        async def content():
            assert await page.locator('[data-testid^="project-card-"]').count() == 5
            ip = await page.get_by_test_id('projects-in-progress').inner_text()
            r1 = await page.get_by_test_id('receipt-card-1').inner_text()
            assert 'Spoken record' in r1 or 'SPOKEN RECORD' in r1.upper()
            assert 'client initially asked' in r1
            assert await page.get_by_test_id('speed-tests').is_visible()
            log = await page.get_by_test_id('receipt-build-log').locator('p').inner_text()
            entries = [l for l in log.split('\n') if re.match(r'^\d\d ', l)]
            bharat = await page.get_by_test_id('bharat-section').inner_text()
            assert 'E-Cell' in bharat and '2024' in bharat
            assert len(entries) == 7, entries
            return {'in_progress': ip, 'log_entries': len(entries)}
        await case('projects_five_receipts_spoken_record_buildlog_bharat_ecell', content)

        async def motion_canvas():
            await click(page, 'plate-tab-1'); await page.get_by_test_id('decipher-canvas').wait_for(); await page.wait_for_timeout(200)
            before = await page.evaluate(STATS_JS)
            await page.get_by_test_id('motion-toggle-btn').click(); await page.wait_for_timeout(400)
            after = await page.evaluate(STATS_JS)
            await page.get_by_test_id('motion-toggle-btn').click(); await page.wait_for_timeout(400)
            again = await page.evaluate(STATS_JS)
            assert after['w'] == 720 and abs(after['mean'] - before['mean']) < 1e-6 and abs(again['mean'] - before['mean']) < 1e-6, (before, after, again)
            return {'mean': before['mean']}
        await case('motion_toggle_keeps_canvas_drawn', motion_canvas)

        async def setup_private():
            hrefs = await page.locator('header a, nav a, footer a').evaluate_all('(es)=>es.map(e=>e.getAttribute("href"))')
            assert not any('setup' in (h or '') for h in hrefs)
            p = await ctx.new_page(); await p.goto(URL + '/#/setup'); await p.get_by_test_id('setup-save-btn').wait_for(); await p.close()
            return hrefs
        await case('setup_loads_not_linked', setup_private)

        async def mobile():
            res = {}
            for w in (390, 320):
                await page.set_viewport_size({'width': w, 'height': 844}); await page.wait_for_timeout(200)
                await page.get_by_test_id('secret-section').scroll_into_view_if_needed()
                m = await page.evaluate('''()=>{const W=innerWidth;return {scroll:document.documentElement.scrollWidth,clip:[...document.querySelectorAll('header button, #secret button, #secret input, #secret canvas, #autopsy li')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&(r.left<-1||r.right>W+1)}).map(e=>e.dataset.testid||e.tagName)}}''')
                res[w] = m
                await page.get_by_test_id('decipher-bench').screenshot(path=str(OUT/f'it2-bench-{w}.jpg'), type='jpeg', quality=40)
                assert m['scroll'] <= w and not m['clip'], (w, m)
            await page.set_viewport_size({'width': 1440, 'height': 1000})
            return res
        await case('mobile_390_320_no_overflow_secret_autopsy', mobile)

        async def print_one():
            from pypdf import PdfReader
            await page.emulate_media(media='print'); await page.pdf(path=str(OUT/'it2-print.pdf'), format='A4', print_background=True, prefer_css_page_size=True)
            r = PdfReader(str(OUT/'it2-print.pdf')); txt = '\n'.join(x.extract_text() for x in r.pages)
            await page.emulate_media(media='screen')
            assert len(r.pages) == 1, len(r.pages)
            return {'pages': len(r.pages), 'has_answer_upper': 'OUT LOUD' in txt.upper()}
        await case('print_resume_one_page', print_one)

        async def errs():
            assert not ERRORS, ERRORS
        await case('no_page_errors', errs)
        await browser.close()
    (OUT/'it2-results.json').write_text(json.dumps(RESULTS, indent=2))
    print('TOTAL', sum(r['passed'] for r in RESULTS), '/', len(RESULTS))

if __name__ == '__main__':
    asyncio.run(main())
