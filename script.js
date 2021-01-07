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

function salvaCarrinhoStorage() {
  const carrinhoCompras = document.querySelector('.cart__items');
  localStorage.setItem('carrinhoDeCompras', carrinhoCompras.innerHTML);
}

function recuperaCarrinhoStorage() {
  const recuperaCarrinhoCompras = localStorage.getItem('carrinhoDeCompras');
  const carrinhoCompras = document.querySelector('.cart__items');
  carrinhoCompras.innerHTML = recuperaCarrinhoCompras;
}

function somaValorItems() {
  const captura = document.querySelectorAll('.cart__item');
  let accumulator = 0;
  captura.forEach((element) => {
    accumulator += parseFloat(element.innerText.split('$')[1]);
  });
  const total = document.querySelector('.total-price');
  total.innerText = accumulator;
}

function cartItemClickListener(event) {
  event.target.remove();
  somaValorItems();
  salvaCarrinhoStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function criaListaItem() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then(response => response.json())
  .then((data) => {
    document.querySelector('.loading').remove();
    data.results.forEach((element) => {
      const objetoItem = {
        sku: element.id,
        name: element.title,
        image: element.thumbnail,
      };
      const items = document.querySelector('.items');
      items.appendChild(createProductItemElement(objetoItem));
    });
  });
}

function getSku(elementoPai) {
  return elementoPai.firstChild.innerText;
}

function addItem(event) {
  if (event.target.className === 'item__add') {
    const elementoPai = event.target.parentNode;
    const sku = getSku(elementoPai);
    fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then(response => response.json())
    .then((data) => {
      const descricaoItem = {
        sku,
        name: data.title,
        salePrice: data.price,
      };
      const itemCar = document.querySelector('.cart__items');
      itemCar.appendChild(createCartItemElement(descricaoItem));
      somaValorItems();
      salvaCarrinhoStorage();
    });
  }
}

function addEventItemCar() {
  const items = document.querySelector('.items');
  items.addEventListener('click', addItem);
}

function createEventEmptyCar() {
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', () => {
    const listaOrdenada = document.querySelector('.cart__items');
    listaOrdenada.innerHTML = '';
    somaValorItems();
    salvaCarrinhoStorage();
  });
}

window.onload = function onload() {
  criaListaItem();
  addEventItemCar();
  createEventEmptyCar();
  recuperaCarrinhoStorage();
};
