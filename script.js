function saveLocalStorage() {
  localStorage.setItem('cartlist', document.querySelector('.cart__items').innerHTML);
}

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
  const element = event.target;
  element.parentNode.removeChild(element);
  saveLocalStorage();
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
    saveLocalStorage();
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


// const loadedCart = localStorage.getItem('cart');
//   if (loadedCart !== null) {
//     shoppingCart.appendChild(loadedCart)
//   }

window.onload = function onload() {
  retrieveProducts('computador');
  const local = localStorage.getItem('cartlist');
  if (local !== null) {
    document.querySelector('.cart__items').innerHTML = local;
  }
  document.querySelectorAll('li')
  .forEach(element => element.addEventListener('click', cartItemClickListener));
};
