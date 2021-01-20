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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  event.target.parentNode.removeChild(event.target);
}

function createCartItemElement(product) {
  const li = document.createElement('li');
  const { id, title, price } = product;
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addItemToCart(event) {
  const sku = event.target.parentNode.querySelector('.item__sku').innerText;
  const response = await fetch(`https://api.mercadolibre.com/items/${sku}`);
  const result = await response.json();
  const cartList = document.querySelector('.cart__items');
  cartList.appendChild(createCartItemElement(result));
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  button = section.querySelector('.item__add');
  button.addEventListener('click', addItemToCart);
  return section;
}

async function fetchAndRenderizeProducts() {
  try {
    const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
    const { results } = await response.json();
    results.forEach((product) => {
      const productItem = createProductItemElement(product);
      document.querySelector('.items').appendChild(productItem);
    });
  } catch (error) {
    console.log('erro aqui', error);
  }
}

window.onload = function onload() {
  fetchAndRenderizeProducts();
};
