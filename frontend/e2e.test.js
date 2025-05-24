const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' // Adjust path to your Chrome if needed
  });

  const page = await browser.newPage();

  console.log("🔄 Opening page...");
  await page.goto('http://localhost:8080');

  console.log("⏳ Waiting for input field...");
  await page.waitForSelector('form input[type="text"]');

  console.log("⌨️ Typing message...");
  await page.type('form input[type="text"]', 'Hello AI!');

  console.log("🚀 Clicking send...");
  await page.click('form button[type="submit"]');

  await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds

  await page.screenshot({ path: 'e2e_result.png' });
  console.log("✅ E2E test completed. Screenshot saved.");

  await browser.close();
})();
