

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
  
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function displayItems() {
  const secao = document.querySelector('.items');
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computer')
  .then(r => r.json())
  .then((r) => {
    const data = {};
    Object.assign(data, r);
    const products = r.results;
    products.forEach((each) => {
      const sku = each.id;
      const name = each.title;
      const image = each.thumbnail;
      const info = {sku: sku, name: name, image: image};
      secao.appendChild(createProductItemElement(info));
    });
  })
  //return secao.appendChild(createProductItemElement(produtoTeste));
}

window.onload = function onload() {
  // fetchAndRetrieveProducts()
  displayItems();
};
