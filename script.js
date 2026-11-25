'use strict';

// No libraries, network requests or build step. Works directly from index.html.
const plans = {
  funeral: [44000, 78000, 115000],
  cremation: [39000, 75000, 99000]
};
const planNames = ['Эконом', 'Стандарт', 'VIP'];
const money = value => new Intl.NumberFormat('ru-RU').format(value) + ' ₽';
const descriptions = ['Необходимая помощь и базовое сопровождение.', 'Расширенная организация церемонии прощания.', 'Индивидуальное сопровождение и особое внимание к деталям.'];
const included = [
  ['Консультация и выезд агента', 'Помощь с документами', 'Базовые ритуальные принадлежности', 'Организация транспорта'],
  ['Личное сопровождение', 'Помощь с документами', 'Расширенный выбор принадлежностей', 'Организация церемонии'],
  ['Персональное сопровождение', 'Индивидуальный сценарий', 'Подбор ритуальных принадлежностей', 'Согласование всех деталей']
];
const services = {
  funeral: ['Организация похорон', 'Помощь в подготовке и проведении прощания с учётом пожеланий семьи и её традиций.', ['Обсуждение формата церемонии', 'Подбор ритуальных товаров', 'Согласование транспорта и порядка прощания']],
  cremation: ['Кремация', 'Сопровождение организации кремации и церемонии прощания.', ['Выбор формата прощания', 'Организация перевозки', 'Консультация по необходимым документам']],
  transport: ['Ритуальный транспорт', 'Подбор транспорта для перевозки и сопровождения траурной церемонии.', ['Катафальный транспорт', 'Автобусы для сопровождающих', 'Согласование маршрута и времени']],
  documents: ['Помощь с документами', 'Консультация о документах, необходимых для организации похорон.', ['Уточнение перечня документов', 'Разъяснение порядка оформления', 'Помощь в организационных вопросах']],
  cargo: ['Перевозка «Груз 200»', 'Организация перевозки в другой город, отправки и встречи.', ['Согласование маршрута', 'Подбор способа перевозки', 'Консультация по сопроводительным документам']],
  memorial: ['Памятники и уход', 'Помощь с выбором памятника и благоустройством места захоронения.', ['Выбор материала и оформления', 'Изготовление и установка памятника', 'Согласование работ по благоустройству']]
};

function renderPrices(type) {
  const container = document.querySelector('#price-cards');
  if (!container) return;
  container.innerHTML = planNames.map((name, index) => `
    <article class="price-card ${index === 1 ? 'featured' : ''}">
      <div class="eyebrow">${index === 1 ? 'РАСШИРЕННОЕ СОПРОВОЖДЕНИЕ' : 'ВАРИАНТ ' + String(index + 1).padStart(2, '0')}</div>
      <h3>${name}</h3><div class="price-value"><small>от</small>${money(plans[type][index])}</div>
      <p>${descriptions[index]}</p><ul>${included[index].map(item => `<li>${item}</li>`).join('')}</ul>
      <a class="package-detail-link" href="package-${['economy', 'standard', 'premium'][index]}.html">Подробный состав пакета <span>→</span></a>
      <button class="button ${index === 1 ? 'button-gold' : 'button-outline'}" data-plan="${index}" data-type="${type}">Обсудить вариант <span>↗</span></button>
    </article>`).join('');
  document.querySelectorAll('[data-price-type]').forEach(button => {
    const selected = button.dataset.priceType === type;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
}
function updateCalculator() {
  if (!document.querySelector('#calculator-form')) return;
  const type = document.querySelector('#calc-type').value;
  const index = Number(document.querySelector('#calc-plan').value);
  document.querySelector('#calc-total').value = money(plans[type][index]);
}

const callback = document.querySelector('#callback-dialog');
const detail = document.querySelector('#detail-dialog');
function openDialog(dialog) {
  if (detail.open) detail.close();
  if (callback.open) callback.close();
  dialog.showModal();
  document.body.classList.add('modal-open');
}
function openCallback(subject = 'Консультация') {
  const select = document.querySelector('#callback-form select');
  select.value = [...select.options].some(option => option.value === subject) ? subject : 'Консультация';
  document.querySelector('#form-result').hidden = true;
  openDialog(callback);
}
function showDetail(title, description, list) {
  document.querySelector('#detail-title').textContent = title;
  document.querySelector('#detail-description').textContent = description;
  document.querySelector('#detail-list').replaceChildren(...list.map(text => {
    const item = document.createElement('li');
    item.textContent = text;
    return item;
  }));
  openDialog(detail);
}

document.addEventListener('click', event => {
  const callbackButton = event.target.closest('[data-callback]');
  if (callbackButton) openCallback();
  const serviceButton = event.target.closest('[data-service]');
  if (serviceButton) showDetail(...services[serviceButton.dataset.service]);
  const productButton = event.target.closest('[data-product]');
  if (productButton) showDetail(productButton.dataset.product, 'Подбор ритуальных товаров с учётом пожеланий семьи. Наличие, материалы и стоимость уточняются индивидуально.', ['Помощь в выборе', 'Обсуждение оформления', 'Уточнение наличия и стоимости']);
  const priceTab = event.target.closest('[data-price-type]');
  if (priceTab) renderPrices(priceTab.dataset.priceType);
  const planButton = event.target.closest('[data-plan]');
  if (planButton) {
    document.querySelector('#calc-type').value = planButton.dataset.type;
    document.querySelector('#calc-plan').value = planButton.dataset.plan;
    updateCalculator();
    openCallback(planButton.dataset.type === 'funeral' ? 'Организация похорон' : 'Кремация');
  }
  if (event.target.closest('[data-close]')) event.target.closest('dialog').close();
});

document.querySelectorAll('dialog').forEach(dialog => {
  dialog.addEventListener('close', () => {
    if (!document.querySelector('dialog[open]')) document.body.classList.remove('modal-open');
  });
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  });
});
document.querySelector('#detail-callback').addEventListener('click', () => openCallback('Консультация'));
document.querySelector('#calculator-form')?.addEventListener('change', updateCalculator);
document.querySelector('#calculator-form')?.addEventListener('submit', event => event.preventDefault());

document.querySelector('#callback-form').addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  const nameInput = form.elements.name;
  const phoneInput = form.elements.phone;
  nameInput.setCustomValidity(nameInput.value.trim() ? '' : 'Укажите ваше имя.');
  const digits = phoneInput.value.replace(/\D/g, '');
  phoneInput.setCustomValidity(digits.length >= 10 && digits.length <= 15 ? '' : 'Укажите номер телефона: от 10 до 15 цифр.');
  if (!form.reportValidity()) return;
  const result = document.querySelector('#form-result');
  result.textContent = 'Заявка подготовлена. Это локальная демонстрация: данные не отправлены. Для связи со службой позвоните +7 (4712) 31-09-34.';
  result.hidden = false;
});
document.querySelectorAll('#callback-form input').forEach(input => input.addEventListener('input', () => input.setCustomValidity('')));

const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
menuToggle.addEventListener('click', () => {
  const opened = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(opened));
  menuToggle.setAttribute('aria-label', opened ? 'Закрыть меню' : 'Открыть меню');
  navigation.classList.toggle('is-open', opened);
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Открыть меню');
  navigation.classList.remove('is-open');
}));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    navigation.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Открыть меню');
  }
});

renderPrices('funeral');
updateCalculator();
