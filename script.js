function localSave() {
  const itemsFromCart = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cart', itemsFromCart);
}

function getThePrice(item) {
  return item.match(/\$\d+.?\d+/)[0].slice(1);
}

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

function somaTotal() {
  let total = 0;
  document.querySelectorAll('.cart__item')
  .forEach(item => (total += parseFloat(getThePrice(item.innerText))));

  document.querySelector('.total-price').innerText = total;
}

function cartItemClickListener(event) {
  const remove = event.target;
  remove.parentElement.removeChild(remove);
  somaTotal();
  localSave();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function carregarItensCarrinho() {
  const items = fetch(`https://api.mercadolibre.com/items/${id}`)
  .then(response => response.json());

  const { id: sku, title: name, price: salePrice } = items;

  const product = createCartItemElement({ sku, name, salePrice });
  product.addEventListener('click', cartItemClickListener);
  const cart = document.querySelector('cart__items');
  cart.appendChild(product);
  somaTotal();
}

async function add(event) {
  const id = getSkuFromProductItem(event.target.parentElement);
  await carregarItensCarrinho(id);
  localSave();
}

function gerarLista() {
  const lista = fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then(response => response.json())
  .then(data => data.results);

  lista.forEach((item) => {
    const { id: sku, title: name, thumbnail: image } = item;
    const product = createProductItemElement({ sku, name, image });
    product.querySelector('.item__add').addEventListener('click', add);
    const section = document.querySelector('.items');
    section.appendChild(product);
  });
}


window.onload = function onload() {
  gerarLista();
};
