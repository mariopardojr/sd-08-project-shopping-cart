function saveAtLocalStorage() {
  localStorage.setItem('saveCart', document.querySelector('.cart__items').innerHTML);
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

async function totalPrice() {
  let totalCartPrice = 0;
  const cartItems = document.querySelectorAll('.cart__item');

  await cartItems.forEach((item) => {
    const findPrice = parseFloat(item.innerText.split('$')[1]);
    totalCartPrice += findPrice;
    return Math.round(totalCartPrice.toFixed(2));
  });
  // Dei uma olhada no PR do Beto (https://github.com/tryber/sd-08-project-shopping-cart/blob/26d633b07336901530f9a7c78634e692112463af/script.js) para ver se conseguia uma dica de como arredondar esse valor porque já cansei de refatorar e tentar métodos diferentes de arredondamento. Eu já tinha refatorado para unificar a contagem de valores em um lugar só (antes estava uma bagunça...), mas estava tentando arredondar os valores a serem somados e não o total (essa foi a dica que peguei no PR). Realmente faz muito mais sentido assim, o jeito que eu estava tentando gerava acúmulo de erros. Finalmente funcionou! \o/

  const actualPrice = document.querySelector('.total-price');
  actualPrice.innerText = totalCartPrice;
}

function cartItemClickListener() {
  const cartItems = document.querySelector('.cart__items');
  cartItems.addEventListener('click', (event) => {
    event.target.remove();
    totalPrice();
  });
}

function localStorageSavedInfo() {
  const savedData = document.querySelector('.cart__items');
  savedData.innerHTML = localStorage.getItem('saveCart');
  savedData.addEventListener('click', (event) => {
    if (event.target.className === 'cart__item') {
      cartItemClickListener(event);
    }
  });
  totalPrice();
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
              totalPrice();
              saveAtLocalStorage();
            }));
        });
    }
  });
}
// Dei uma olhada no requisito 2 do vídeo de passo a passo que fizeram https://trybecourse.slack.com/archives/C01A9A2N93R/p1608237982190300 , porque não estava conseguindo acertar o addEventListener quando tentava adicionar um para cada item, peguei a dica de adicionar um só para todo o container e depois isolar os botões.

function emptyCart() {
  const cart = document.querySelector('.empty-cart');
  cart.addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
    totalPrice();
  });
}

window.onload = function onload() {
  localStorageSavedInfo();
  fetchData();
  addToCart();
  emptyCart();
};
