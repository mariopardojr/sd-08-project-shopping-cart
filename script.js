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
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function saveCartItems() {
  const shopCart = document.querySelector('.cart__items');
  localStorage.setItem('shopCart', shopCart.innerHTML);
}

async function totalPricesSum() {
  const allPrices = [];
  document.querySelectorAll('.cart__item').forEach((element) => {
    allPrices.push(Number(element.innerHTML.split('$')[1]));
  });
  totalPrices = allPrices.reduce((acc, price) => acc + price, 0).toFixed(2);
  document.querySelector(
    '.total-price',
  ).innerHTML = `Soma dos preços: $${totalPrices}`;
}

function frescurites() {
  const cartOl = document.querySelector('.cart__items');
  const priceTxt = document.querySelector('.total-price');
  if (cartOl.innerHTML) {
    priceTxt.style.color = 'blue';
  } else {
    priceTxt.style.color = 'red';
  }
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  console.log(event.target.parentElement.firstElementChild);
  event.target.parentElement.removeChild(event.target);
  saveCartItems();
  totalPricesSum();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// 4. Carregue o carrinho de compras através do **LocalStorage** ao iniciar a página
function loadCartItem() {
  const shopCartItems = document.querySelector('.cart__items');
  shopCartItems.innerHTML = localStorage.getItem('shopCart');
}

// 6. Botão para limpar carrinho de compras
function emptyCart() {
  document.querySelector('.empty-cart').addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
    saveCartItems();
    totalPricesSum();
    frescurites();
  });
}

// 1. Listagem de produtos
function theItemsList() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((jsonObj) => jsonObj.results)
    .then((array) =>
      array.forEach((item) => {
        const eachItem = {
          sku: item.id,
          name: item.title,
          image: item.thumbnail,
        };
        document
          .querySelector('.items')
          .appendChild(createProductItemElement(eachItem));
      }),
    );
}

// 2. Adicione o produto ao carrinho de compras
function addItemToCart() {
  const itemsList = document.querySelector('.items');
  itemsList.addEventListener('click', (event) => {
    if (event.target.className === 'item__add') {
      const parentEl = event.target.parentElement;
      const theSkuTxt = getSkuFromProductItem(parentEl);
      fetch(`https://api.mercadolibre.com/items/${theSkuTxt}`)
        .then((response) => response.json())
        .then((responsedJson) => {
          const cartItems = {
            sku: responsedJson.id,
            name: responsedJson.title,
            salePrice: responsedJson.price,
          };
          document
            .querySelector('.cart__items')
            .appendChild(createCartItemElement(cartItems));
          saveCartItems();
          totalPricesSum();
          frescurites();
        });
    }
  });
}

// function highLightButtons() {
//   const theList = document.querySelector('.items');
//   theList.addEventListener('mouseover', (hover) => {
//     if (hover.target.className === 'item__add') {
//       hover.target.style.opacity = '0.5';
//     } else {
//       hover.target.style.opacity = '1';
//     }
//   });
//   theList.addEventListener('mouseout', (hovered) => {
//     if (hovered.target.className === 'item__add') {
//       hovered.target.style.opacity = '1';
//     }
//   });
// }

window.onload = function onload() {
  addItemToCart();
  emptyCart();
  loadCartItem();
  theItemsList();
  totalPricesSum();
  frescurites();
};
