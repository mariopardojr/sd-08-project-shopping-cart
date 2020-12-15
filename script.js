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
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
function cartItemClickListener(event) {
  event.target.parentNode.removeChild(event.target);
}
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
const addProducts = (event) => {
  const test = event.target.parentNode;
  const idItem = getSkuFromProductItem(test);
  fetch(`https://api.mercadolibre.com/items/${idItem}`)
    .then(resolve => resolve.json())
    .then((data) => {
      const item = {
        sku: data.id,
        name: data.title,
        salePrice: data.price,
      };
      const itemSelect = document.querySelector('.cart__items');
      itemSelect.appendChild(createCartItemElement(item));
    });
};
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', addProducts);
  return section;
}
const products = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then((data) => {
      data.results.forEach((product) => {
        const object = {
          sku: product.id,
          name: product.title,
          image: product.thumbnail,
        };
        document.querySelector('.items').appendChild(createProductItemElement(object));
      });
    });
};
function cleanCart() {
  const buttonClear = document.querySelector('.empty-cart');
  buttonClear.addEventListener('click', () => {
    const captureClass = document.querySelector('.cart__items');
    captureClass.innerHTML = '';
  });
}
function createLoading() {
  const loading = document.createElement('div');
  loading.className = 'loading';
  loading.innerHTML = 'loading ...';
  const captureBody = document.querySelector('body');
  captureBody.appendChild(loading);
}
window.onload = function onload() {
  products();
  cleanCart();
  createLoading();
};
