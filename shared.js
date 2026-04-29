// shared.js — NexusStore shared utilities
// This file is loaded as a module in each page

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getDatabase, ref, onValue, get } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

export const firebaseConfig = {
  apiKey: "AIzaSyA4JpEiy3lJZCDhoi1g7zNXqKzbdI0SAsM",
  authDomain: "messengerchatapp-7c754.firebaseapp.com",
  databaseURL: "https://messengerchatapp-7c754-default-rtdb.firebaseio.com",
  projectId: "messengerchatapp-7c754",
  storageBucket: "messengerchatapp-7c754.firebasestorage.app",
  messagingSenderId: "78446807414",
  appId: "1:78446807414:web:e1879f4bd9f10115e81257",
  measurementId: "G-VBWRC4SWL5"
};

export let app, auth, db, currentUser, currentUserData;

export function initFirebase() {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getDatabase(app);
  return { app, auth, db };
}

export function requireAuth(callback) {
  const { auth, db } = initFirebase();
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = 'login.html';
      return;
    }
    currentUser = user;
    const snap = await get(ref(db, 'users/' + user.uid));
    currentUserData = snap.val() || {};
    callback(user, currentUserData, db);
  });
  return { auth, db };
}

export function renderSidebar(currentPage, userData, isAdmin) {
  const theme = localStorage.getItem('theme') || 'dark';
  if (theme === 'light') document.documentElement.setAttribute('data-theme', 'light');

  const adminItems = isAdmin ? `
    <div class="nav-section">Admin</div>
    <a href="admin-dashboard.html" class="nav-item ${currentPage==='admin-dashboard'?'active':''}">
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
      Admin Dashboard
      <span class="admin-badge">Admin</span>
    </a>
    <a href="upload.html" class="nav-item ${currentPage==='upload'?'active':''}">
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
      Upload Game
    </a>
  ` : '';

  const sidebarHTML = `
    <div class="sidebar" id="sidebar">
      <div class="sidebar-header">
        <div class="sidebar-logo-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <span class="sidebar-logo-text">NexusStore</span>
      </div>
      <div class="sidebar-user">
        <div class="sidebar-user-name">${userData.displayName || 'User'}</div>
        <div class="sidebar-user-email">${userData.email || ''}</div>
        <div class="sidebar-points">
          <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          ${userData.points || 0} pts
        </div>
      </div>
      <nav class="sidebar-nav">
        <div class="nav-section">Main</div>
        <a href="home.html" class="nav-item ${currentPage==='home'?'active':''}">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
          Home
        </a>
        <a href="shop.html" class="nav-item ${currentPage==='shop'?'active':''}">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
          Products
        </a>
        <div class="nav-section">Account</div>
        <a href="account.html" class="nav-item ${currentPage==='account'?'active':''}">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
          Account
        </a>
        <a href="point.html" class="nav-item ${currentPage==='point'?'active':''}">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2"/></svg>
          Your Points
        </a>
        <a href="buy-point.html" class="nav-item ${currentPage==='buy-point'?'active':''}">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
          Buy Points
        </a>
        <a href="done-buy.html" class="nav-item ${currentPage==='done-buy'?'active':''}">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          Done Buy
        </a>
        <div class="nav-section">Preferences</div>
        <a href="setting.html" class="nav-item ${currentPage==='setting'?'active':''}">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/></svg>
          Settings
        </a>
        <div class="theme-toggle" onclick="toggleTheme()">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
          Light Mode
          <div class="toggle-switch"></div>
        </div>
        ${adminItems}
      </nav>
      <div class="sidebar-footer">
        <button class="logout-btn" onclick="doLogout()">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          Sign Out
        </button>
      </div>
    </div>
    <div class="sidebar-overlay" id="sidebarOverlay" onclick="closeSidebar()"></div>
  `;

  document.body.insertAdjacentHTML('afterbegin', sidebarHTML);
}

export function renderTopbar(title, userData, hasNotif = false) {
  const initial = (userData.displayName || userData.email || 'U')[0].toUpperCase();
  const topbarHTML = `
    <div class="topbar">
      <button class="hamburger" onclick="toggleSidebar()" aria-label="Menu">
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>
      <span class="logo-inline">${title || 'NexusStore'}</span>
      <div class="topbar-right">
        <button class="notif-btn" onclick="toggleNotifPanel()" aria-label="Notifications">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
          ${hasNotif ? '<span class="notif-badge"></span>' : ''}
        </button>
        <div class="avatar-btn" onclick="window.location.href='account.html'">${initial}</div>
      </div>
    </div>
    <div class="toast-container" id="toastContainer"></div>
  `;
  document.body.insertAdjacentHTML('afterbegin', topbarHTML);
}

// Global sidebar functions (attached to window)
window.toggleSidebar = () => {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebarOverlay').classList.toggle('show');
};
window.closeSidebar = () => {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('show');
};
window.toggleTheme = () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
};
window.toggleNotifPanel = () => {
  // Implemented per-page
};
window.doLogout = async () => {
  const { auth } = initFirebase();
  await signOut(auth);
  window.location.href = 'login.html';
};

// Toast utility
export function showToast(title, msg, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const icons = {
    info: '<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>',
    success: '<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
    error: '<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>',
    warning: '<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>'
  };
  const id = 'toast_' + Date.now();
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.id = id;
  toast.innerHTML = `
    ${icons[type] || ''}
    <div><div class="toast-title">${title}</div><div class="toast-msg">${msg}</div></div>
    <button class="toast-close" onclick="document.getElementById('${id}').remove()">×</button>
  `;
  container.appendChild(toast);
  setTimeout(() => { const t = document.getElementById(id); if (t) t.remove(); }, 5000);
}
window.showToast = showToast;
