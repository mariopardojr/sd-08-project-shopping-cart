const startLoading = () => {
  const e = document.createElement('div');
  e.className = 'loading';
  e.innerText = 'Carregando...';
  document.querySelector('.items').appendChild(e);
};

const endLoading = () => {
  document.querySelector('.loading').remove();
  // const loading = document.querySelector('.loading');
  // const sectionCart = document.querySelector('.items');
  // loading.classList.add('hidden');
  // loadingSpan.style.display = 'none';
  document
    .querySelectorAll('.item')
    .forEach(i => i.classList.remove('hidden'));
};

function totalPrice() {
  let total = 0;
  document.querySelectorAll('.cart__item').forEach(item => {
    total += parseFloat(item.innerText.split('$')[1]);
  });
  document.querySelector('.total-price').innerHTML = total;
}

const addLocalStorage = () => {
  const completedList = document.querySelector('.cart__items');
  localStorage.setItem('eachItem', completedList.innerHTML);
};

function cartItemClickListener(e) {
  e.target.remove();
  totalPrice();
  addLocalStorage();
}

const getLocalStorage = () => {
  document.querySelector('.cart__items').innerHTML = localStorage.getItem(
    'eachItem',
  );
  totalPrice();
};

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item hidden';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const botaoComprar = createCustomElement(
    'button',
    'item__add',
    'Adicionar ao carrinho!',
  );
  botaoComprar.addEventListener('click', () => {
    fetch(`https://api.mercadolibre.com/items/${sku}`)
      .then(result => result.json())
      .then(data => {
        const { id, title, price } = data;
        const elementoCarrinho = createCartItemElement({
          sku: id,
          name: title,
          salePrice: price,
        });
        document.querySelector('.cart__items').appendChild(elementoCarrinho);
        totalPrice();
        addLocalStorage();
      });
  });
  section.appendChild(botaoComprar);

  return section;
}

const listagem = () => {
  startLoading();
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(result => result.json())
    .then(data => {
      data.results.forEach(computador => {
        const { id, title, thumbnail } = computador;
        const elemento = createProductItemElement({
          sku: id,
          name: title,
          image: thumbnail,
        });
        const items = document.querySelector('.items');
        items.appendChild(elemento);
      });
    })
    .then(endLoading());
};

document.querySelector('.empty-cart').addEventListener('click', () => {
  document.querySelector('.cart__items').innerHTML = '';
  totalPrice();
  addLocalStorage();
});

window.onload = function onload() {
  listagem();
  getLocalStorage();
};
