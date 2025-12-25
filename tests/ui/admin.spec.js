const { test, expect } = require('@playwright/test');
const { AdminPage } = require('../../helpers/ui/AdminPage');
const { TestData } = require('../../utils/testData');

test.describe('Admin Workflows', () => {

  test('Create blog via UI', async ({ page, request }) => {
    const admin = new AdminPage(page, request);
    const { username, password } = TestData.getAdminCredentials();
    await admin.login(username, password);
    
    const title = TestData.generateBlogTitle('UI Blog');
    await admin.createPostUI(title, 'Summary', 'Full Content');
    
    await page.goto('/');
    await expect(page.locator(`text=${title}`)).toBeVisible();
  });

  test('Delete blog via UI (using API setup)', async ({ page, request }) => {
    const admin = new AdminPage(page, request);
    const { username, password } = TestData.getAdminCredentials();
    await admin.login(username, password);

    const title = TestData.generateBlogTitle('Delete Target');
    const blog = await admin.createPostAPI(title);

    await admin.deletePostUI(title);
    await expect(page.locator(`text=${title}`)).toBeHidden();
  });

  test('Create and delete blog via API only', async ({ page, request }) => {
    const admin = new AdminPage(page, request);
    const { username, password } = TestData.getAdminCredentials();
    await admin.login(username, password);

    const title = TestData.generateBlogTitle('API Only');
    const blog = await admin.createPostAPI(title);
    
    expect(blog).toHaveProperty('id');
    expect(blog.title).toBe(title);

    await admin.deletePostAPI(blog.id);
  });
});
