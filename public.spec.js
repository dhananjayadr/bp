const { test, expect } = require('@playwright/test');
const { BlogPage } = require('../../helpers/ui/BlogPage');
const { BlogAPI } = require('../../helpers/api/BlogAPI');

test.describe('Public User Experience', () => {
  
  test('Search functionality with API validation', async ({ page, request }) => {
    const blog = new BlogPage(page);
    const api = new BlogAPI(request);
    
    const query = 'TypeScript';

    const apiResponse = await api.searchBlogs(query, 1, 9);
    expect(apiResponse.ok()).toBeTruthy();

    await blog.open();
    await blog.search(query);
    await expect(page.locator(blog.selectors.firstBlogTitle)).toContainText(query);
  });

  test('Theme and Read status persistence', async ({ page }) => {
    const blog = new BlogPage(page);
    await blog.open();

    await blog.toggleTheme();
    const themeTitle = await page.locator(blog.selectors.themeToggle).getAttribute('title');
    
    await page.reload();
    await expect(page.locator(blog.selectors.themeToggle)).toHaveAttribute('title', themeTitle);

    await blog.clickReadMore();
    await page.goto('/');
    await expect(page.locator(blog.selectors.readChip).first()).toBeVisible();
  });
});