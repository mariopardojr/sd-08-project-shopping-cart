const loading = () => {
  const load = document.createElement('h1');
  load.classList.add('loading').innerText = 'loading...';
  document.querySelector('.cart').appendChild(load);
};

const loadingDone = () => {
  const cart = document.querySelector('.cart');
  const load = document.querySelector('.loading');
  cart.removeChild(load);
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

function createProductItemElement({
  sku,
  name,
  image,
}) {
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

async function cartItemClickListener(event) {
  console.log('click')
  // return event;
}

function itemsFetch() {
  return fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => {
      response.json()
        .then((data) => {
          data.results.forEach((element) => {
            const item = {
              sku: element.id,
              name: element.title,
              image: element.thumbnail,
            };
            document.querySelector('.items').appendChild(createProductItemElement(item));
          });
        });
    });
}

window.onload = async function onload() {
  // loading();
  await itemsFetch();
  addCartItem();
  // loadingDone();
};

function createCartItemElement({
  sku,
  name,
  salePrice,
}) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  return li;
}

function addCartItem() {
  document.querySelector('.items').addEventListener('click', (e) => {
    if (e.target.classList.contains('item__add')) {
      const parent = e.target.parentElement;
      const sku = getSkuFromProductItem(parent);
      fetch(`https://api.mercadolibre.com/items/${sku}`)
        .then(response => response.json())
        .then((data) => {
          const object = {
            sku,
            name: data.title,
            salePrice: data.price,
          };
          let cartItem = document.querySelector('.cart__items');
          cartItem.appendChild(createCartItemElement(object));
        })
    }
  })
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
