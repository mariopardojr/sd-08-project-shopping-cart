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
  const product = document.querySelector('.items');
  product.appendChild(section);

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
  //
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  const ol = document.querySelector('.cart__items');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  ol.appendChild(li);
  return li;
}

function getProducts() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => {
      response.json()
        .then((data) => {
          data.results.map((item) => {
            const items = {
              sku: item.id,
              name: item.title,
              image: item.thumbnail,
            };
            return createProductItemElement(items);
          });
        });
    });
}

function addItemToCart() {
  document.querySelector('.items')
    .addEventListener('click', (event) => {
      if (event.target.classList.contains('item__add')) {
        const sku = getSkuFromProductItem(event.target.parentElement);
        fetch(`https://api.mercadolibre.com/items/${sku}`)
          .then((response) => {
            response.json()
              .then((data) => {
                const product = {
                  sku,
                  name: data.title,
                  salePrice: data.price,
                };
                return createCartItemElement(product);
              });
          });
      }
    });
}

window.onload = function onload() {
  getProducts();
  addItemToCart();
};
