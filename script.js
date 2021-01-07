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

function endpointPriceProduct(sku) {
  return fetch(`https://api.mercadolibre.com/items/${sku}`)
  .then(response => response.json())
  .then(json => json.price);
}

// requisito 3
async function cartItemClickListener(event) {
  const cart = JSON.parse(localStorage.getItem('save'));
  cart.splice(cart.indexOf(event.target.innerText), 1);
  localStorage.setItem('save', JSON.stringify(cart));

  const id = event.target.innerText.split(' ');
  const price = await endpointPriceProduct(id[1]);
  let priceStorageRemove = JSON.parse(localStorage.getItem('priceStorage'));
  priceStorageRemove -= price;
  priceStorageRemove = Math.round(priceStorageRemove * 100) / 100;

  const spanPriceToPay = document.querySelector('.total-price');
  spanPriceToPay.innerText = `${priceStorageRemove}`;

  localStorage.setItem('priceStorage', JSON.stringify(priceStorageRemove));

  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const sectionItem = document.querySelector('.items');

function makeList(url) {
  if (url !== undefined) {
    return fetch(url)
      .then(response => response.json())
      .then(data =>
        data.results.forEach((obj) => {
          const par = { sku: obj.id, name: obj.title, image: obj.thumbnail };
          sectionItem.appendChild(createProductItemElement(par));
        }),
      );
  }
  throw new Error('Erro na url');
}

async function priceToPay(string) {
  const id = string.split(' ');
  const price = await endpointPriceProduct(id[1]);

  let priceStorageAdd = JSON.parse(localStorage.getItem('priceStorage'));
  priceStorageAdd += price;
  priceStorageAdd = Math.round(priceStorageAdd * 100) / 100;

  const spanPriceToPay = document.querySelector('.total-price');
  spanPriceToPay.innerText = `${priceStorageAdd}`;

  localStorage.setItem('priceStorage', JSON.stringify(priceStorageAdd));
}

function addLocalStorage(item) {
  if (localStorage.length === 0) {
    const cart = [];
    priceToPay(item.innerText);
    cart.push(item.innerText);
    localStorage.setItem('save', JSON.stringify(cart));
  } else {
    const cart = JSON.parse(localStorage.getItem('save'));
    priceToPay(item.innerText);
    cart.push(item.innerText);
    localStorage.setItem('save', JSON.stringify(cart));
  }
}

const olCartItems = document.querySelector('.cart__items');

async function addCart(target) {
  let par;
  const id = target.parentNode.firstChild.innerText;
  await fetch(`https://api.mercadolibre.com/items/${id}`)
    .then(response => response.json())
    .then((json) => { par = { sku: json.id, name: json.title, salePrice: json.price }; })
    .catch(() => console.log('Error'));

  olCartItems.appendChild(createCartItemElement(par));
  addLocalStorage(createCartItemElement(par));
}

function localStorageFill() {
  if (localStorage.length !== 0) {
    const cartLocalStorage = JSON.parse(localStorage.getItem('save'));
    cartLocalStorage.forEach((product) => {
      const li = createCustomElement('li', 'cart__item', product);
      li.addEventListener('click', cartItemClickListener);
      olCartItems.appendChild(li);
    });
    const priceStorage = JSON.parse(localStorage.getItem('priceStorage'));
    const spanPriceToPay = document.querySelector('.total-price');
    spanPriceToPay.innerText = `${priceStorage}`;
  }
}

window.onload = async function onload() {
  await makeList('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const addCartBtn = document.querySelectorAll('.item__add');
  await addCartBtn.forEach((obj) => {
    obj.addEventListener('click', function () {
      addCart(obj);
    });
  });
  localStorageFill();
};
