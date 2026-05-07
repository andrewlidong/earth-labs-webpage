import { chromium } from "playwright";
import fs from "node:fs";

fs.mkdirSync("/tmp/elshots", { recursive: true });
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});
const page = await ctx.newPage();
await page.goto("http://localhost:3001/", { waitUntil: "networkidle" });
await page.waitForTimeout(4500);
await page.mouse.move(960, 280);
await page.waitForTimeout(700);

const sections = ["hero", "thesis", "model", "evidence", "team", "footer"];
for (const id of sections) {
  if (id === "hero") {
    await page.evaluate(() => window.scrollTo(0, 0));
  } else if (id === "footer") {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  } else {
    await page.evaluate((id) => {
      document.getElementById(id)?.scrollIntoView({ block: "start" });
    }, id);
  }
  await page.waitForTimeout(2200);
  await page.screenshot({ path: `/tmp/elshots/${id}.png` });
  console.log("shot", id);
}
await browser.close();
