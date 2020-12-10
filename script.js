window.onload = function onload() {
  fetchDataFromMLB();
};

async function fetchDataFromMLB() {
  const containerItems = document.querySelector('.items');
  const data = fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador').then(result =>
    result.json().then(data =>
      data.results.forEach(product => {
        const productHTML = createProductItemElement(product);
        const buttonAdicionar = productHTML.childNodes[3];
        buttonAdicionar.addEventListener('click', e => addToCart(e.path[1]));
        containerItems.appendChild(productHTML);
      })
    )
  );
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

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__id', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__id').innerText;
}

async function fetchItemData(itemId) {
  return fetch(`https://api.mercadolibre.com/items/${itemId}`);
}

async function addToCart(event) {
  const olContainer = document.querySelector('.cart__items');
  const itemId = getSkuFromProductItem(event);
  const itemData = await fetchItemData(itemId).then(itemdata =>
    itemdata.json().then(result => {
      const itemCart = createCartItemElement(result);
      olContainer.appendChild(itemCart);
    })
  );
}

async function cartItemClickListener(event) {
  const olContainer = event.path[1];
  const cartItem = event.path[0];
  olContainer.removeChild(cartItem);
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `Id: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', e => cartItemClickListener(e));
  return li;
}
