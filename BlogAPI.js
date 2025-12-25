class BlogAPI {
  constructor(request, baseURL = '') {
    this.request = request;
    this.baseURL = baseURL;
    this.token = null;
  }

  setToken(token) {
    this.token = token;
  }

  getHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  async createBlog(blogData) {
    const response = await this.request.post('/api/blogs', {
      headers: this.getHeaders(),
      data: blogData
    });
    return response;
  }

  async getAdminBlogs(page = 1, limit = 10) {
    const response = await this.request.get(`/api/blogs/admin?page=${page}&limit=${limit}`, {
      headers: this.getHeaders()
    });
    return response;
  }

  async getPublicBlogs(page = 1, limit = 9) {
    const response = await this.request.get(`/api/blogs/public?page=${page}&limit=${limit}`, {
      headers: this.getHeaders()
    });
    return response;
  }

  async searchBlogs(query, page = 1, limit = 9) {
    const response = await this.request.get(
      `/api/blogs/search?query=${query}&page=${page}&limit=${limit}`,
      { headers: this.getHeaders() }
    );
    return response;
  }

  async deleteBlog(blogId) {
    const response = await this.request.delete(`/api/blogs/${blogId}`, {
      headers: this.getHeaders()
    });
    return response;
  }

  async getBlog(blogId) {
    const response = await this.request.get(`/api/blogs/${blogId}`, {
      headers: this.getHeaders()
    });
    return response;
  }

  async expectStatus(response, expectedStatus = 200) {
    const status = response.status();
    if (status !== expectedStatus) {
      const body = await response.json().catch(() => ({}));
      throw new Error(`Expected ${expectedStatus}, got ${status}: ${JSON.stringify(body)}`);
    }
    return response;
  }

  async uploadImage(fileBuffer, fileName = 'test-image.png') {
    const response = await this.request.post('/api/upload', {
        headers: { 
        'Authorization': `Bearer ${this.token}`,
        'Accept': 'application/json, text/plain, */*'
        },
        multipart: {
        image: {
            name: fileName,
            mimeType: 'image/png',
            buffer: fileBuffer,
        }
        }
    });
    return response;
  }
}

module.exports = { BlogAPI };