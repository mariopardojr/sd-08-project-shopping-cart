function saveLocalStorage() {
  const cart = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cart', cart);
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
  const parentElement = event.target.parentElement;
  parentElement.removeChild(event.target)
  saveLocalStorage()
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  //li.addEventListener('click', cartItemClickListener);
  return li;
}

function createItemsList() {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const items = document.querySelector('.items');
  fetch(url)
    .then(response => response.json())
    .then((data) => {
      document.querySelector('.loading').remove() // retira o loading da tela depois que carrega os items da API
      data.results.forEach((item) => {
        const obj = {
          sku: item.id,
          name: item.title,
          image: item.thumbnail,
        };
        items.appendChild(createProductItemElement(obj));
      })} 
    );
}

function addItemCart() {
  const items = document.querySelector('.items');
  items.addEventListener('click', (event) => {
    if (event.target.classList.contains('item__add')) {
      const parentElement = event.target.parentNode;  // vou até o elemento pai
      const itemID = getSkuFromProductItem(parentElement);
      fetch(`https://api.mercadolibre.com/items/${itemID}`)
        .then(response => response.json())
        .then((data) => {
          const item = {
            sku: data.id,
            name: data.title,
            salePrice: data.price,
          };
          const cartItems = document.querySelector('.cart__items');
          cartItems.appendChild(createCartItemElement(item));
          saveLocalStorage();
        });
    }
  });
}

function loadCart() {
  const cartList = document.querySelector('.cart__items');
  cartList.innerHTML = localStorage.getItem('cart'); // pego os items do localStorage e coloco no carrinho de compras
  cartList.addEventListener('click', ((event) => {
    if (event.target.classList.contains('cart__item')) {
      cartItemClickListener(event);
    }
  }));
}

function clearCart() {
  const emptyCart = document.querySelector('.empty-cart');
  emptyCart.addEventListener('click', () => {
    const items = document.querySelector('.cart__items');
    items.innerHTML = '';
  })
}
function createLoading() {
  const container = document.querySelector('.container');
  const items = document.querySelector('.items');
  const createH2 = document.createElement('h2');
  createH2.innerHTML = 'Loading...'
  createH2.classList.add('loading');
  container.insertBefore(createH2, items);
}

window.onload = function onload() {
  createItemsList();
  addItemCart();
  loadCart();
  clearCart();
  createLoading();
};
