function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

async function soma() {
  const cartItens = document.querySelectorAll('.cart__item');
  const totalPrice = document.querySelector('.total-price');
  let total = 0;

  cartItens.forEach((cI) => {
    total += parseFloat(cI.innerHTML.split('$')[1]);
    totalPrice.innerText = total;
  });
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function addToLocal() {
  localStorage.setItem('cart', document.querySelector('.cart__items').innerHTML);
}

function cartItemClickListener(event) {
  event.target.parentNode.removeChild(event.target);
  soma();
  addToLocal();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addProduct(e) {
  const id = e.target.parentNode.firstChild.innerText;
  fetch(`https://api.mercadolibre.com/items/${id}`)
  .then(res => res.json())
  .then((data) => {
    const list = document.querySelector('ol');
    const item = {
      sku: data.id,
      name: data.title,
      salePrice: data.price,
    };
    list.appendChild(createCartItemElement(item));
    soma();
    addToLocal();
  });
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', addProduct);

  return section;
}

function recreateRemoveItem() {
  document.querySelectorAll('li').forEach((item) => {
    item.addEventListener('click', cartItemClickListener);
  });
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

window.onload = function onload() {
  document.querySelector('.empty-cart').addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
    soma();
    addToLocal();
  });
  document.querySelector('.cart__items').innerHTML = localStorage.getItem('cart');
  recreateRemoveItem();
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then(response => response.json())
  .then((data) => {
    document.querySelector('.loading').remove();
    data.results.forEach((res) => {
      const obj = {
        sku: res.id,
        name: res.title,
        image: res.thumbnail,
      };
      document.querySelector('.items').appendChild(createProductItemElement(obj));
    });
  });
};
