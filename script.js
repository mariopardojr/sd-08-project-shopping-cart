// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

/* Requisito 7 */
function showMessageLoading() {
  const section = document.querySelector('.container-loading');
  const message = document.createElement('span');
  message.classList.add('loading');
  message.innerHTML = 'loading...';
  section.appendChild(message);
}

/* Requisito 7 */
function takeMessageLoading() {
  const section = document.querySelector('.container-loading');
  const message = document.querySelector('.loading');
  section.remove(message);
}

/* Requisito 4 */
function saveProductsLocalStorage() {
  localStorage.setItem(
    'productsCart',
    document.querySelector('.cart__items').innerHTML,
  );
}

/* Requisito 5 */
function calcTotalPriceCart() {
  const products = document.querySelectorAll('.cart__item');
  let totalCart = 0;
  products.forEach(product => {
    totalCart += parseFloat(product.innerHTML.split('PRICE: $')[1]);
  });
  document.querySelector('.total-price').innerHTML = totalCart;
}

/* Requisito 6 */
function clearShoppingCart() {
  document.querySelector('.empty-cart').addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
    calcTotalPriceCart();
    saveProductsLocalStorage();
  });
}

/* Requisito 3 */
function cartItemClickListener(event) {
  event.target.remove();
  calcTotalPriceCart();
  saveProductsLocalStorage();
}

/* Requisito 4 */
function loadingProductsLocalStorage() {
  document.querySelector('.cart__items').innerHTML = localStorage.getItem(
    'productsCart',
  );
  const list = document.querySelectorAll('.cart__item');
  list.forEach(item => {
    item.addEventListener('click', cartItemClickListener);
  });
  calcTotalPriceCart();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

/* Requisito 2 */
function createCustomElement(element, className, innerText, sku) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  e.addEventListener('click', () => {
    fetch(`https://api.mercadolibre.com/items/${sku}`)
      .then(response => response.json())
      .then(data => {
        const { id, title, price } = data;
        return { sku: id, name: title, salePrice: price };
      })
      .then(products => {
        const listCart = document.querySelector('.cart__items');
        listCart.appendChild(createCartItemElement(products));
        calcTotalPriceCart();
        saveProductsLocalStorage();
      });
  });
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!', sku),
  );
  return section;
}

/* Requisito 1 */
function fetchProductsApi() {
  showMessageLoading();
  const sectionItems = document.querySelector('.items');
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then(data => data.results.map(el => [el.id, el.title, el.thumbnail]))
    .then(products => {
      takeMessageLoading();
      products.forEach(product => {
        const [sku, name, image] = product;
        sectionItems.appendChild(
          createProductItemElement({ sku, name, image }),
        );
      });
    });
}

window.onload = function onload() {
  fetchProductsApi();
  loadingProductsLocalStorage();
  clearShoppingCart();
};
