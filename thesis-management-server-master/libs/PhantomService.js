const puppeteer = require('puppeteer');
const setting = require('../config/setting.json');

class PhantomService {
    static async login(username, password, res) {
        try {
            let infoDetail = ['id','fullName','gender','birthday','address','phone','email','semesterMark'];
            const openBrowser = puppeteer.launch({headless: true});
            const browser = await openBrowser;
            const page = await browser.newPage();
            await page.goto(`${setting['VNU_SYSTEM'].url}/dkmh/login.asp`, { waitUntil: 'networkidle0' }); // wait until page load
            await page.type('#txtLoginId', username),
            await page.type('#txtPassword', password),
            await page.select('#txtSel','2')
            await Promise.all([
                    page.keyboard.press('Enter'),
                    page.waitForNavigation({ waitUntil: 'networkidle0' }),
            ])
            await page.goto(`${setting['VNU_SYSTEM'].url}/StdInfo/TabStdInfo.asp`, { waitUntil: 'networkidle0' }); 
            const tdTags = await page.evaluate(() =>
                [...document.querySelectorAll('td')].map(ele => ele.innerText)
            );
            await browser.close()
            let info = {}
            for(let i = 2; i <= 40; i += 2){
                info[tdTags[i].replace(': ','').trim()] = tdTags[i+1].trim()
            }
            console.log(info)
            res.status(200).json({result: info, httpCode: 200});
            return info 
        } catch (error) {
            res.status(500).json({error: {...error, name: 'user not exist'}})
        }
    }
}

module.exports = PhantomService
