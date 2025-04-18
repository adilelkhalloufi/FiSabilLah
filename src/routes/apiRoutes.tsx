const API_URL = "http://127.0.0.1:8000/api"
export const IMAGE_URL = "http://127.0.0.1:8000/storage/"

export const apiRoutes = {
    // Auth routes
    login: `${API_URL}/login`,
    register: `${API_URL}/register`,
    logout: `${API_URL}/logout`,
    user: `${API_URL}/user`,
    
    // Main resource routes
    chikhis: `${API_URL}/chikhis`,
    subjects: `${API_URL}/subjects`,
    videos: `${API_URL}/videos`,
    tags: `${API_URL}/tags`,
    
    // Additional resources from API_USE.md
    socialAccounts: `${API_URL}/social-accounts`,
    scheduledPosts: `${API_URL}/scheduled-posts`,
    
    // Helper method to get individual resource
    getChikhi: (id: string) => `${API_URL}/chikhis/${id}`,
    getSubject: (id: string) => `${API_URL}/subjects/${id}`,
    getVideo: (id: string) => `${API_URL}/videos/${id}`,
    getTag: (id: string) => `${API_URL}/tags/${id}`,
    getSocialAccount: (id: string) => `${API_URL}/social-accounts/${id}`,
    getScheduledPost: (id: string) => `${API_URL}/scheduled-posts/${id}`,
  };

