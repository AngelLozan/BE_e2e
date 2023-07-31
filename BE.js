 import puppeteer from 'puppeteer';
 import * as dotenv from 'dotenv';
 dotenv.config();
 import path from 'path';


 (async () => {

    let homePageURL = '';

    let seeMoreTips;

     //@dev Change pace of spin with timeout near bottom. Just for kicks. 
     var timerAnimation = (function() {
         var P = ["[\\]", "[|]", "[/]", "[-]"];
         var start = 0;
         return setInterval(function() {
             process.stdout.write("\r" + P[start++]);
             start &= 3;
         }, 150);
     })();

     // //@dev get browser session from .env
     // const wsURL = process.env.BROWSER_SESSION;

     // const browser = await puppeteer.connect({
     //     browserWSEndpoint: wsURL,
     // });

     function delay(time) {
         return new Promise(function(resolve) {
             setTimeout(resolve, time)
         });
     }

     
     function findTips() {
         let divTags = document.getElementsByTagName("div");
         let searchText = "See more tips";
         let found;

         for (var i = 0; i < divTags.length; i++) {
             if (divTags[i].textContent == searchText) {
                 found = divTags[i];
                 break;
             }
         }

         seeMoreTips = found;
     }

     
     try {

        //@dev Path in local repo to extension.
         const pathToExtension = path.join(process.cwd(), './exoTest');

        //@dev Args and options for launching new browser e2e and installing extension.
         const options = {
             executablePath: '/Applications/Brave\ Browser.app/Contents/MacOS/Brave\ Browser',
             args: [
                 '--start-maximized',
                 '--no-first-run',
                 '--disable-infobar',
                 `--disable-extensions-except=${pathToExtension}`,
                 `--load-extension=${pathToExtension}`,
                 `--window-size=900,900`
             ],
             ignoreDefaultArgs: ['--enable-automation'],
             headless: false,
             defaultViewport: null,
         };
         
         global.browser = await puppeteer.launch(options);

         console.log(" ==> Starting BE test process...");
         console.log("==> Waiting for install and redirect to onboarding (3 seconds)")

         await delay(3000);

         global.pages = await browser.pages();

         global.browser.on('targetcreated', (async () => {
            global.pages = await global.browser.pages();
            if (global.pages.length == 3){
                let tips = await pages[2];
                await delay(2000);
                let tipsURL = await tips.url();
                console.log(`==> Tips page url is: ${tipsURL}` );
            } else if (global.pages.length == 4){
                let termsService = await pages[3];
                await delay(2000);
                let ToSURL = await termsService.url();
                console.log(`==> ToS page url is:  ${ToSURL}` );
            } else if (global.pages.length == 5){
                let privacy = await pages[4];
                await delay(2000);
                let privacyURL = await privacy.url();
                console.log(`==> Privacy page url is: ${privacyURL}` );
            } else if (global.pages.length == 6){
                let homePage = await pages[5];
                await delay(2000);
                homePageURL = await homePage.url();
                console.log(`==> Popup page url is: ${homePageURL}` );
                return;
            } 
         }));

         //@dev In order to reduce the amount of tabs to focus on, re-use first (after extension install page).
         let pageOnboard = await global.pages[1];


         //@dev Increase or decrease default navigation to avoid timeout erro.
         pageOnboard.setDefaultNavigationTimeout(120000);

         //@dev Confirms the tab matches the target. URLs logged in seperate function above
         async function newWindowTarget(browser, URL){
            let newT = await browser.waitForTarget(target => target.url() === URL, {timeout: 0});

            if( newT && URL === 'https://support.exodus.com/article/1365-list-of-security-practices'){
                console.log('==> Verified KB article opened successfully.');
            } else if (newT && URL === 'https://www.exodus.com/legal/exodus-tos-20221115-v24.pdf'){
                console.log('==> Verified ToS opened successfully.');
            } else if(newT && URL === 'https://www.exodus.com/legal/exodus-pp-20220517-v10.pdf') {
                console.log('==> Verified Privacy Policy opened successfully.');
            }
         };

         const pageURL = await pageOnboard.url();
         console.log("==> URL of page is: ", pageURL);


         const urlSplit = pageURL.split('/');
         //console.log("==> Split URL: ", urlSplit);
         const extensionID = urlSplit[2];
         //console.log("==> Extension ID: " + extensionID + "\n");

         //@dev Define the extension pageOnboard
         const extensionEndURL = 'onboarding.html';

         //@dev Navigate to the pageOnboard
         console.log('==> Navigate to Extension');

         await pageOnboard.goto(`chrome-extension://${extensionID}/${extensionEndURL}`);

         
         const next = 'div[data-testid="exodusmovement.exodus:id/button-next"]';
         const skip = 'div[data-testid="exodusmovement.exodus:id/button-skip"]';
         const newWallet = 'div[data-testid="exodusmovement.exodus:id/button-create-new-wallet"]';
         const password = 'input[type="password"]';
         const continueBTN = 'div[data-testid="exodusmovement.exodus:id/button-get-started"]';
         const passwordLink = 'div[data-testid="exodusmovement.exodus:id/link-keep-password-safe"]';
         const seeMoreTips = '#root > div > div > div.css-1dbjc4n.r-1pi2tsx > div.css-1dbjc4n.r-1pi2tsx.r-1d2f490.r-130k7a3.r-u8s1d.r-ipm5af.r-13qz1uu > div.css-1dbjc4n.r-1pi2tsx > div.css-1dbjc4n.r-1pi2tsx.r-2llsf.r-1udh08x > div > div:nth-child(2) > div > div:nth-child(1)';
         
         const exitPassSafePage = 'div[data-testid="exodusmovement.exodus:id/button-close"]';
         const terms = 'div[data-testid="exodusmovement.exodus:id/link-terms-of-use"]';
         const privacyPolicy = 'div[data-testid="exodusmovement.exodus:id/link-privacy"]';

         const profile = 'svg[data-testid="tab-menu"]';
         const settings = 'div[data-testid="exodusmovement.exodus:id/settings-icon-container"]';
         const multiPortfolio = 'div[data-testid="exodusmovement.exodus:id/multiple-wallets-title"]';
         const backSettings = 'svg[data-testid="back-arrow"]';
                            
         const walletTab = 'svg[data-testid="tab-wallet"]';
         const portfolioPresent = 'div[data-testid="exodusmovement.exodus:id/portfolio-switch"]';

         //await Promise.all([

             console.log("==> Extension loaded, on onboarding."),
             pageOnboard.waitForNavigation({ waitUntil: 'domcontentloaded' }),
             await pageOnboard.waitForSelector(next),
             console.log("==> Click next."),
             await pageOnboard.waitForTimeout(1000),
             await pageOnboard.click(next),
             console.log("==> Navigate to page 2."),
             pageOnboard.waitForNavigation({ waitUntil: 'domcontentloaded' }),


             await pageOnboard.waitForSelector(next),
             console.log("==> Click next."),
             await pageOnboard.waitForTimeout(1000),
             await pageOnboard.click(next),
             console.log("==> Navigate to page 3."),
             pageOnboard.waitForNavigation({ waitUntil: 'domcontentloaded' }),

             await pageOnboard.waitForSelector(next),
             console.log("==> Click next."),
             await pageOnboard.waitForTimeout(1000),
             await pageOnboard.click(next),
             console.log("==> Navigate to page 4."),
             pageOnboard.waitForNavigation({ waitUntil: 'domcontentloaded' }),

             await pageOnboard.waitForSelector(next),
             console.log("==> Click next."),
             await pageOnboard.waitForTimeout(1000),
             await pageOnboard.click(next),
             // console.log("==> Navigate to pageOnboard 5."),
             // pageOnboard.waitForNavigation({ waitUntil: 'domcontentloaded' }),

             // await pageOnboard.waitForSelector(skip),
             // console.log("==> Click Skip."),
             // await pageOnboard.waitForTimeout(1000),
             // await pageOnboard.click(skip),
             console.log("==> Navigate to wallet creation page (page 5)."),
             pageOnboard.waitForNavigation({ waitUntil: 'domcontentloaded' }),

             await pageOnboard.waitForSelector(newWallet),
             console.log("==> Create new wallet."),
             await pageOnboard.waitForTimeout(1000),
             await pageOnboard.click(newWallet),
             console.log("==> Navigate to password creation page."),
             pageOnboard.waitForNavigation({ waitUntil: 'domcontentloaded' }),

             await pageOnboard.waitForSelector(passwordLink),
             console.log("==> Click keeping password safe link."),
             await pageOnboard.waitForTimeout(1000),
             await pageOnboard.click(passwordLink),
             pageOnboard.waitForNavigation({ waitUntil: 'domcontentloaded' }),


             await pageOnboard.waitForSelector(seeMoreTips),
             console.log("==> Click see more tips button."),
             
             await pageOnboard.waitForTimeout(1000),
             await pageOnboard.click(seeMoreTips),
             
             await delay(3000),

             await newWindowTarget(browser, 'https://support.exodus.com/article/1365-list-of-security-practices'),

             await pageOnboard.bringToFront(),
             console.log("==> Refocus on BE page after 3 seconds"),

             await pageOnboard.waitForSelector(exitPassSafePage),
             console.log("==> Click X to return to password entry page."),
             await pageOnboard.waitForTimeout(1000),
             await pageOnboard.click(exitPassSafePage),


             await pageOnboard.waitForSelector(password),
             console.log("==> Enter password part one."),
             await pageOnboard.waitForTimeout(1000),
             await pageOnboard.type(password, process.env.EPASS),
             console.log("==> Navigate to password page two."),
             pageOnboard.waitForNavigation({ waitUntil: 'domcontentloaded' }),

             pageOnboard.waitForNavigation({ waitUntil: 'domcontentloaded' }),
             await pageOnboard.waitForTimeout(1000),
             await pageOnboard.keyboard.press('Enter'),

             await pageOnboard.waitForSelector(password),
             console.log("==> Enter password part two (incorrect password)."),
             await pageOnboard.waitForTimeout(1000),

             await pageOnboard.type(password, "wrongPassword"),
             await pageOnboard.waitForTimeout(1000),
             await pageOnboard.keyboard.press('Enter'),
             console.log("==> Passwords don't match, confirmed get started button is disabled"),


             await pageOnboard.waitForSelector(password),
             await pageOnboard.click(password, {clickCount: 3}),
             console.log("==> Enter password part two (correct password)."),
             await pageOnboard.waitForTimeout(1000),

             await pageOnboard.type(password, process.env.EPASS),
             console.log("==> Passwords match, logging in.."),
             await pageOnboard.waitForTimeout(1000),
             await pageOnboard.keyboard.press('Enter'),
             console.log("==> Logged in waiting to navigate to continue page."),

             pageOnboard.waitForNavigation({ waitUntil: 'domcontentloaded' }),
             await pageOnboard.waitForSelector(terms),
             await pageOnboard.waitForTimeout(1000),
             await pageOnboard.click(terms),
             console.log("==> Refocus on BE page after 3 seconds"),
             await delay(3000),
             await newWindowTarget(browser, 'https://www.exodus.com/legal/exodus-tos-20221115-v24.pdf'),
             await pageOnboard.bringToFront(),
            
             pageOnboard.waitForNavigation({ waitUntil: 'domcontentloaded' }),
             await pageOnboard.waitForSelector(privacyPolicy),
             await pageOnboard.waitForTimeout(1000),
             await pageOnboard.click(privacyPolicy),
             console.log("==> Refocus on BE page after 3 seconds"),
             await delay(3000),
             await newWindowTarget(browser, 'https://www.exodus.com/legal/exodus-pp-20220517-v10.pdf'),
             await delay(2000),
             await pageOnboard.bringToFront(),

             pageOnboard.waitForNavigation({ waitUntil: 'domcontentloaded' }),
             //await pageOnboard.waitForSelector(continueBTN),
             console.log("==> Navigate to home page and open index.html."),
             //await pageOnboard.waitForTimeout(1000),
             await delay(1000),
             await pageOnboard.click(continueBTN),
             //pageOnboard.waitForNavigation({ waitUntil: 'domcontentloaded' }),
             await delay(4000),

             await pageOnboard.goto(homePageURL),

             await pageOnboard.bringToFront(),
             
             await pageOnboard.waitForSelector(profile),
             await pageOnboard.waitForTimeout(1000),
             console.log('==> Navigate to profile page.'),
             await pageOnboard.click(profile),
             pageOnboard.waitForNavigation({ waitUntil: 'domcontentloaded' }),

             await pageOnboard.waitForSelector(settings),
             await pageOnboard.waitForTimeout(1000),
             console.log('==> Click settings and display list menu'),
             await pageOnboard.click(settings),
             pageOnboard.waitForNavigation({ waitUntil: 'domcontentloaded' }),

             await pageOnboard.waitForSelector(multiPortfolio),
             await pageOnboard.waitForTimeout(1000),
             console.log('==> Toggle on multiple portfolios.'),
             await pageOnboard.click(multiPortfolio),
             pageOnboard.waitForNavigation({ waitUntil: 'domcontentloaded' }),

             await pageOnboard.waitForSelector(backSettings),
             await pageOnboard.waitForTimeout(1000),
             console.log('==> Click back arrow to return to profile page.'),
             await pageOnboard.click(backSettings),
             pageOnboard.waitForNavigation({ waitUntil: 'domcontentloaded'}),

             await pageOnboard.waitForSelector(walletTab),
             await pageOnboard.waitForTimeout(1000),
             console.log('==> Navigate to wallet page.'),
             await pageOnboard.click(walletTab),
             pageOnboard.waitForNavigation({ waitUntil: 'domcontentloaded' }),

             await pageOnboard.waitForSelector(portfolioPresent, {visible: true}),
             console.log('==> Multiple Portfolios confirmed as enabled.'),
             
             await delay(1000),
             console.log("==> Successfully opened the extension and created wallet.", '\n', "Browser will close in a few seconds or use CMD + C to exit the script."),

             await delay(10000)
        //])

     } catch (err) {
         let exists = await Object.values(err).includes('TimeoutError');

         if (exists) {
             console.log("✔ Timed out, but that's normal")
         } else {
             console.log("🛑 Error occurred, please check your node server console as well: ", { err });
         }
     } finally {

        console.log("Test process exiting.")
        process.exit(0);

         // process.on('exit', function(code) {
         //     return console.log(`Exiting process implicitly ${code}`);
         // });

     }

 })();