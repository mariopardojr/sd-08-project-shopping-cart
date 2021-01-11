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

async function createTotal(value) {
  const cartFather = document.getElementsByClassName('cart')[0];
  const section = document.createElement('section');

  const findTotalOld = document.getElementsByClassName('totalPrice')[0];
  if (findTotalOld) {
    findTotalOld.remove();
  }

  if (value !== 0) {
    section.className = 'totalPrice';
    section.innerHTML = value.toFixed(2);
    cartFather.classList.add('total-price');
    cartFather.appendChild(section);
  } else {
    section.className = 'totalPrice';
    section.innerHTML = '0,00';
    cartFather.classList.add('total-price');
    cartFather.appendChild(section);
  }
}

async function sum() {
  const getItens = document.getElementsByClassName('cart__item');
  let value = 0;

  for (let i = 0; i < getItens.length; i += 1) {
    const get = getItens[i].innerText;
    const price = parseFloat(get.slice(get.indexOf('$') + 1));
    value += parseFloat(price);
  }
  return value;
}

async function cartItemClickListener(event) {
  event.target.remove();
  const olcart = document.querySelector('ol.cart__items');
  localStorage.setItem('cart', olcart.innerHTML);
  createTotal(sum());
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addToCart(event) {
  fetch(
    `https://api.mercadolibre.com/items/${getSkuFromProductItem(event.target.parentElement)}`,
  ).then(response =>
    response.json().then((data) => {
      const obj = {};
      obj.sku = data.id;
      obj.name = data.title;
      obj.salePrice = data.price;
      const olcart = document.querySelector('ol.cart__items');
      olcart.appendChild(createCartItemElement(obj));
      createTotal(sum());
      localStorage.setItem('cart', olcart.innerHTML);
    }),
  );
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );
  section.querySelector('button').addEventListener('click', addToCart);
  return section;
}

function fetchML() {
  return fetch(
    'https://api.mercadolibre.com/sites/MLB/search?q=computador',
  ).then((response) => {
    response.json().then((data) => {
      const data2 = Object.values(data.results);
      const items = document.getElementsByClassName('items')[0];
      data2.map(each =>
        items.appendChild(
          createProductItemElement(
            ({
              sku: each.id,
              name: each.title,
              image: each.thumbnail,
            }),
          ),
        ),
      );
    });
  });
}

function loadCartStorage() {
  const localStore = localStorage.getItem('cart');
  const olFather = document.getElementsByClassName('cart__items')[0];
  console.log(localStore);

  olFather.innerHTML = localStore;

  for (let i = 0; i < olFather.childNodes.length; i += 1) {
    olFather.childNodes[i].addEventListener('click', cartItemClickListener);
  }
}

function emptyCart() {
  const button = document.getElementsByClassName('empty-cart')[0];
  const itemsCart = document.getElementsByClassName('cart__item');
  button.addEventListener('click', function () {
    for (let i = 0; i < itemsCart.length; i += 0) {
      itemsCart[i].remove();
    }
    createTotal(0);
    localStorage.removeItem('cart');
  });
}

window.onload = async function onload() {
  await fetchML();
  if (localStorage.length !== 0) {
    loadCartStorage();
  }
  createTotal(sum());
  emptyCart();
};
