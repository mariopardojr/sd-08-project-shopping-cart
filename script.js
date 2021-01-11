function saveItemsLocalStorage() {
  const cart = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cart', cart);
}

function cartTotalPrice() {
  const cartListItem = document.querySelectorAll('.cart__item');
  let totalPrice = 0;
  cartListItem.forEach((items) => {
    return totalPrice += parseFloat(items.innerHTML.split('$')[1]);
  });
  document.querySelector('.total-price').innerHTML = totalPrice.toFixed(2);
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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
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

function cartItemClickListener(event) {
  event.target.parentNode.removeChild(event.target);
  saveItemsLocalStorage();
  cartTotalPrice();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // li.addEventListener('click', cartItemClickListener);
  return li;
}

async function fetchAndRenderProduct() {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const { results } = await response.json();
  results.forEach((product) => {
    const producItem = createProductItemElement(product);
    document.querySelector('.items').appendChild(producItem);
  });
}

function addItemCart() {
  document.querySelector('.items').addEventListener('click', (event) => {
    if (event.target.classList.contains('item__add')) {
      // const parent = event.target.parentNode
      const parent = event.target.parentElement;
      const sku = getSkuFromProductItem(parent);
      fetch(`https://api.mercadolibre.com/items/${sku}`)
        .then(response => response.json())
        .then((data) => {
          const { id, title, price } = data;
          const obj = {
            sku: id,
            name: title,
            salePrice: price,
          };
          document
            .querySelector('.cart__items')
            .appendChild(createCartItemElement(obj));
          saveItemsLocalStorage();
          cartTotalPrice();
        });
    }
  });
}

function restorageItems() {
  const loadedCartItem = localStorage.getItem('cart');
  const cartList = document.querySelector('.cart__items');
  cartList.innerHTML = loadedCartItem;
  cartList.addEventListener('click', (event) => {
    if (event.target.classList.contains('cart__item')) {
      cartItemClickListener(event);
    }
  });
}

window.onload = function onload() {
  restorageItems();
  fetchAndRenderProduct();
  addItemCart();
  cartTotalPrice();
};
