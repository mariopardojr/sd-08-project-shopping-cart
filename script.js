const urlMLGetListOfProducts = 'https://api.mercadolibre.com/sites/MLB/search?q=';
const urlMLGetProductById = 'https://api.mercadolibre.com/items/';

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

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // li.addEventListener('click', cartItemClickListener);
  return li;
}

// Requisito 2
function mlGetProductByID(productId) {
  fetch(`${urlMLGetProductById}${productId}`)
    .then(response => response.json())
    .then((data) => {
      document.querySelector('.cart__items').appendChild(createCartItemElement(data));
    });
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const btnAddCartProduct = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  btnAddCartProduct.addEventListener('click', (event) => {
    mlGetProductByID(getSkuFromProductItem(event.target.parentNode));
  });
  section.appendChild(btnAddCartProduct);
  return section;
}

// Requisito 1
const mlGetListOfProducts = (product) => {
  fetch(`${urlMLGetListOfProducts}${product}`)
    .then(response => response.json())
    .then((objects) => {
      const sectionItems = document.querySelector('.items');
      const mlListOfProducts = objects.results; // Array de produtos (objects.results)
      mlListOfProducts.forEach((mlProduct) => {
        const { id: sku, title: name, thumbnail: image } = mlProduct;
        const mlProductItem = createProductItemElement({ sku, name, image });
        sectionItems.appendChild(mlProductItem);
      });
    });
};

window.onload = function onload() {
  mlGetListOfProducts('computador');
};
