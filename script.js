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

const itemToCartBtn = async event => {
  const itemId = getSkuFromProductItem(event.target.parentNode);
  const url = `https://api.mercadolibre.com/items/${itemId}`;
  try {
    const response = await fetch(url);
    const { id, title, price } = await response.json();
    const li = createCartItemElement({ sku: id, name: title, salePrice: price });
    document.getElementsByClassName('cart__items')[0].appendChild(li);
  } catch (err) {
    console.log(err);
  }
}

window.onload = function onload() {
  const urlAPI = 'https://api.mercadolibre.com/sites/MLB/search?q=';
  const items = document.getElementsByClassName('items')[0];
  fetch(`${urlAPI}computador`)
    .then(resp => resp.json())
    .then(({ results }) => results)
    .then(respArr =>
      respArr.forEach(({ id, title, thumbnail }) => {
        const item = createProductItemElement({ sku: id, name: title, image: thumbnail });
        items.appendChild(item);
        item.addEventListener('click', itemToCartBtn);
      }))
    .catch(err => console.log(err));
};
