import logger from '@wdio/logger';

import makeAreaScreenshot from './makeAreaScreenshot';
import beforeScreenshot from './beforeScreenshot';
import afterScreenshot from './afterScreenshot';

import scroll from '../scripts/scroll';
import getScrollPosition from '../scripts/getScrollPosition';
import getScreenDimensions from '../scripts/getScreenDimensions';
import ScreenDimension from '../utils/ScreenDimension';

const log = logger('wdio-novus-mutatio-visual-regression-service:makeViewportScreenshot');

// Note: function name must be async to signalize WebdriverIO that this function returns a promise
export default async function makeViewportScreenshot(browser, options = {}) {
  log.info('start viewport screenshot');

  // get current scroll position
  const [startX, startY] = await browser.execute(getScrollPosition);

  // hide scrollbars, scroll to start, hide & remove elements, wait for render
  await beforeScreenshot(browser, options);

  // get screen dimisions to determine viewport height & width
  const screenDimensions = await browser.execute(getScreenDimensions);
  const screenDimension = new ScreenDimension(screenDimensions, browser);

  // make screenshot of area
  const base64Image = await makeAreaScreenshot(
    browser,
    startX,
    startY,
    screenDimension.getViewportWidth(),
    screenDimension.getViewportHeight()
  );

  // show scrollbars, show & add elements
  await afterScreenshot(browser, options);

  // scroll back to original position
  await browser.execute(scroll, startX, startY);

  log.info('end viewport screenshot');

  return base64Image;
}
