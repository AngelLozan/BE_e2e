// import { describe } from 'mocha';
import { assert } from 'chai';
import puppeteer, { launch } from 'puppeteer';

describe('puppeteer', () => {
	describe('launch', () => {
		it('Should launch the browser', async () => {
			await puppeteer.launch();
		})
	})
});