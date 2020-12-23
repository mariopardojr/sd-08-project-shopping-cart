function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
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

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function responseFetch() {
  return fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then(data => data.results);
}

function createItems(items) {
  const item = document.querySelector('.items');
  items.forEach((element) => {
    const { id: sku, title: name, thumbnail: image } = element;
    item.appendChild(createProductItemElement({ sku, name, image }));
  });
}

async function pegaItem(id) {
  return fetch(`https://api.mercadolibre.com/items/${id}`)
    .then(response => response.json())
    .then(data => data);
}

async function somar() {
  const cartItems = document.querySelectorAll('.cart__item');
  let total = 0;
  cartItems.forEach((element) => {
    total += parseFloat(element.innerText.split('$')[1]);
  });
  const carrinhoCompras = document.querySelector('.xablau');
  carrinhoCompras.innerHTML = '';
  const criaDivTotal = document.createElement('div');
  criaDivTotal.innerText = `Total: + ${total.toFixed(2)}`;
  criaDivTotal.className = 'total-price';
  carrinhoCompras.appendChild(criaDivTotal);
}

function adicionarItems() {
  document.body.addEventListener('click', async (event) => {
    if (event.target.matches('.item__add')) {
      const parent = event.target.parentNode;
      const id = getSkuFromProductItem(parent);
      const { id: sku, title: name, price: salePrice } = await pegaItem(id);
      const cartItems = document.querySelector('.cart__items');
      cartItems.appendChild(createCartItemElement({ sku, name, salePrice }));
      somar();
    }
  });
}
function emptyCart() {
  const cartItems = document.querySelector('.cart__items');
  cartItems.innerHTML = '';
}

function clicarEsvaziar() {
  const emptyCartButton = document.querySelector('.empty-cart');
  emptyCartButton.addEventListener('click', emptyCart);
}

window.onload = async function () {
  const items = await responseFetch();
  createItems(items);
  adicionarItems();
  clicarEsvaziar();
  somar();
};
