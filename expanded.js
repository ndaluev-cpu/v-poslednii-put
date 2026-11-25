'use strict';

// Static pages remain usable without JavaScript. These controls only refine lists.
const normalizeSearch = value => value.toLocaleLowerCase('ru-RU').replaceAll('ё', 'е').trim();
const matchesSearch = (text, query) => normalizeSearch(query).split(/\s+/).filter(Boolean).every(word => normalizeSearch(text).includes(word));

const siteSearch = document.querySelector('#site-search');
if (siteSearch) {
  const links = [...document.querySelectorAll('.sitemap-item')];
  const groups = [...document.querySelectorAll('.sitemap-group')];
  siteSearch.addEventListener('input', () => {
    let count = 0;
    links.forEach(link => {
      link.hidden = !matchesSearch(link.dataset.search, siteSearch.value);
      if (!link.hidden) count += 1;
    });
    groups.forEach(group => {
      group.hidden = ![...group.querySelectorAll('.sitemap-item')].some(link => !link.hidden);
    });
    document.querySelector('#site-search-count').textContent = `Найдено страниц: ${count} из ${links.length}`;
    document.querySelector('#site-search-empty').hidden = count !== 0;
  });
}

const productSearch = document.querySelector('#product-search');
if (productSearch) {
  let selectedCategory = 'all';
  const products = [...document.querySelectorAll('[data-product-category]')];
  const filters = [...document.querySelectorAll('[data-product-filter]')];
  const updateProducts = () => {
    let count = 0;
    products.forEach(product => {
      const inCategory = selectedCategory === 'all' || product.dataset.productCategory === selectedCategory;
      product.hidden = !inCategory || !matchesSearch(product.dataset.search, productSearch.value);
      if (!product.hidden) count += 1;
    });
    document.querySelector('#product-result-count').textContent = `Примеров оформления: ${count} из ${products.length}`;
    document.querySelector('#product-empty').hidden = count !== 0;
  };
  filters.forEach(button => button.addEventListener('click', () => {
    selectedCategory = button.dataset.productFilter;
    filters.forEach(filter => {
      const active = filter === button;
      filter.classList.toggle('active', active);
      filter.setAttribute('aria-pressed', String(active));
    });
    updateProducts();
  }));
  productSearch.addEventListener('input', updateProducts);
}

// Direct links from package pages preselect the calculator's existing controls.
if (document.querySelector('#calculator-form')) {
  const parameters = new URLSearchParams(window.location.search);
  const requestedPlan = parameters.get('plan');
  const requestedType = parameters.get('type');
  if (['0', '1', '2'].includes(requestedPlan)) document.querySelector('#calc-plan').value = requestedPlan;
  if (['funeral', 'cremation'].includes(requestedType)) {
    document.querySelector('#calc-type').value = requestedType;
    renderPrices(requestedType);
  }
  updateCalculator();
}
