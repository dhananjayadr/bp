const { BasePage } = require('./BasePage');

class BlogPage extends BasePage {
  constructor(page) {
    super(page);

    this.selectors = {
      searchBar: 'xpath=//input[@placeholder="Search blogs..."]',
      firstBlogTitle: 'xpath=(//h2[contains(@class, "MuiTypography-h5")])[1]',
      readMoreBtn: 'xpath=(//button[text()="Read More"])[1]',
      readChip: 'xpath=//span[text()="Read"]/ancestor::div[contains(@class, "MuiChip-root")]',
      themeToggle: 'xpath=//button[@title="Switch to dark mode" or @title="Switch to light mode"]',
      pageBtn: (num) => `xpath=//button[@aria-label="Go to page ${num}"]`,
      activePage: 'xpath=//button[@aria-current="true"]',
      nextPageBtn: 'xpath=//button[@aria-label="Go to next page"]',
    };
  }

  async open() {
    await this.goto('/');
  }

  async search(query) {
    await this.fill(this.selectors.searchBar, query);
    await this.page.keyboard.press('Enter');
    await this.page.waitForLoadState('networkidle');
  }

  async clickReadMore() {
    await this.click(this.selectors.readMoreBtn);
  }

  async toggleTheme() {
    await this.click(this.selectors.themeToggle);
  }

  async goToPage(pageNumber) {
    await this.click(this.selectors.pageBtn(pageNumber));
  }

  async clickNextPage() {
    await this.click(this.selectors.nextPageBtn);
  }

  async getActivePage() {
    return await this.getText(this.selectors.activePage);
  }
}

module.exports = { BlogPage };
