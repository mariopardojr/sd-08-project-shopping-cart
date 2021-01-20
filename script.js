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
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function fetchProduct() {
  const items = document.querySelector('.items');
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => {
      response.json()
      .then((data) => {
        data.results.map((product) => {
          const products = {
            sku: product.id,
            name: product.title,
            image: product.thumbnail,
          };
          const item = createProductItemElement(products);
          return items.appendChild(item);
        });
      });
    });
}

function fetchProductById(itemId) {
  const cartItens = document.querySelector('.cart__items');
  console.log(cartItens);
  fetch(`https://api.mercadolibre.com/items/${itemId}`)
    .then((response) => {
      response.json()
        .then((data) => {
          const itemDetails = {
            sku: data.id,
            name: data.title,
            salePrice: data.price,
          };
          return cartItens.appendChild(createCartItemElement(itemDetails));
        });
    });
}

document.addEventListener('click', (element) => {
  const idOnFocus = element.target.parentNode;
  const itemId = idOnFocus.querySelector('span.item__sku').innerText;
  fetchProductById(itemId);
});

window.onload = function onload() {
  fetchProduct();
};
