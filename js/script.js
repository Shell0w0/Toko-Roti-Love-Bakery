document.addEventListener('alpine:rendered', () => {
  document.querySelectorAll('.price').forEach(p => {
    p.style.visibility = 'visible';
  });
});

// ============================================
// HAMBURGER MENU
// ============================================
const navbarNav = document.querySelector('.navbar-nav');
const hamburgerMenu = document.querySelector('#hamburger-menu');

hamburgerMenu?.addEventListener('click', (e) => {
  navbarNav?.classList.toggle('active');
  e.preventDefault();
});

// ============================================
// SEARCH TOGGLE
// ============================================
const searchForm = document.querySelector('.search-form');
const searchBox = document.querySelector('#search-box');
const searchButton = document.querySelector('#search-button');

searchButton?.addEventListener('click', (e) => {
  searchForm?.classList.toggle('active');
  if (searchForm?.classList.contains('active')) {
    setTimeout(() => searchBox?.focus(), 100);
  }
  e.preventDefault();
});

// ============================================
// SEARCH FUNCTION
// ============================================
searchBox?.addEventListener('input', (e) => {
  const term = e.target.value.toLowerCase().trim();
  if (!term) return resetAllCards();

  let targetSection = null;

  filterCards('.menu .menu-card', term, '#menu', (section) => {
    if (!targetSection) targetSection = section;
  });

  filterCards('.products .product-card', term, '#products', (section) => {
    if (!targetSection) targetSection = section;
  });

  if (targetSection) scrollToSectionHeader(targetSection);
});

// ============================================
// FILTER HELPER
// ============================================
function filterCards(selector, term, sectionId, onFound) {
  document.querySelectorAll(selector).forEach(card => {
    const title = card.querySelector('h3, .menu-card-title');
    if (!title) return;

    if (title.textContent.toLowerCase().includes(term)) {
      showCard(card);
      onFound(document.querySelector(sectionId));
    } else {
      hideCard(card);
    }
  });
}

// ============================================
// CARD STATE
// ============================================
function showCard(card) {
  card.classList.remove('hidden');
  card.classList.add('highlight');
}

function hideCard(card) {
  card.classList.add('hidden');
  card.classList.remove('highlight');
}

function resetAllCards() {
  document.querySelectorAll('.menu-card, .product-card')
    .forEach(card => card.classList.remove('hidden', 'highlight'));
}

// ============================================
// SCROLL
// ============================================
function scrollToSectionHeader(section) {
  const navHeight = document.querySelector('.navbar')?.offsetHeight || 80;
  const header = section.querySelector('h2');

  const position = (header || section).getBoundingClientRect().top
    + window.pageYOffset
    - navHeight
    - 30;

  window.scrollTo({ top: position, behavior: 'smooth' });
}

// ============================================
// SHOPPING CART
// ============================================
const shoppingCart = document.querySelector('.shopping-cart');
const cartButton = document.querySelector('#shopping-cart-button');

cartButton?.addEventListener('click', (e) => {
  shoppingCart?.classList.toggle('active');
  e.preventDefault();
});

// ============================================
// CLICK OUTSIDE (GLOBAL)
// ============================================
document.addEventListener('click', (e) => {

  if (!hamburgerMenu?.contains(e.target) && !navbarNav?.contains(e.target)) {
    navbarNav?.classList.remove('active');
  }

  if (
    !searchButton?.contains(e.target) &&
    !searchForm?.contains(e.target)
  ) {
    searchForm?.classList.remove('active');
    if (searchBox) searchBox.value = '';
    resetAllCards();
  }

  if (!cartButton?.contains(e.target) && !shoppingCart?.contains(e.target)) {
    shoppingCart?.classList.remove('active');
  }

  if (e.target === document.querySelector('#item-detail-modal')) {
    document.querySelector('#item-detail-modal').style.display = 'none';
  }
});

// ============================================
// MODAL (ALPINE SAFE)
// ============================================
const modal = document.querySelector('#item-detail-modal');

document.addEventListener('click', (e) => {
  if (e.target.closest('.item-detail-button')) {
    modal.style.display = 'flex';
    e.preventDefault();
  }

  if (e.target.closest('.close-icon')) {
    modal.style.display = 'none';
    e.preventDefault();
  }
});

// ============================================
// FEATHER ICONS
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  feather?.replace();
});

document.addEventListener('alpine:rendered', () => {
  feather?.replace();
});
