const BASE_URL = 'http://localhost:4000/api';

function getAuthHeader() {
  const token = localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleJson(response, errorMessage) {
  if (response.status === 401) {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    throw new Error('Unauthorized. Please log in again.');
  }
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || errorMessage || 'Request failed');
  }
  return response.json();
}

export async function fetchProducts() {
  const response = await fetch(`${BASE_URL}/products`);
  return handleJson(response, 'Failed to fetch products');
}

export async function fetchProductById(id) {
  const response = await fetch(`${BASE_URL}/products/${id}`);
  return handleJson(response, 'Failed to fetch product');
}

export async function fetchCategories() {
  const response = await fetch(`${BASE_URL}/categories`);
  return handleJson(response, 'Failed to fetch categories');
}

export async function loginUser(username, password) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return handleJson(response, 'Failed to login');
}

export async function registerUser(username, password) {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return handleJson(response, 'Failed to register');
}

export async function logoutUser() {
  const response = await fetch(`${BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: { ...getAuthHeader() }
  });
  return handleJson(response, 'Failed to logout');
}

export async function fetchReviews(productId) {
  const response = await fetch(`${BASE_URL}/products/${productId}/reviews`);
  return handleJson(response, 'Failed to fetch reviews');
}

export async function addProductReview(productId, rating, comment) {
  const response = await fetch(`${BASE_URL}/products/${productId}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify({ rating, comment })
  });
  return handleJson(response, 'Failed to add review');
}

export async function deleteProductReview(productId, reviewId) {
  const response = await fetch(`${BASE_URL}/products/${productId}/reviews/${reviewId}`, {
    method: 'DELETE',
    headers: { ...getAuthHeader() }
  });
  return handleJson(response, 'Failed to delete review');
}

export async function fetchOrders() {
  const response = await fetch(`${BASE_URL}/orders`, {
    headers: { ...getAuthHeader() }
  });
  return handleJson(response, 'Failed to fetch orders');
}

export async function createOrder(items, total) {
  const response = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify({ items, total })
  });
  return handleJson(response, 'Failed to create order');
}
