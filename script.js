const teste = [];

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
  const cartItems = document.querySelector('.cart__items');
  cartItems.removeChild(event.target);
}

function createCartItemElement({ sku, name, salePrice }) {
  teste.push({ sku, name, salePrice });
  const teste2 = JSON.stringify(teste);
  localStorage.setItem('user', teste2);
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createProductItemElement({ sku, name, image, salePrice }) {
  const cartItems = document.querySelector('.cart__items');
  const section = document.createElement('section');
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(button);
  button.addEventListener('click', () => cartItems.appendChild(createCartItemElement({ sku, name, salePrice })));

  return section;
}

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

window.onload = function onload() {
  if (localStorage.getItem('user')) {
    const items = document.querySelector('.cart__items');
    const seila = localStorage.getItem('user');
    JSON.parse(seila).forEach((algo) => {
      const naosei = { sku: algo.sku, name: algo.name, salePrice: algo.salePrice };
      items.appendChild(createCartItemElement(naosei));
    });
  }

  const items = document.querySelector('.items');
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => {
      response.json().then((data) => {
        Object.values(data.results).forEach((product) => {
          const productData = {
            sku: product.id,
            name: product.title,
            image: product.thumbnail,
            salePrice: product.price,
          };
          items.appendChild(createProductItemElement(productData));
        });
      });
    });
};
