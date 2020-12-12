
const query = 'computador';
const endPoint = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;
const idItem = '0';
const buscaItem = (idItem) => fetch(`https://api.mercadolibre.com/items/${idItem}`)
.then(response => response.json())
.then(data => data);

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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

async function cartItemClickListener(e) {
  const containerChart = document.querySelector('.cart__items');
  const item = e.target;
  containerChart.removeChild(item);
  const itemId = item.id;
  localStorage.removeItem(itemId);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addItemChart(e) {
  const idItem = e.target.parentNode.firstChild.innerText;
  const containerChart = document.querySelector('.cart__items');
  const consultaItem = await buscaItem(idItem);
  const { id: sku, title: name, price: salePrice } = consultaItem;
  const chartItem = createCartItemElement({ sku, name, salePrice });
  chartItem.id = sku
  containerChart.appendChild(chartItem);
  localStorage.setItem(sku, name);
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', addItemChart);
  return section;
}
const newFetch = async () => {
  const items = await fetch(endPoint)
    .then(element => element.json())
    .then(result => result.results);
  const containeritem = document.querySelector('.items');
  items.forEach((item) => {
    const { id: sku, title: name, thumbnail: image } = item;
    const productItem = createProductItemElement({ sku, name, image });
    containeritem.appendChild(productItem);
  });
};
newFetch();

window.onload = function onload() {
  async function addItemChartLocalStorade(idItem) {
    const containerChart = document.querySelector('.cart__items');
    const consultaItem = await buscaItem(idItem);
    const { id: sku, title: name, price: salePrice } = consultaItem;
    const chartItem = createCartItemElement({ sku, name, salePrice });
    chartItem.id = sku;
    containerChart.appendChild(chartItem);
    localStorage.setItem(sku, name);
  }

  if (localStorage !== null) {
    const itemsLocalStorage = Object.keys(localStorage);
    itemsLocalStorage.forEach(id => addItemChartLocalStorade(id));
  }
};
