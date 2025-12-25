class TestData {
  static generateBlogTitle(prefix = 'Test Blog') {
    return `${prefix} ${Date.now()}`;
  }

  static getBlogData(overrides = {}) {
    return {
      title: this.generateBlogTitle(),
      content: 'Automated test content',
      excerpt: 'Test excerpt for automation',
      category: 'Technology',
      tags: [],
      status: 'published',
      ...overrides
    };
  }

  static getAdminCredentials() {
    return {
      username: 'admin',
      password: 'admin123'
    };
  }
}

module.exports = { TestData };
