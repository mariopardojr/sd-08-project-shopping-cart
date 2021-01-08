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

const str = () => localStorage.setItem('str', document.querySelector('.cart__items').innerHTML);

function createProductItemElement({
  sku,
  name,
  image,
}) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

async function cartItemClickListener(event) {
  const elementToRemove = event.target;
  elementToRemove.parentElement.removeChild(elementToRemove);
  sumPrices();
  str();
}

function itemsFetch() {
  return fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => {
      response.json()
        .then((data) => {
          data.results.forEach((element) => {
            const item = {
              sku: element.id,
              name: element.title,
              image: element.thumbnail,
            };
            document.querySelector('.items').appendChild(createProductItemElement(item));
          });
        });
    });
}

function createCartItemElement({
  sku,
  name,
  salePrice,
}) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getSku(item) {
  return item.querySelector('span.item__sku').innerText;
}

function addCartItem() {
  document.querySelector('.items').addEventListener('click', (e) => {
    if (e.target.classList.contains('item__add')) {
      const parent = e.target.parentElement;
      const sku = getSku(parent);
      fetch(`https://api.mercadolibre.com/items/${sku}`)
        .then(response => response.json())
        .then((data) => {
          const object = {
            sku,
            name: data.title,
            salePrice: data.price,
          };
          const cartItem = document.querySelector('.cart__items');
          cartItem.appendChild(createCartItemElement(object));
          sumPrices();
          str();
        });
    }
  });
}

function emptyCart() {
  const buttonEsvaziar = document.querySelector('.empty-cart');
  buttonEsvaziar.addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
    sumPrices();
    str();
  });
}

const strLoad = () => {
  const strItems = document.querySelector('.cart__items');
  strItems.innerHTML = localStorage.getItem('str');
  strItems.addEventListener('click', ((e) => {
    if (e.target.classList.contains('cart__item')) {
      cartItemClickListener(e);
    }
  }));
  sumPrices();
};

const sumPrices = () => {
  const items = document.querySelectorAll('.cart__item');
  let sum = 0;
  items.forEach((item) => {
    sum += parseFloat(item.innerHTML.split('$')[1]);
  });
  document.querySelector('.total-price').innerHTML = sum;
}

window.onload = async function onload() {
  await itemsFetch();
  addCartItem();
  emptyCart();
  strLoad();
};
