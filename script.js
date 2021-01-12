// function savedStorage() {
//   const cartItems = document.querySelector('.cart__items').innerHTML;
//   localStorage.setItem('cart', cartItems);
// }

// function finalPrice() {
//   const cartList = document.querySelectorAll('.cart__item');
//   let finalAmount = 0;
//   cartList.forEach((valor) => {
//     finalAmount += parseFloat(valor.innerHTML.split('$')[1]);
//   });
//   finalAmount = document.querySelector('.total-price').innerHTML;
// }

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
  // savedStorage();
  // finalPrice();
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
      // savedStorage();
      // finalPrice();
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
  });
  // savedStorage();
  // finalPrice();
}

window.onload = function onload() {
  getApi();
  removeAllItems();
  getItemsFromLocalStorage();
};
