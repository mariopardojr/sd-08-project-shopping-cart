function totalPrice() {
  let finalPrice = 0;
  const cartItems = document.querySelectorAll('.cart__item');
  cartItems.forEach((data) => {
    finalPrice += parseFloat(data.innerHTML.split('$')[1]);
  });
  const cartLocal = document.querySelector('.cart');
  if (cartLocal.lastChild.className === 'total-price') {
    cartLocal.lastChild.innerText = finalPrice;
  } else {
    const span = document.createElement('span');
    span.className = 'total-price';
    span.innerText = finalPrice;
    cartLocal.appendChild(span);
  }
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

function cartItemClickListener(event) {
  // const removeItem = document.getElementsByTagName('ol')[0];
  // removeItem.addEventListener('click', () => {
  //   document.querySelector('.cart__items').removeChild(event.target);
  // });
  event.target.remove();
  totalPrice();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  localStorage.setItem(`${sku}`, li.innerText);
  return li;
}

function getItemsFromLocalStorage() {
  if (localStorage.length !== 0) {
    const values = Object.values(localStorage);
    const localCart = document.querySelector('.cart__items');
    values.forEach((data) => {
      const localItem = document.createElement('li');
      localItem.className = 'cart__item';
      localItem.innerText = data;
      localItem.addEventListener('click', cartItemClickListener);
      localCart.appendChild(localItem);
      totalPrice();
    });
  }
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const btn = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  btn.addEventListener('click', () => {
    fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then(data => data.json())
    .then((data) => {
      const itemObj = {
        sku: data.id,
        name: data.title,
        salePrice: data.price,
      };
      const cart = document.querySelector('.cart__items');
      cart.appendChild(createCartItemElement(itemObj));
      totalPrice();
    });
  });
  section.appendChild(btn);
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function getApi() {
  return fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
  .then(data => data.json())
  .then((data) => {
    document.querySelector('.loading').remove();
    const arrayResults = data.results;
    const listItems = document.querySelector('.items');
    arrayResults.forEach((element) => {
      const product = createProductItemElement({
        sku: element.id,
        name: element.title,
        image: element.thumbnail,
      });
      listItems.appendChild(product);
    });
    console.log(arrayResults);
    return arrayResults;
  });
}

function removeAllItems() {
  const btnRemove = document.getElementsByClassName('empty-cart')[0];
  btnRemove.addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
    totalPrice();
  });
}

window.onload = function onload() {
  getApi();
  removeAllItems();
  getItemsFromLocalStorage();
};
