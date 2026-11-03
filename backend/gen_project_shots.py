"""One-off: capture public landing pages for project cards."""
import asyncio
from pathlib import Path

from playwright.async_api import async_playwright

OUT = Path(__file__).resolve().parents[1] / "frontend/public/projects"
PAGES = {"equityiq": "https://calm-white-cloud.lovable.app/", "trusthire": "https://trust-hire.lovable.app/"}


async def main():
    OUT.mkdir(parents=True, exist_ok=True)
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={"width": 1440, "height": 900})
        for name, url in PAGES.items():
            await pg.goto(url, wait_until="networkidle", timeout=60000)
            await pg.wait_for_timeout(4000)
            await pg.screenshot(path=str(OUT / f"{name}.jpg"), type="jpeg", quality=78)
            print(name, "ok")
        await b.close()


asyncio.run(main())
