const { BasePage } = require('./BasePage');
const { BlogAPI } = require('../api/BlogAPI');

class AdminPage extends BasePage {
  constructor(page, request) {
    super(page);
    this.request = request;
    this.api = new BlogAPI(request);

    this.selectors = {
      username: 'xpath=//label[text()="Username"]/following-sibling::div//input',
      password: 'xpath=//label[text()="Password"]/following-sibling::div//input',
      loginBtn: 'xpath=//button[@type="submit"]',
      newPostBtn: 'xpath=//button[contains(., "New Blog Post")]',
      title: 'xpath=//label[text()="Title"]/following-sibling::div//input',
      excerpt: 'xpath=//label[text()="Excerpt"]/following-sibling::div//textarea',
      content: 'xpath=//div[contains(@class, "ql-editor")]',
      category: 'xpath=//label[text()="Category"]/following-sibling::div//div[@role="combobox"]',
      publishBtn: 'xpath=//button[contains(., "Publish Now")]',
      deleteBtn: (title) => `xpath=//tr[td[contains(text(), "${title}")]]//button[@title="Delete"]`,
      confirmDeleteBtn: 'xpath=//button[@data-testid="confirm-delete-button"]',
    };
  }

  async login(username, password) {
    await this.goto('/login');
    await this.fill(this.selectors.username, username);
    await this.fill(this.selectors.password, password);
    await this.click(this.selectors.loginBtn);
    await this.page.waitForURL(/.*admin/);

    const token = await this.page.evaluate(() => localStorage.getItem('token'));
    this.api.setToken(token);
    return token;
  }

  async createPostUI(title, excerpt, content, category = 'Technology') {
    await this.click(this.selectors.newPostBtn);
    await this.fill(this.selectors.title, title);
    await this.fill(this.selectors.excerpt, excerpt);
    await this.page.locator(this.selectors.content).fill(content);
    await this.selectDropdown(this.selectors.category, category);
    await this.click(this.selectors.publishBtn);
    await this.page.waitForURL(/.*admin/);
  }

  async deletePostUI(title) {
    await this.goto('/admin');
    await this.click(this.selectors.deleteBtn(title));
    await this.click(this.selectors.confirmDeleteBtn);
  }

  async createPostAPI(title, content = 'Test content', excerpt = 'Test excerpt') {
    const blogData = {
      title,
      content,
      excerpt,
      category: 'Technology',
      tags: [],
      status: 'published'
    };
    const response = await this.api.createBlog(blogData);
    await this.api.expectStatus(response, 201);
    return await response.json();
  }

  async deletePostAPI(blogId) {
    const response = await this.api.deleteBlog(blogId);
    await this.api.expectStatus(response, 200);
  }
}

module.exports = { AdminPage };