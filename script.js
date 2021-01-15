

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
  // funcao
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addToCart(event) {
  const item = event.target;
  const sku = getSkuFromProductItem(item.parentNode);
  const cart = document.querySelector('.cart__items');
  fetch(`https://api.mercadolibre.com/items/${sku}`)
  .then(r => r.json())
  .then((r) => {
    const id = r.id;
    const title = r.title;
    const price = r.price;
    const info = { sku: id, name: title, salePrice: price };
    cart.appendChild(createCartItemElement(info));
  });
}

function displayItems() {
  const secao = document.querySelector('.items');
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computer')
  .then(r => r.json())
  .then((r) => {
    const data = {};
    Object.assign(data, r);
    const products = r.results;
    products.forEach((each) => {
      const id = each.id;
      const title = each.title;
      const thumb = each.thumbnail;
      const info = { sku: id, name: title, image: thumb };
      secao.appendChild(createProductItemElement(info));
    });
  })
  .then(() => {
    const button = document.querySelectorAll('button.item__add');
    button.forEach(each => {
      each.addEventListener('click', addToCart);
    })
  })
}

window.onload = function onload() {
  // fetchAndRetrieveProducts()
  displayItems();
};

