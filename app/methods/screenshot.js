exports.takeScreenshot = async function (url, image_path){
    const puppeteer = require('puppeteer');
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.setViewport({width:375, height: await page.evaluate(() => document.body.clientHeight)})
    await page.goto(url);
    await page.waitForTimeout(5000);
    await page.screenshot({path:image_path, fullPage:true});
    await browser.close();
}