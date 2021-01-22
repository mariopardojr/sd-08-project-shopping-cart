async function fetchApi(url) {
  const result = await fetch(url)
    .then(response => response.json());
  document.querySelector('.loading').remove();
  return result;
}

function updateStorage() {
  const cartList = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cartItems', cartList);
}

function updatePrice() {
  const cartList = document.querySelector('.cart__items');
  let price = 0;
  for (let index = 0; index < cartList.childNodes.length; index += 1) {
    price += Number(cartList.childNodes[index].innerHTML.split('$')[1]);
  }
  document.getElementsByClassName('total-price')[0].innerHTML = price;
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
  event.target.remove();
  updateStorage();
  updatePrice();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const addCartItem = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  addCartItem.addEventListener('click', () => {
    const cartList = document.querySelector('.cart__items');
    const url = `https://api.mercadolibre.com/items/${sku}`;
    fetchApi(url)
      .then((data) => {
        cartList.appendChild(createCartItemElement({
          sku: data.id,
          name: data.title,
          salePrice: data.price,
        }));
      },
      ).then(() => {
        updatePrice();
        // localStorage.setItem('cartItems', cartList.innerHTML);
        updateStorage();
      });
  });
  section.appendChild(addCartItem);
  return section;
}


function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const fetchItens = () => {
  const list = document.querySelector('.items');
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetchApi(url).then((data) => {
    data.results.map((items) => {
      const product = {
        sku: items.id,
        name: items.title,
        image: items.thumbnail,
      };
      return list.appendChild(createProductItemElement(product));
    });
  });
};

window.onload = function onload() {
  fetchItens();
  const emptyCart = document.querySelector('.empty-cart');
  emptyCart.addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
    localStorage.clear();
    updatePrice();
  });
  console.log(localStorage.getItem('cartItems'));
  const cartList = document.querySelector('.cart__items');
  cartList.innerHTML = localStorage.getItem('cartItems');
  for (let index = 0; index < cartList.childNodes.length; index += 1) {
    cartList.childNodes[index].addEventListener('click', cartItemClickListener);
  }
  console.log(document.querySelector('.cart__items'));
  updatePrice();
};
