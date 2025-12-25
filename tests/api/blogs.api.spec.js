const { test, expect } = require('@playwright/test');

test.describe.serial('API Connection Debugging', () => {
  let token;
  let blogId;
  let uploadedImageUrl;

  test('Server is reachable', async ({ request }) => {
    const response = await request.get('/');
    expect(response.ok()).toBeTruthy();
  });

  test('Login successfully', async ({ request }) => {
    const response = await request.post('/api/auth/login', {
      data: { username: 'admin', password: 'admin123' }
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    token = body.token;
    expect(token).toBeDefined();
  });

  test('Upload blog image', async ({ request }) => {
    test.skip(!token, 'No token available');

    const dummyImage = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
      'base64'
    );

    const response = await request.post('/api/upload', {
      headers: { 'Authorization': `Bearer ${token}` },
      multipart: {
        image: {
          name: 'test-image.png',
          mimeType: 'image/png',
          buffer: dummyImage,
        }
      }
    });

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    uploadedImageUrl = body.url;
    expect(uploadedImageUrl).toBeDefined();
  });

  test('Create a blog post with image', async ({ request }) => {
    test.skip(!token, 'Skipping: No auth token available');

    const response = await request.post('/api/blogs', {
      headers: { 'Authorization': `Bearer ${token}` },
      data: {
        title: `Debug Test ${Date.now()}`,
        content: '<p>Debug content</p>',
        excerpt: 'Debug excerpt',
        category: 'Technology',
        tags: [],
        status: 'published',
        imageUrl: uploadedImageUrl || ""
      }
    });

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    blogId = body.id || body.data?.id;
    expect(blogId).toBeDefined();
  });

  test('Create a comment on the blog', async ({ request }) => {
    test.skip(!token || !blogId, 'No token or blogId available');

    const response = await request.post('/api/comments/author', {
      headers: { 'Authorization': `Bearer ${token}` },
      data: {
        blogId: blogId,
        content: "comment feature testing",
        authorName: "admin"
      }
    });

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.content).toBe("comment feature testing");
    expect(body.blogId.toString()).toBe(blogId.toString());
  });

  test('Fetch public blogs list', async ({ request }) => {
    const response = await request.get('/api/blogs/public?page=1&limit=9');
    expect(response.ok()).toBeTruthy();
  });

  test('Delete the created blog', async ({ request }) => {
    test.skip(!token || !blogId, 'Skipping: No token or blogId available');

    const response = await request.delete(`/api/blogs/${blogId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    expect(response.status()).toBeLessThan(300);
  });
});
