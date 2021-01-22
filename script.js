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

function fetchData() {
  const loading = document.querySelector('.loading');
  loading.innerText = 'loading...';
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => {
      response.json()
        .then((data) => {
          const results = data.results;
          results.map((item) => {
            product = {
              sku: item.id,
              name: item.title,
              image: item.thumbnail,
            };
            loading.remove();
            return document.querySelector('.items').appendChild(createProductItemElement(product));
          });
        });
    });
}

let totalCartPrice = 0;
const showPrice = document.createElement('h3');

async function totalPrice(price) {
  const actualPrice = document.querySelector('.total-price').appendChild(showPrice);
  const cartItems = document.querySelector('.cart__items').getElementsByClassName('cart__item');
  if (cartItems.length !== 0) {
    totalCartPrice += price;
  }
  actualPrice.innerHTML = `${totalCartPrice}`;
}

function cartItemClickListener() {
  const cartItems = document.querySelector('.cart__items');
  cartItems.addEventListener('click', (event) => {
    event.target.remove();
  });
  const findText = event.target.innerText.split('$');
  const findPrice = -(Math.floor(parseInt(findText[1], 10)));
  totalPrice(findPrice);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addToCart() {
  const items = document.querySelector('.items');
  items.addEventListener('click', async (event) => {
    if (event.target.className === 'item__add') {
      const itemSku = event.target.parentElement.querySelector('.item__sku').innerText;
      await fetch(`https://api.mercadolibre.com/items/${itemSku}`)
        .then((response) => {
          response.json()
            .then(((productData) => {
              itemData = {
                sku: productData.id,
                name: productData.title,
                salePrice: productData.price,
              };
              document.querySelector('.cart__items').appendChild(createCartItemElement(itemData));
              totalPrice(Math.floor(itemData.salePrice));
            }));
        });
    }
  });
}
// Dei uma olhada no requisito 2 do vídeo de passo a passo que fizeram https://trybecourse.slack.com/archives/C01A9A2N93R/p1608237982190300 , porque não estava conseguindo acertar o addEventListener quando tentava adicionar um para cada item, peguei a dica de adicionar um só para todo o container e depois isolar os botões.

function emptyCart() {
  const cart = document.querySelector('.empty-cart');
  cart.addEventListener('click', () => {
    document.querySelectorAll('.cart__item').forEach((element) => {
      element.remove();
      document.querySelector('.total-price').appendChild(showPrice).innerText = 0;
    });
  });
}

window.onload = function onload() {
  fetchData();
  addToCart();
  emptyCart();
};
