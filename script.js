
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function addToStorage() {
  const cartItens = document.querySelector('ol').innerHTML;
  localStorage.setItem('cartItens', cartItens);
}

function cartItemClickListener(event) {
  event.target.remove();
  addToStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function apiItem(event) {
  const itemId = event.path[1].firstChild.innerText;
  fetch(`https://api.mercadolibre.com/items/${itemId}`)
    .then(response => response.json())
    .then((data) => {
      const cartItem = {
        sku: data.id,
        name: data.title,
        salePrice: data.price,
      };
      document.querySelector('ol').appendChild(createCartItemElement(cartItem));
      addToStorage();
    });
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (element === 'button') {
    e.addEventListener('click', apiItem);
  }
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

async function apiMercado() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then((data) => {
      data.results.forEach((element) => {
        const newData = {
          sku: element.id,
          name: element.title,
          image: element.thumbnail,
        };
        return document.querySelector('.items').appendChild(createProductItemElement(newData));
      });
    });
}

function localStorageCheck() {
  document.querySelector('ol').innerHTML = localStorage.getItem('cartItens');
  const list = document.querySelector('ol');
  list.addEventListener('click', (event) => {
    if (event.target.classList.contains('cart__item')) {
      cartItemClickListener(event);
    }
  });
}

function cartClear() {
  const btn = document.querySelector('.empty-cart');
  btn.addEventListener('click', (event) => {
    if (event.target.classList.contains('empty-cart')) {
      document.querySelector('ol').innerHTML = '';
      addToStorage();
    }
  });
}
// função para somar o valor dos itens no cart. Ainda em duvida como resolver assincronicidade.
// function totalPrice(price) {
//   const display = document.querySelector('h3');
//   const total = total + price;
//   display.innerHTML = `Preço total: $ ${total}`;
//   console.log(display)
// }
window.onload = function onload() {
  //   criação Loading
  //   const msg = document.createElement('h1');
  //   msg.className = 'items';
  //   msg.innerHTML = 'Loading!';
  //   document.querySelector('.items').appendChild(msg);
  localStorageCheck();
  cartClear();
  apiMercado();
  // totalPrice();
};
