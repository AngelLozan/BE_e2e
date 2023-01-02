# Exodus Browser Extension Automation Demo

![Browser Extension Picture](https://github.com/AngelLozan/BE_Automation/blob/main/browser.png?raw=true)

A repository to demonstrate the capabilities of browser extension automation for the Exodus Wallet browser extension QA team. 

## Getting Started


### Installation

Clone project and run:

```bash
npm i
```

### Required environment

- Nodejs
- Brave or Chrome browser

### Usage

1. Copy the distribution file of your choosing for the Browser Extension(BE) to the root directory. Rename it `exoTest`

2. Create a `.env` file with your desired password for the BE when creating a wallet or restoring. 

#### Example

> EPASS='yourpassword'

3. To start the test run `npm run demo`

*Tests are output in the console.*


### Connect to existing session (⏰ Work in progress, will complete if moving forward with puppeteer)

1. Install nodejs or ensure it is up to date on your machine.

2. Clone project to your computer. Install dependencies with `npm i`

3. Start Chrome/Brave with remote debugging enabled.

>MAC

```
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --no-first-run --no-default-browser-check --user-data-dir=$(mktemp -d -t 'chrome-remote_data_dir')


OR


/Applications/Brave\ Browser.app/Contents/MacOS/Brave\ Browser --remote-debugging-port=9222 --no-first-run --no-default-browser-check --user-data-dir=$(mktemp -d -t 'chrome-remote_data_dir')
```

>You’ll see a printout like this:

`DevTools listening on ws://localhost:9222/devtools/browser/41a0b5f0–6747–446a-91b6–5ba30c87e951`

4. Copy websocketDebuggerUrl value(ws URL)

5. Assign variable in .env file to the ws URL. Example from above: `BROWSER_SESSION='ws://localhost:9222/devtools/browser/41a0b5f0–6747–446a-91b6–5ba30c87e951'`

6. Edit BE.js to uncomment this section:

```bash
// //@dev get browser session from .env
     // const wsURL = process.env.BROWSER_SESSION;

     // const browser = await puppeteer.connect({
     //     browserWSEndpoint: wsURL,
     // });
 ```


7. 