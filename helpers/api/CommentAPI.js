class CommentAPI {
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

  async createComment(commentData) {
    const response = await this.request.post('/api/comments/author', {
      headers: this.getHeaders(),
      data: commentData
    });
    return response;
  }

  async getCommentsByBlog(blogId) {
    const response = await this.request.get(`/api/comments/blog/${blogId}`, {
      headers: this.getHeaders()
    });
    return response;
  }

  async deleteComment(commentId) {
    const response = await this.request.delete(`/api/comments/${commentId}`, {
      headers: this.getHeaders()
    });
    return response;
  }
}

module.exports = { CommentAPI };
