async function totalPrice() {
  const valueCart = await document.querySelectorAll('.cart__item');
  let valuePrice = 0;
  await valueCart.forEach((item) => {
    const value = parseFloat(item.innerHTML.split('$')[1]);
    valuePrice = value + valuePrice;
    return Math.round(valuePrice.toFixed(2));
  });
  const totalPriceValue = document.querySelector('.total-price');
  totalPriceValue.innerHTML = valuePrice;
}

function Removeloading() {
  const loadPage = document.querySelector('.loading');
  loadPage.remove();
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

function localStorageSave() {
  localStorage.setItem('cart', document.querySelector('.cart__items').innerHTML);
}

function cartItemClickListener(Event) {
  Event.stopPropagation();
  Event.currentTarget.remove('');
  totalPrice();
  localStorageSave();
}

function removeItemCart() {
  const ItemCart = document.querySelectorAll('.cart__item');
  ItemCart.forEach(element => element.addEventListener('click', cartItemClickListener));
}

function localStorageGet() {
  const loadingCart = localStorage.getItem('cart');
  document.querySelector('.cart__items').innerHTML = loadingCart;
  totalPrice();
  removeItemCart();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createProductRequest() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then(response => response.json())
  .then((object) => {
    Removeloading();
    object.results.forEach((element) => {
      const product = {
        sku: element.id,
        name: element.title,
        image: element.thumbnail,
      };
      document.querySelector('.items').appendChild(createProductItemElement(product));
    });
  });
}

function addProductToCart() {
  document.querySelector('.items').addEventListener('click', (Event) => {
    if (Event.target.classList.contains('item__add')) {
      const sku = getSkuFromProductItem(Event.target.parentNode);
      fetch(`https://api.mercadolibre.com/items/${sku}`)
      .then(response => response.json())
      .then((data) => {
        const item = {
          sku,
          name: data.title,
          salePrice: data.price,
        };
        document.querySelector('.cart__items').appendChild(createCartItemElement(item));
        totalPrice();
        localStorageSave();
      });
    }
  });
}

function buttonClear() {
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
    const totalPriceValue = document.querySelector('.total-price');
    totalPriceValue.innerHTML = 0;
    localStorageSave();
  });
}

window.onload = function onload() {
  localStorageGet();
  createProductRequest();
  addProductToCart();
  buttonClear();
};
