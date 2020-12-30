function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

const totalPrice = () => {
  const cartItem = document.querySelectorAll('.cart__item');
  let total = 0;
  cartItem.forEach((value) => {
    const fullItem = value.innerHTML.split('PRICE: $');
    total += parseFloat(fullItem[1]);
  });
  document.querySelector('.total-price').innerHTML = total;
};

function cartItemClickListener(event) {
  event.target.remove();
  totalPrice();
}

function saveStorage() {
  const saveOl = document.querySelector('.cart__items');
  localStorage.setItem('save data', saveOl.innerHTML);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function loadStorage() {
  const receiveOl = document.querySelector('.cart__items');
  receiveOl.innerHTML = localStorage.getItem('save data');
  document
    .querySelectorAll('.cart__items')
    .forEach(item => item.addEventListener('click', cartItemClickListener));
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  const createBtn = createCustomElement(
    'button',
    'item__add',
    'Adicionar ao carrinho!',
  );
  createBtn.addEventListener('click', () => {
    fetch(`https://api.mercadolibre.com/items/${sku}`)
      .then(response => response.json())
      .then((value) => {
        const { price } = value;
        const productObj = { sku, name, salePrice: price };
        document
          .querySelector('.cart__items')
          .appendChild(createCartItemElement(productObj));
        saveStorage();
        totalPrice();
      });
  });
  section.appendChild(createBtn);
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const listarProdutos = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador').then(
    (request) => {
      request.json().then((arquivo) => {
        arquivo.results.map((produto) => {
          const dataMl = createProductItemElement({
            sku: produto.id,
            name: produto.title,
            image: produto.thumbnail,
          });
          return document.querySelector('.items').appendChild(dataMl);
        });
      });
    },
  );
};

document.getElementById('clean-btn').addEventListener('click', () => {
  document.querySelector('.cart__items').innerHTML = '';
  saveStorage();
  totalPrice();
});

window.onload = function onload() {
  listarProdutos();
  loadStorage();
  totalPrice();
};