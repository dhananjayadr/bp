const { test, expect } = require('@playwright/test');
const { BlogPage } = require('../../helpers/ui/BlogPage');

test.describe('Pagination Workflows', () => {

  test('Navigate to next page and verify state', async ({ page }) => {
    const blog = new BlogPage(page);
    await blog.open();
    
    await blog.clickNextPage();
    await expect(page.locator(blog.selectors.activePage)).toHaveText('2');

    // Known bug - URL doesn't update
    test.info().annotations.push({
      type: 'issue',
      description: 'URL state does not persist on page change'
    });
    await expect(page).toHaveURL(/.*page=2/); 
  });

  test('Jump to specific page using button', async ({ page }) => {
    const blog = new BlogPage(page);
    await blog.open();
    
    await blog.goToPage(2);
    await expect(page.locator(blog.selectors.activePage)).toHaveText('2');
  });
});
