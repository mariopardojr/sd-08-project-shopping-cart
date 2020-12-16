function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function saveProductsLocalStorage() {
  localStorage.setItem(
    'productsCart',
    document.querySelector('.cart__items').innerHTML,
  );
}

// document.querySelector('.empty-cart').addEventListener('click', () => {
//   document.querySelector('.cart__items').innerHTML = '';
//   saveProductsLocalStorage();
// });

function cartItemClickListener(event) {
  event.target.remove();
  saveProductsLocalStorage();
}

function loadingProductsLocalStorage() {
  document.querySelector('.cart__items').innerHTML = localStorage.getItem(
    'productsCart',
  );

  const list = document.querySelectorAll('.cart__item');
  list.forEach(item => {
    item.addEventListener('click', cartItemClickListener);
  });
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

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

function fetchProductsApi() {
  const sectionItems = document.querySelector('.items');
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then(data => data.results.map(el => [el.id, el.title, el.thumbnail]))
    .then(products => {
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
};
