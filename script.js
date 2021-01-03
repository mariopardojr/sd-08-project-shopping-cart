
// const fetch = require('node-fetch')


const getTotalPrice = () => {
  const list = document.querySelectorAll('.cart__item');
  let total = 0;
  list.forEach((element) => {
    total += parseFloat(element.innerHTML.split('$')[1]);
  });
  document.querySelector('.total-price').innerHTML = total;
};

const saveStorage = () => {
  const cartList = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cart', cartList);
};

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
  if (event.target.classList.contains('cart__item')) {
    event.target.remove();
    saveStorage();
    getTotalPrice();
  }
}

const loadStorage = () => {
  const cartLoad = localStorage.getItem('cart');
  const cartSelector = document.querySelector('.cart__items');
  cartSelector.innerHTML = cartLoad;
  cartSelector.addEventListener('click', (event) => {
    if (event.target.classList.contains('cart__item')) {
      cartItemClickListener(event);
    }
  });
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // li.addEventListener('click', cartItemClickListener);
  return li;
}

const getItem = async () => {
  const items = document.querySelector('.items');
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then((data) => {
      document.querySelector('.loading').remove();
      data.results.forEach((item) => {
        const objto = {
          sku: item.id,
          name: item.title,
          image: item.thumbnail,
        };
        items.appendChild(createProductItemElement(objto));
      });
    });
};

const addItem = () => {
  document.querySelector('.items').addEventListener('click', (event) => {
    if (event.target.classList.contains('item__add')) {
      const fatherElement = event.target.parentElement;
      const sku = getSkuFromProductItem(fatherElement);
      fetch(`https://api.mercadolibre.com/items/${sku}`)
        .then(response => response.json())
        .then((data) => {
          const obj = {
            sku: data.id,
            name: data.title,
            salePrice: data.price,
          };
          document
            .querySelector('.cart__items')
            .appendChild(createCartItemElement(obj));
          saveStorage();
          getTotalPrice();
        });
    }
  });
};

const emptyCart = () => {
  const clearButton = document.querySelector('.empty-cart');
  clearButton.addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
  });
};

window.onload = function onload() {
  loadStorage();
  getItem();
  addItem();
  getTotalPrice();
  emptyCart();
};
//  Parte do projeto feito graças ao plantão com a lógica do Massaki"
