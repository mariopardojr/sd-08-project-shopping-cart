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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', async function () {
    const cartItem = await fetch(`https://api.mercadolibre.com/items/${sku}`);
    const cartItemObj = await cartItem.json();
    const cartObjectTransformed = {
      sku: cartItemObj.id,
      name: cartItemObj.title,
      salePrice: cartItemObj.price,
    };
    const cartAdded = createCartItemElement(cartObjectTransformed);
    const cart = document.querySelector('.cart__items');
    cart.appendChild(cartAdded);
  });

  return section;
}

const retrieveProducts = async (product) => {
  const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${product}`);
  const object = await response.json();
  object.results
  .forEach((item) => {
    const newComputer = {
      sku: item.id,
      name: item.title,
      image: item.thumbnail,
    };
    const createProduct = createProductItemElement(newComputer);
    const items = document.querySelector('.items');
    items.appendChild(createProduct);
  });
};

window.onload = function onload() {
  retrieveProducts('computador');
};
