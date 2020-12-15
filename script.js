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
// Requisito 3
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
// Requisito 7
function loading() {
  const loadPage = document.querySelector('.loading');
  loadPage.remove();
}
// Requisito 4
const localStorageGet = () => {
  const ol = localStorage.getItem('carrinho');
  document.querySelector('.cart__items').innerHTML = ol;
};
function localStorageSave() {
  localStorage.setItem('carrinho', document.querySelector('.cart__items').innerHTML);
}
// Requisito 2
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
      localStorageSave();
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
// Requisito 1
const products = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then((data) => {
      loading();
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
// Requisito 6
function cleanCart() {
  const buttonClear = document.querySelector('.empty-cart');
  buttonClear.addEventListener('click', () => {
    const captureClass = document.querySelector('.cart__items');
    captureClass.innerHTML = '';
  });
}
window.onload = async () => {
  await products();
  cleanCart();
  localStorageGet();
};
