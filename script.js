
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

const sum = async () => {
  const cartItens = document.querySelectorAll('.cart__item');
  const totalPrice = document.querySelector('.total-price');
  let total = 0;
  cartItens.forEach((e) => {
    total += parseFloat((e.innerHTML.split('$')[1]));
  });
  totalPrice.innerHTML = total;
};

const storage = () => {
  const Itens = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('item', Itens);
};

async function cartItemClickListener(event) {
  await event.target.remove();
  sum();
  storage();
}

const getItemStored = () => {
  const Itens = document.querySelector('.cart__items');
  const item = localStorage.getItem('item');
  Itens.innerHTML = item;
  const ItensCart = document.querySelectorAll('.cart__items');
  ItensCart.forEach(i => i.addEventListener('click', cartItemClickListener));
  sum();
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const getProducts = async () => {
  try {
    const result = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
    const data = await result.json();
    let products = data.results;
    products = products.map((item) => {
      const { title: name, thumbnail: image, id: sku } = item;
      const things = document.querySelector('.items');
      const add = createProductItemElement({ sku, name, image });
      things.appendChild(add);
      return products;
    });
  } catch (error) {
    console.log(error);
  }
};

const addProducts = async (ID) => {
  await fetch(`https://api.mercadolibre.com/items/${ID}`)
  .then(response => response.json())
  .then((data) => {
    const newData = createCartItemElement({
      sku: data.id,
      name: data.title,
      salePrice: data.price,
    });
    const cartItem = document.querySelector('.cart__items');
    cartItem.appendChild(newData);
    storage();
    sum();
  });
};

const Btnevent = (event) => {
  const addSku = getSkuFromProductItem(event.target.parentNode);
  addProducts(addSku);
};

const addEvent = () => {
  const items = document.querySelectorAll('.items');
  items.forEach(element => element.addEventListener('click', Btnevent));
};

const eraser = () => {
  const btn = document.querySelector('.empty-cart');
  btn.addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = ' ';
    sum();
  });
};

window.onload = function onload() {
  getProducts();
  addEvent();
  cartItemClickListener();
  eraser();
  getItemStored();
};
