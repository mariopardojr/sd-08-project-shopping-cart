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

function cartItemClickListener(event) {
  const itemToRemove = event.target;
  const parent = itemToRemove.parentNode;

  parent.removeChild(itemToRemove);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addItemToCart(event) {
  const target = event.target;
  const targetParentId = target.parentNode.querySelector('.item__sku').innerText;
  const request = await fetch(`https://api.mercadolibre.com/items/${targetParentId}`);
  const itemToCart = await request.json();

  const { id: sku, title: name, price: salePrice } = itemToCart;
  const itemToCartElement = createCartItemElement({ sku, name, salePrice });

  const cartList = document.querySelector('.cart__items');
  cartList.appendChild(itemToCartElement);
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));

  const newButton = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  newButton.addEventListener('click', addItemToCart);
  section.appendChild(newButton);

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

async function createProductList(query = 'computador') {
  const itemsSection = document.querySelector('.items');
  const request = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`);
  const requestObject = await request.json();
  const requestList = requestObject.results;

  requestList.forEach((product) => {
    const { id: sku, title: name, thumbnail: image } = product;
    const productElement = createProductItemElement({ sku, name, image });
    itemsSection.appendChild(productElement);
  });
}

window.onload = async function onload() {
  const productList = await createProductList();

  console.log(productList);
};
