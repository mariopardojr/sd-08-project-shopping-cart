
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
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const promiseApi = (url) => {
  const results = new Promise((resolve, reject) => {
    fetch(url).then(response => response.json())
      .then(data => resolve(data))
      .catch(err => reject(err));
  });
  return results;
};

const getListIdsProduct = async () => {
  const PRODUCT = 'computador';
  const url = `https://api.mercadolibre.com/sites/MLB/search?q=${PRODUCT}`;
  const [getSection] = document.querySelectorAll('.items');
  const { results } = await promiseApi(url);
  getSection.innerText = '';
  results.forEach((item) => {
    const { id: sku, title: name, thumbnail: image } = item;
    const elProduct = createProductItemElement({ sku, name, image });
    getSection.appendChild(elProduct);
  });
};

window.onload = function onload() {
  getListIdsProduct();
};
