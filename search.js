'use strict';

// Реальный список страниц сайта (название + ссылка)
const records = [
  { title: 'Главная', url: 'index.html' },
  { title: 'О компании', url: 'about.html' },
  { title: 'Принципы работы', url: 'principles.html' },
  { title: 'Порядок организации', url: 'process.html' },
  { title: 'Услуги', url: 'services.html' },
  { title: 'Организация похорон', url: 'service-funeral.html' },
  { title: 'Организация кремации', url: 'service-cremation.html' },
  { title: 'Ритуальный транспорт', url: 'service-transport.html' },
  { title: 'Помощь с документами', url: 'service-documents.html' },
  { title: 'Перевозка «Груз 200»', url: 'service-cargo.html' },
  { title: 'Изготовление и установка памятников', url: 'service-memorial.html' },
  { title: 'Зал прощания', url: 'service-farewell-hall.html' },
  { title: 'Сопровождение церемонии', url: 'service-ceremony.html' },
  { title: 'Цветочное оформление', url: 'service-floral-decoration.html' },
  { title: 'Благоустройство места захоронения', url: 'service-grave-care.html' },
  { title: 'Консультация ритуального специалиста', url: 'service-consultation.html' },
  { title: 'Организация поминальной встречи', url: 'service-memorial-meal.html' },
  { title: 'Каталог', url: 'catalog.html' },
  { title: 'Гробы', url: 'catalog-coffins.html' },
  { title: 'Венки и цветочные композиции', url: 'catalog-wreaths.html' },
  { title: 'Памятники', url: 'catalog-monuments.html' },
  { title: 'Кресты', url: 'catalog-crosses.html' },
  { title: 'Гроб с текстильной отделкой', url: 'product-coffins-textile.html' },
  { title: 'Деревянный гроб', url: 'product-coffins-wood.html' },
  { title: 'Гроб с полированной отделкой', url: 'product-coffins-polished.html' },
  { title: 'Классический венок', url: 'product-wreaths-classic.html' },
  { title: 'Цветочная корзина', url: 'product-wreaths-basket.html' },
  { title: 'Композиция в светлых тонах', url: 'product-wreaths-white.html' },
  { title: 'Вертикальный памятник', url: 'product-monuments-vertical.html' },
  { title: 'Горизонтальный памятник', url: 'product-monuments-horizontal.html' },
  { title: 'Мемориальный комплект', url: 'product-monuments-memorial-set.html' },
  { title: 'Деревянный крест', url: 'product-crosses-wooden.html' },
  { title: 'Металлический крест', url: 'product-crosses-metal.html' },
  { title: 'Крест с памятной табличкой', url: 'product-crosses-with-plaque.html' },
  { title: 'Цены', url: 'prices.html' },
  { title: 'Пакет «Эконом»', url: 'package-economy.html' },
  { title: 'Пакет «Стандарт»', url: 'package-standard.html' },
  { title: 'Пакет «VIP»', url: 'package-premium.html' },
  { title: 'Информация', url: 'info.html' },
  { title: 'С чего начать разговор со специалистом', url: 'guide-first-conversation.html' },
  { title: 'Что подготовить к консультации', url: 'guide-consultation-checklist.html' },
  { title: 'Как выбрать нужные услуги', url: 'guide-choosing-services.html' },
  { title: 'Как составить план церемонии', url: 'guide-ceremony-plan.html' },
  { title: 'Как спланировать транспорт', url: 'guide-transport-planning.html' },
  { title: 'На что обратить внимание при выборе памятника', url: 'guide-monument-choice.html' },
  { title: 'Как подобрать цветочную композицию', url: 'guide-flower-choice.html' },
  { title: 'Как обсудить бюджет и смету', url: 'guide-budget-planning.html' },
  { title: 'Вопросы и ответы', url: 'faq.html' },
  { title: 'Все разделы сайта', url: 'sitemap.html' },
  { title: 'Контакты', url: 'contacts.html' }
];

// Получаем элементы
const input = document.getElementById('search-input');
const clearBtn = document.getElementById('search-clear');
const resultsContainer = document.getElementById('search-results');
const noResultsBlock = document.getElementById('no-results');
const resetBtn = document.getElementById('reset-search');

// Нормализация: нижний регистр, замена ё на е, trim
function normalize(str) {
  return str.toLocaleLowerCase('ru-RU').replaceAll('ё', 'е').trim();
}

// Фильтрация по всем словам (AND-логика)
function filterRecords(query) {
  const normalizedQuery = normalize(query);
  if (normalizedQuery === '') return records;

  const words = normalizedQuery.split(/\s+/).filter(Boolean);

  return records.filter(record => {
    const title = normalize(record.title);
    return words.every(word => title.includes(word));
  });
}

// Рендер результатов (используем стиль directory-card)
function renderResults(filteredRecords) {
  resultsContainer.innerHTML = '';

  if (filteredRecords.length === 0) {
    resultsContainer.hidden = true;
    noResultsBlock.hidden = false;
    return;
  }

  resultsContainer.hidden = false;
  noResultsBlock.hidden = true;

  filteredRecords.forEach(record => {
    const card = document.createElement('a');
    card.className = 'directory-card';
    card.href = record.url;
    card.innerHTML = `
      <div>
        <span class="directory-label">ПЕРЕЙТИ</span>
        <h3>${record.title}</h3>
        <span class="directory-arrow" aria-hidden="true">↗</span>
      </div>
    `;
    resultsContainer.appendChild(card);
  });
}

// Обновление URL
function updateUrl(query) {
  const url = new URL(window.location);
  if (query.trim() === '') {
    url.searchParams.delete('q');
  } else {
    url.searchParams.set('q', query);
  }
  window.history.replaceState({}, '', url);
}

// Главная функция обновления поиска
function updateSearch(query, updateHistory = true) {
  clearBtn.hidden = query.length === 0;
  const filtered = filterRecords(query);
  renderResults(filtered);
  if (updateHistory) updateUrl(query);
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get('q') || '';
  input.value = initialQuery;
  updateSearch(initialQuery, false);
});

// Live-поиск с debounce
let debounceTimer;
input.addEventListener('input', (e) => {
  const query = e.target.value;
  clearBtn.hidden = query.length === 0;
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => updateSearch(query), 250);
});

// Очистка по крестику
clearBtn.addEventListener('click', () => {
  input.value = '';
  updateSearch('');
  input.focus();
});

// Кнопка "Сбросить поиск"
resetBtn.addEventListener('click', () => {
  input.value = '';
  updateSearch('');
  input.focus();
});