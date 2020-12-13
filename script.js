
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

const BtneventRemover = (par) => {
  par.target.remove();
};

function cartItemClickListener(event) {
    const itemsCart = document.querySelectorAll('.cart__items');
    itemsCart.addEventListener('click', BtneventRemover(event));
}

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

window.onload = function onload() {
  getProducts();
  addEvent();
  cartItemClickListener();
};
