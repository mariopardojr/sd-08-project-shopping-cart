function total() {
  let totalPrice = 0;
  const totalPricePlace = document.querySelector('.total-price');
  const cartList = document.querySelectorAll('.cart__item');
  cartList.forEach((item) => { totalPrice += parseFloat(item.innerText.split('$')[1]); });
  totalPricePlace.innerText = totalPrice;
}

async function setLocalStorage() {
  localStorage.clear();
  const cartList = await document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cartList', cartList);
}

async function cartItemClickListener(event) {
  event.target.remove('');
  await setLocalStorage();
  await total();
}

function getLocalStorage() {
  document.querySelector('.cart__items').innerHTML = localStorage.getItem('cartList');
  const lista = document.querySelector('.cart__items');
  for (let i = 0; i < lista.childNodes.length; i += 1) {
    console.log(lista.childNodes[i]);
    lista.childNodes[i].addEventListener('click', cartItemClickListener);
  }
}

function apagarTudo() {
  const botao = document.querySelector('.empty-cart');
  const lista = document.querySelector('.cart__items');
  botao.addEventListener('click', () => {
    lista.innerHTML = '';
    localStorage.clear();
    total();
  });
}


const fetchAwaitAsync = async (endpoint) => {
  const response = await fetch(endpoint);
  const data = await response.json();
  return data;
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function putList(item) {
  let arrayObjects = {};
  const carrinho = document.querySelector('.cart__items');
  const sku = getSkuFromProductItem(item);
  await fetchAwaitAsync(`https://api.mercadolibre.com/items/${sku}`)
  .then((info) => {
    arrayObjects = {
      sku: info.id,
      name: info.title,
      image: info.thumbnail,
      salePrice: info.price,
    };
    const itemNoCarrinho = createCartItemElement(arrayObjects);
    carrinho.appendChild(itemNoCarrinho);
    total();
    setLocalStorage();
  });
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
  const botao = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  botao.addEventListener('click', () => (putList(botao.parentElement)))
  section.appendChild(botao);
  return section;
}

async function createObject() {
  let arrayObjects = {};
  const produtos = document.querySelector('.items');
  await fetchAwaitAsync('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((info) => {
    for (let i = 0; i < info.results.length; i += 1) {
      arrayObjects = {
        sku: info.results[i].id,
        name: info.results[i].title,
        image: info.results[i].thumbnail,
      };
      const section = createProductItemElement(arrayObjects);
      produtos.appendChild(section)
    }
  })
}

window.onload = function onload() {
  createObject();
  getLocalStorage();
  total();
  apagarTudo();
};
