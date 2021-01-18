let totalPrice = 0;

function sum(value) {
  totalPrice += value;
  addValue();
}

function sub(value) {
  totalPrice -= value;
  if (totalPrice < 0) totalPrice = 0;
  addValue();
}

function saveItemsLocalStorgae() {
  const cartItemsValue = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('computer', cartItemsValue);
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
  event.target.remove();
  sub(parseFloat(event.target.innerText.split('$')[1]));
  saveItemsLocalStorgae();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function consumeAPI(computador) {
  const section = document.querySelector('.items');
  await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${computador}`)
    .then(result => result.json())
    .then((objectJSON) => {
      objectJSON.results.forEach((element) => {
        const sku = element.id;
        const name = element.title;
        const image = element.thumbnail;
        const data = { sku, name, image };
        section.appendChild(createProductItemElement(data));
      });
    });
}

function selectAllItems() {
  const elementList = document.querySelectorAll('.item');
  return elementList;
}

async function selectItem() {
  const elementList = await selectAllItems();
  const cartItems = document.querySelector('.cart__items');
  elementList.forEach((element) => {
    const elementButton = element.querySelector('.item__add');
    elementButton.addEventListener('click', async (event) => {
      const elementID = event.target
        .parentElement
        .querySelector('.item__sku')
        .innerText;
      await fetch(`https://api.mercadolibre.com/items/${elementID}`)
        .then(result => result.json())
        .then((computer) => {
          const info = {
            sku: computer.id,
            name: computer.title,
            salePrice: computer.price,
          };
          cartItems.appendChild(createCartItemElement(info));
          saveItemsLocalStorgae();
          sum(info.salePrice);
        });
    });
  });
}

function getItemsLocalStorage() {
  const items = localStorage.getItem('computer');
  const cart = document.querySelector('.cart__items');
  cart.innerHTML = items;
  const cartItems = document.querySelectorAll('.cart__item');
  console.log(cartItems);
  cartItems.forEach((element) => {
    element.addEventListener('click', cartItemClickListener);
  });
}

function addValue() {
  const totalPriceElement = document.querySelector('.total-price');
  totalPriceElement.innerHTML = totalPrice;
}

window.onload = async function onload() {
  getItemsLocalStorage();
  await consumeAPI('computador');
  selectItem();
};
