exports.takeScreenshot = async function (url, image_path){
    const puppeteer = require('puppeteer');
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.setViewport({width:1200, height: 800})
    await page.goto(url);
    await page.screenshot({path:image_path + 'screenshot.png', fullPage:true});
    await browser.close();
}