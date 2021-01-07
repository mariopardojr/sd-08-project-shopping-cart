function localSave() {
  const itemsFromCart = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cart', itemsFromCart);
}

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
    event.target.parentElement.removeChild(event.target);
  }
  localSave();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}


function gerarLista() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then((data) => {
      data.results.forEach((item) => {
        const obj = { sku: item.id, name: item.title, image: item.thumbnail };
        const section = document.querySelector('.items');
        section.appendChild(createProductItemElement(obj));
      });
    });
}

function addItem() {
  document.querySelector('.items')
  .addEventListener('click', (event) => {
    if (event.target.classList.contains('item__add')) {
      const parent = event.target.parentElement;
      const SKU = getSkuFromProductItem(parent);
      console.log(SKU);
      fetch(`https://api.mercadolibre.com/items/${SKU}`)
      .then(response => response.json())
      .then((data) => {
        const obj = { sku: data.id, name: data.title, salePrice: data.price };
        document.querySelector('.cart__items')
        .appendChild(createCartItemElement(obj));
        localSave();
      });
    }
  });
}
function loadLocalSave() {
  const list = document.querySelector('.cart__items');
  list.innerHTML = localStorage.getItem('cart');
  list.addEventListener('click', ((event) => {
    if (event.target.classList.contains('cart__item')) {
      cartItemClickListener(event);
    }
  }));
}

function clearAll() {
  document.querySelector('.total-price').innerHTML = '0';
  document.querySelector('.cart__items').innerHTML = '';
  localStorage.setItem('cart__items', '');
  localSave();
}


window.onload = function onload() {
  gerarLista();
  addItem();
  loadLocalSave();
  document.querySelector('.empty-cart').addEventListener('click', clearAll);
};
