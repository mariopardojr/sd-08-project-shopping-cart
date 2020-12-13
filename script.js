// Variaveis
const query = 'computador';
const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;
const endpoitID = 'https://api.mercadolibre.com/items/'


function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

async function criaCartItem(e) {
  const cartContainer = document.querySelector('.cart__items');
  const idItem = e.target.parentNode.firstChild.innerText
  const buscaId = await fetch(endpoitID + idItem)
    .then(r => r.json())
    .then(r => r)
  const {id: sku, title: name, price: salePrice} =  buscaId;
  cartContainer.appendChild(createCartItemElement(sku, name, salePrice));
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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  // coloque seu código aqui
  document.querySelector('.cart__items').removeChild(event.target);
}

function createCartItemElement(sku, name, salePrice) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.id = sku
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
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
  newFetch();
};
