window.onload = function onload() { };
const query = 'computador';
const endPoint = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;

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
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', addItemChart);

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: R$${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addItemChart(e) {
  const itemId = e.target.parentNode.firstChild.innerText;
  const containerChart = document.querySelector('.cart__items');
  const consultaItem = await fetch(`https://api.mercadolibre.com/items/${itemId}`)
    .then(response => response.json())
    .then(data => data);
  const { id: sku, title: name, price: salePrice } = consultaItem;
  const chartItem = createCartItemElement({ sku, name, salePrice });
  containerChart.appendChild(chartItem);
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
