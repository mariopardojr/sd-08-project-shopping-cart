
window.onload = function onload() { 
  createProductsList();
  addToCart()
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

function createProductsList() {
  return new Promise((resolve, reject) => {
    fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json()).then(data => {
      data.results.forEach(result => {
        const product = { sku: result.id, name: result.title, image: result.thumbnail };
        const items = document.querySelector('.items');
        items.appendChild(createProductItemElement(product));
        resolve();
      });
    });
  });
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function addToCart() {
  const items = document.getElementsByTagName('button')[0];
  console.log(items);
  items.addEventListener('click', (event) => {
    let testando = event.target;
    console.log(getSkuFromProductItem(testando))
  });
}

function cartItemClickListener(event) {
//codigo
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

