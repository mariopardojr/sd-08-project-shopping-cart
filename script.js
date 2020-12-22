// const fetch = require("node-fetch");

// const saveLocalStorage = () => {
//   currentCart = document.querySelector('.cart__items');
//   localStorage.setItem('cart', currentCart);
// };

// const fetchLocalStorage = () => {
//   const loadedCart = localStorage.getItem('cart');
//   document.querySelector('.cart__items').innerText = loadedCart;
// };

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
  event.target.remove();
  // saveLocalStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', () => {
    fetch(`https://api.mercadolibre.com/items/${sku}`)
      .then(response => response.json())
      .then(data => {
        const { id, title, price } = data;
        return { sku: id, name: title, salePrice: price };
      })
      .then(productDetails => {
        const cart = document.querySelector('.cart__items');
        cart.appendChild(createCartItemElement(productDetails));
      });
  });
  section.appendChild(button);
  // saveLocalStorage();
  return section;
}

const getProduct = () => fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador').then(
  response => {
    response.json().then(data => {
      const arrayResults = data.results;
      arrayResults.forEach(prod => {
        const apply = createProductItemElement({
          sku: prod.id,
          name: prod.title,
          image: prod.thumbnail,
        });
        document.querySelector('.items').appendChild(apply);
      });
    });
  },
);

const cleanCart = () => {
  createProductItemElement();
  cleanButton = document.querySelector('.empty-cart');
  cleanButton.addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
    // saveLocalStorage();
  });
};

window.onload = function onload() {
  getProduct();
  cleanCart();
  // fetchLocalStorage();
};
