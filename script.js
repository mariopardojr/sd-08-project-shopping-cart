// window.onload = function onload() { };

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

const getProductRequest = (item) => {
  const requestSpecs = {
    method: 'GET',
    headers: { 'Accept': 'application/json' }
  };

  const searchItem = item;
  return new Promise((resolve, reject) => {
    fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${searchItem}`, requestSpecs)
      .then(response => response.json())
      .then((data) => data.results)
      .then((results) => resolve(results));
  })
  
};

getProductRequest('computador').then((response) => {
  const sectionContainer = document.querySelector('.items');
  response.forEach((item) => {
    let product = { sku: item.id, name: item.title, image: item.thumbnail};
    sectionContainer.appendChild(createProductItemElement(product));
  })
});

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
