import { chromium } from "playwright";
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";

const [url, form] = process.argv.slice(2);
const CATEGORIES = ["performance", "accessibility", "best-practices", "seo"];

const presetFor = (device) =>
  device === "desktop"
    ? {
      formFactor: "desktop",
      screenEmulation: { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1, disabled: false },
      throttling: { rttMs: 40, throughputKbps: 10240, cpuSlowdownMultiplier: 1 },
    }
    : {
      formFactor: "mobile",
      screenEmulation: { mobile: true, width: 412, height: 823, deviceScaleFactor: 1.75, disabled: false },
      throttling: { rttMs: 150, throughputKbps: 1638.4, cpuSlowdownMultiplier: 4 },
    };

process.env.CHROME_PATH = chromium.executablePath();
const chrome = await chromeLauncher.launch({
  chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu"],
});

let exitCode = 0;

try {
  const { lhr } = await lighthouse(url, {
    port: chrome.port,
    output: "json",
    logLevel: "error",
    onlyCategories: CATEGORIES,
    ...presetFor(form),
  });
  const scores = Object.fromEntries(
    CATEGORIES.map((id) => [id, Math.round((lhr.categories[id]?.score ?? 0) * 100)])
  );
  process.stdout.write(JSON.stringify(scores));
} catch (error) {
  exitCode = 1;
  process.stderr.write(`${error.stack || error}\n`);
} finally {
  await chrome.kill();
  process.exit(exitCode);
}
