const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const SCREENSHOTS_DIR = path.join(__dirname, 'ux-screenshots');
if (!fs.existsSync(SCREENSHOTS_DIR)) fs.mkdirSync(SCREENSHOTS_DIR);

const EMAIL = 'sandreum08@gmail.com';
const PASSWORD = 'Sandra08';
const BASE = 'http://localhost:3000';

let screenshotIndex = 0;
async function shot(page, name) {
  screenshotIndex++;
  const filename = `${String(screenshotIndex).padStart(2,'0')}-${name}.png`;
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, filename), fullPage: false });
  console.log(`📸 ${filename}`);
}

async function wait(ms) {
  return new Promise(r => setTimeout(r, ms));
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, // iPhone 14 size
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  // Capture console errors
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', err => errors.push(err.message));

  console.log('\n=== 1. LANDING PAGE (usuario nuevo) ===');
  await page.goto(BASE + '/landing');
  await wait(2500);
  await shot(page, 'landing');

  console.log('\n=== 2. LOGIN PAGE ===');
  await page.goto(BASE + '/login');
  await wait(1500);
  await shot(page, 'login-empty');

  // Try wrong password first (to see error state)
  await page.fill('#login-email', EMAIL);
  await page.fill('#login-password', 'wrongpass');
  await shot(page, 'login-filled');
  await page.click('button[type="submit"]');
  await wait(3000);
  await shot(page, 'login-error');

  // Correct login
  await page.fill('#login-password', PASSWORD);
  await page.click('button[type="submit"]');
  await wait(4000);
  await shot(page, 'after-login');
  console.log('Current URL after login:', page.url());

  console.log('\n=== 3. FEED ===');
  await page.goto(BASE + '/feed');
  await wait(2500);
  await shot(page, 'feed-list');
  // Try to click first post if any
  const feedPosts = await page.$$('[class*="feed-post"]');
  if (feedPosts.length > 0) {
    await feedPosts[0].click();
    await wait(1500);
    await shot(page, 'feed-detail');
    await page.goBack();
    await wait(1000);
  }

  console.log('\n=== 4. EVENTS ===');
  await page.goto(BASE + '/events');
  await wait(2500);
  await shot(page, 'events-list');
  // Click first event
  const eventCards = await page.$$('[class*="event-card"]');
  console.log(`Found ${eventCards.length} event cards`);
  if (eventCards.length > 0) {
    await eventCards[0].click();
    await wait(2000);
    await shot(page, 'event-detail');
    // Look for vote/attend button
    await shot(page, 'event-detail-scroll');
    // Scroll down
    await page.evaluate(() => window.scrollBy(0, 300));
    await wait(500);
    await shot(page, 'event-detail-bottom');
    await page.goBack();
    await wait(1000);
  }

  console.log('\n=== 5. CREATE EVENT (only if admin/secretary) ===');
  await page.goto(BASE + '/create-events');
  await wait(2000);
  await shot(page, 'create-event-step1');
  // Check what the form looks like
  await page.evaluate(() => window.scrollBy(0, 200));
  await wait(300);
  await shot(page, 'create-event-step1-scroll');

  console.log('\n=== 6. MEMBERS ===');
  await page.goto(BASE + '/members');
  await wait(2500);
  await shot(page, 'members-list');
  // Scroll to see more
  await page.evaluate(() => window.scrollBy(0, 300));
  await wait(300);
  await shot(page, 'members-list-scroll');
  // Try clicking first member
  const memberCards = await page.$$('[class*="member-card"], [class*="member-item"], [class*="member-row"]');
  console.log(`Found ${memberCards.length} member elements`);
  if (memberCards.length > 0) {
    await memberCards[0].click();
    await wait(1500);
    await shot(page, 'member-detail');
    await page.goBack();
    await wait(1000);
  }

  console.log('\n=== 7. NOTIFICATIONS ===');
  await page.goto(BASE + '/notifications');
  await wait(2000);
  await shot(page, 'notifications');

  console.log('\n=== 8. PROFILE ===');
  await page.goto(BASE + '/profile');
  await wait(2000);
  await shot(page, 'profile');
  await page.evaluate(() => window.scrollBy(0, 400));
  await wait(300);
  await shot(page, 'profile-scroll');

  console.log('\n=== 9. EDIT PROFILE ===');
  await page.goto(BASE + '/profile/edit');
  await wait(1500);
  await shot(page, 'edit-profile');

  console.log('\n=== 10. CHANGE PASSWORD ===');
  await page.goto(BASE + '/profile/change-password');
  await wait(1500);
  await shot(page, 'change-password');

  console.log('\n=== 11. GROUP SETTINGS ===');
  await page.goto(BASE + '/profile/group-settings');
  await wait(1500);
  await shot(page, 'group-settings');

  console.log('\n=== 12. NOTIFICATIONS SETTINGS ===');
  await page.goto(BASE + '/profile/notifications-settings');
  await wait(1500);
  await shot(page, 'notifications-settings');

  console.log('\n=== 13. LANGUAGE SETTINGS ===');
  await page.goto(BASE + '/profile/language');
  await wait(1500);
  await shot(page, 'language-settings');

  console.log('\n=== 14. LINKED MEMBERS ===');
  await page.goto(BASE + '/members/linked');
  await wait(2000);
  await shot(page, 'linked-members');

  console.log('\n=== 15. FORGOT PASSWORD (public) ===');
  await page.goto(BASE + '/forgot-password');
  await wait(1500);
  await shot(page, 'forgot-password');

  console.log('\n=== CONSOLE ERRORS ===');
  if (errors.length === 0) {
    console.log('No console errors!');
  } else {
    errors.forEach(e => console.log('ERROR:', e));
  }

  await browser.close();
  console.log('\n✅ Done. Screenshots in:', SCREENSHOTS_DIR);
})();
