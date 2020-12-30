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

function countIterator() {
  return new Promise((resolve) => {
    const shoppingList = document.querySelectorAll('.cart__item');
    let counter = 0;

    for (let i = 0; i < shoppingList.length; i += 1) {
      counter += parseFloat(shoppingList[i].innerText.split(': $')[1]);
    }

    resolve(counter);
  });
}

async function priceCount() {
  const totalPrice = document.querySelector('.total-price');
  const countResult = await countIterator();
  totalPrice.innerText = `${countResult}`;
}

function cartItemClickListener(event) {
  const itemId = event.currentTarget.innerText.match(/MLB\d+/)[0];
  localStorage.removeItem(itemId);
  event.target.parentNode.removeChild(event.target);
  priceCount();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function clearList() {
  document.querySelector('.cart__items').textContent = '';
  localStorage.clear();
  priceCount();
}

window.onload = function onload() {
  Object.keys(localStorage).forEach((key) => {
    const retrievables = Object.fromEntries(localStorage[key].split(' | ').map(element => element.split(': ')));
    const { SKU: sku, NAME: name, PRICE } = retrievables;
    const salePrice = PRICE.slice(1);
    document.querySelector('.cart__items').appendChild(createCartItemElement({ sku, name, salePrice }));
  });
  priceCount();
  document.querySelector('.empty-cart').addEventListener('click', clearList);
};

async function buttonClickListener(event) {
  const id = getSkuFromProductItem(event.currentTarget.parentNode);
  if (!localStorage.getItem(id)) {
    const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
    const item = await response.json();
    const product = { sku: item.id, name: item.title, salePrice: item.price };

    const newProduct = createCartItemElement(product);
    document.querySelector('.cart__items').appendChild(newProduct);

    localStorage.setItem(id, newProduct.innerText);
    priceCount();
  } else {
    alert(`O item ${id} já está no carrinho.`);
  }
}

fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then(response => response.json())
  .then((data) => {
    data.results.forEach((item) => {
      const product = {};

      product.sku = item.id;
      product.name = item.title;
      product.image = item.thumbnail;

      document.querySelector('.items').appendChild(createProductItemElement(product));
    });
  })
  .then(() => {
    const itemList = document.querySelectorAll('.item');
    itemList.forEach(item => item.childNodes[3].addEventListener('click', buttonClickListener));
  });
