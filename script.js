window.onload = function onload() { };

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
    .addEventListener('click', addItemToCart);
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.parentNode.removeChild(event.target);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
function addItemToCart() {
  const selectItems = document.querySelector('.items');
  selectItems.addEventListener('click', (event) => {
    if (event.target.className === 'item__id') {
      const parentElem = event.target.parentElement;
      const idProduct = getSkuFromProductItem(parentElem);
      fetch(`https://api.mercadolibre.com/items/${idProduct}`)
        .then(response => response.json())
        .then((object) => {
          const objResult = {
            sku: object.id,
            name: object.title,
            saleprice: object.price,
          };
        });
      const listProduct = document.querySelector('.cart_items');
      listProduct.appendChild(createCartItemElement(objResult));
    }
  });
}
window.onload = function onload() {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(endpoint)
  .then(response => response.json())// transforme o resultaod e json
  .then((object) => {
    const { results } = object;
    const sectionItens = document.querySelector('.items');
    results.forEach((product) => {
      const obj = { sku: product.id, name: product.title, image: product.thumbnail }
      sectionItens.appendChild(createProductItemElement(obj));
    });
  });
 
};
