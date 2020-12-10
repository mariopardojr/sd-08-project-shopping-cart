const urlMLGetListOfProducts = 'https://api.mercadolibre.com/sites/MLB/search?q=';

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

// Requisito 1
const mlGetListOfProducts = (product) => {
  fetch(`${urlMLGetListOfProducts}${product}`)
    .then(response => response.json())
    .then((objects) => {
      const sectionItems = document.querySelector('.items');
      const mlListOfProducts = objects.results; // Array de produtos (objects.results)
      mlListOfProducts.forEach((mlProduct) => {
        const { id: sku, title: name, thumbnail: image } = mlProduct;
        const mlProductItem = createProductItemElement({ sku, name, image });
        sectionItems.appendChild(mlProductItem);
      });
    });
};

window.onload = function onload() {
  mlGetListOfProducts('computador');
};
