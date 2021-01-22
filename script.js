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
  event.stopPropagation();
  event.currentTarget.remove('');
  totalPrice();
  localStorageSave();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function loading() {
  const load = document.querySelector('.loading');
  load.remove();
}

async function totalPrice() {
  const priceCart = document.querySelectorAll('.cart__item');
  let priceUni =0;
  await priceCart.forEach((item) => {
    const value = parseFloat(item.innerHTML.split('$')[1]);
    priceUni = value + priceUni;
    return Math.round(priceUni.toFixed(2));
  });
  const totalGeneral = document.querySelector('.total-price');
  totalGeneral.innerHTML = priceUni;
}

function searchShopping() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then(Response => Response.json())
  .then((Object) => {
    loading();
    Object.results.forEach((element) => {
      const itemSearch = {
        sku: element.id,
        name: element.title,
        image: element.thunbnail,
      };
      document.querySelector('.items').appendChild(createProductItemElement(itemSearch));
    });
  });
}

function addProduct() {
  document.querySelector('.items').addEventListener('click', (Event) => {
    if (Event.target.classList.contains('item__add')) {
      const sku = getSkuFromProductItem(Event.target.parentNode);
      fetch(`https://api.mercadolibre.com/items/${sku}`)
      .then(Response => Response.json())
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

function removeItem() {
  const remoItem = document.querySelectorAll('.cart__items');
  remoItem.forEach(element => element.addEventListener('click', cartItemClickListener));
}

function localStorageSave() {
  localStorage.setItem('cart', document.querySelector('.cart__items').innerHTML);
}

function clear() {
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML='';
    const total = document.querySelector('.total-price');
    total.innerHTML = 0;
    localStorageSave();
  });
}

function localStorageGet() {
  const loadCart = localStorage.getItem('cart');
  document.querySelector('.cart__items').innerHTML = loadCart;
  totalPrice();
  removeItem();
}

window.onload = function onload() {
  localStorageGet();
  searchShopping();
  addProduct();
  clear();
};
