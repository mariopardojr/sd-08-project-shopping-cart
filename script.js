window.onload = function onload() {
  fetchAndLoadProducts()
};

async function fetchAndLoadProducts() {
  try {
    const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
    const { results } = await response.json();
    results.forEach(product => {
      const loadProduct = createProductItemElement(product);
      document.querySelector('.items').appendChild(loadProduct);
    });
  } catch (error) {
    console.log('Deu erro no load', error);
  }
};

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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const createNewButton = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  section.appendChild(createNewButton);
  createNewButton.addEventListener('click', () => onClick(sku));
  return section;
}

async function onClick(sku) {
  try {
    const response = await fetch(`https://api.mercadolibre.com/items/${sku}`);
    const results = await response.json();
    const addItemToCart = createCartItemElement(results);
    document.querySelector('.cart__items').appendChild(addItemToCart);
    addItemToCart.addEventListener('click', cartItemClickListener);
    totalPrice();
  } catch (error) {
    console.log('Deu erro no item', error);
  }
};

async function totalPrice() {
  let sumPrices = 0;
  const cartItems = document.querySelector('.cart__items');
  cartItems.childNodes.forEach(child => {
    const price = child.innerText.split('$')[1];
    sumPrices += Number(price);
  })
  document.querySelector('.total-price').innerHTML = `Preço total: R$ ${sumPrices}`;
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const targetItem = event.target;
  targetItem.parentNode.removeChild(targetItem);
  totalPrice();
}

function removeAllCartItems() {
  const removeButton = document.querySelector('.empty-cart');
  removeButton.addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
    totalPrice();
  })
}
removeAllCartItems()
function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
