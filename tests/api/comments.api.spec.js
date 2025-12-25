const { test, expect } = require('@playwright/test');

test.describe.serial('Comment API Tests', () => {
  let token;
  const targetBlogId = 1;

  test('Setup: Authenticate user', async ({ request }) => {
    const response = await request.post('/api/auth/login', {
      data: { username: 'admin', password: 'admin123' }
    });
    
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    token = body.token;
    expect(token).toBeDefined();
  });

  test('POST /api/comments/author - Create a new comment', async ({ request }) => {
    test.skip(!token, 'Login failed');

    const response = await request.post('/api/comments/author', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain, */*'
      },
      data: {
        blogId: targetBlogId,
        content: "comment feature",
        authorName: "admin"
      }
    });

    expect(response.ok()).toBeTruthy();
    
    const body = await response.json();
    
    expect(body).toMatchObject({
      blogId: targetBlogId,
      content: "comment feature",
      authorName: "admin",
      isAuthor: true
    });
    
    expect(body.id).toBeDefined();
    console.log(`✓ Comment created with ID: ${body.id}`);
  });

  test('GET /api/comments/blog/:id - Retrieve comments', async ({ request }) => {
    const response = await request.get(`/api/comments/blog/${targetBlogId}`);
    
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    
    expect(Array.isArray(body)).toBeTruthy();
    console.log(`✓ Successfully retrieved ${body.length} comments`);
  });

  test('POST /api/comments/author - Fail on empty content', async ({ request }) => {
    const response = await request.post('/api/comments/author', {
      headers: { 'Authorization': `Bearer ${token}` },
      data: {
        blogId: targetBlogId,
        content: "",
        authorName: "admin"
      }
    });

    expect(response.status()).toBe(400);
    console.log('✓ Correctly rejected empty comment');
  });

  test('POST /api/comments/author - Fail without token', async ({ request }) => {
    const response = await request.post('/api/comments/author', {
      data: {
        blogId: targetBlogId,
        content: "unauthorized text",
        authorName: "admin"
      }
    });

    expect(response.status()).toBe(401);
    console.log('✓ Correctly blocked unauthorized request');
  });
});
