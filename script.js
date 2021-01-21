function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}
function valorTotalCarrinho() {
  const itensCarrinho = document.querySelectorAll('.cart__item');
  const display = document.querySelector('.total-price');
  let totalPrice = 0;
  itensCarrinho.forEach((item) => {
    totalPrice += parseFloat(item.innerHTML.split('$')[1]);
  });
  display.innerHTML = `${totalPrice}`;
}
function localStorage() {
  const cartItens = document.querySelector('ol').innerHTML;
  localStorage.setItem('cartItens', cartItens);
}
function cartItemClickListener(event) {
  event.target.remove();
  localStorage();
  valorTotalCarrinho();
}
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
function fetchItem(event) {
  const itemId = event.path[1].firstChild.innerText;
  fetch(`https://api.mercadolibre.com/items/${itemId}`)
    .then(response => response.json())
    .then((dado) => {
      const cartItem = {
        sku: dado.id,
        name: dado.title,
        salePrice: dado.price,
      };
      document.querySelector('ol').appendChild(createCartItemElement(cartItem));
      localStorage();
      valorTotalCarrinho();
    });
}
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (element === 'button') {
    e.addEventListener('click', fetchItem);
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

function fetchBodyItems() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then((dado) => {
      document.querySelector('.loading').remove();
      dado.results.forEach((element) => {
        const newData = {
          sku: element.id,
          name: element.title,
          image: element.thumbnail,
        };
        document.querySelector('.items').appendChild(createProductItemElement(newData));
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
  valorTotalCarrinho();
}
function limparCarrinho() {
  const botao= document.querySelector('.empty-cart');
  botao.addEventListener('click', (event) => {
    if (event.target.classList.contains('empty-cart')) {
      document.querySelector('ol').innerHTML = '';
      localStorage();
      valorTotalCarrinho();
    }
  });
}

window.onload = function onload() {
  localStorageCheck();
  limparCarrinho();
  fetchBodyItems();
}

