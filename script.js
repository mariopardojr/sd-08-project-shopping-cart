// Variaveis
const query = 'computador';
const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;
const endpoitID = 'https://api.mercadolibre.com/items/';

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

async function somaTotal(id, soma) {
  const total = document.querySelector('.total-price');
  const end = endpoitID + id;
  const item = await fetch(end).then(response => response.json())
    .then(rdata => rdata);
  const resultSoma = Math.round((parseFloat(total.innerText) + item.price) * 100) / 100;
  const resultSubtrai = Math.round((parseFloat(total.innerText) - item.price) * 100) / 100;
  if (soma) {
    total.innerText = resultSoma;
  } else {
    total.innerText = resultSubtrai;
  }
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  document.querySelector('.cart__items').removeChild(event.target);
  localStorage.removeItem(event.target.id);
  somaTotal(event.target.id, false);
}

function createCartItemElement(sku, name, salePrice) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.id = sku;
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
function verificaLocalStorage() {
  const cartContainer = document.querySelector('.cart__items');
  if (localStorage.length > 0) {
    for (let i = 0; i < localStorage.length; i += 1) {
      const id = localStorage.key(i);
      const valor = localStorage.getItem(id).split('|');
      cartContainer.appendChild(createCartItemElement(id, valor[0], parseFloat(valor[1])));
      somaTotal(id, true);
    }
  }
}
async function criaCartItem(e) {
  const cartContainer = document.querySelector('.cart__items');
  const idItem = e.target.parentNode.firstChild.innerText;
  const buscaId = await fetch(endpoitID + idItem)
    .then(r => r.json())
    .then(r => r);
  const { id: sku, title: name, price: salePrice } = buscaId;
  if (!document.querySelector(`#${sku}`)) {
    cartContainer.appendChild(createCartItemElement(sku, name, salePrice));
    localStorage.setItem(sku, `${name} | ${salePrice}`);
    somaTotal(sku, true);
  }
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (className === 'item__add') {
    e.addEventListener('click', criaCartItem);
  }
  return e;
}

function createProductItemElement(sku, name, image) {
  const section = document.createElement('section');
  section.classList = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}
async function newFetch() {
  const listaProd = await fetch(endpoint)
    .then(r => r.json())
    .then(r => r.results);

  listaProd.forEach((element) => {
    const itemsContainer = document.querySelector('.items');
    const { id: sku, title: name, thumbnail: image } = element;
    itemsContainer.appendChild(createProductItemElement(sku, name, image));
  });
}

window.onload = function onload() {
  verificaLocalStorage();
  newFetch();
};
