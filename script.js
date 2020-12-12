window.onload = function onload() { };

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

const saveCart = () => {
  localStorage.setItem('cartList', document.getElementById('cart__items').innerHTML);
  localStorage.setItem('totalPrice', document.getElementById('price').innerHTML);
};

const sumPrice = (price) => {
  document.getElementById('price').innerText = (price + parseFloat(document.getElementById('price').innerText)).toFixed(2);
};

const minusPrice = (price) => {
  document.getElementById('price').innerText = (parseFloat(document.getElementById('price').innerText - price)).toFixed(2);
};

function cartItemClickListener(event) {
  minusPrice(event.target.innerText.split('$')[1]);
  event.target.parentNode.removeChild(event.target);
  saveCart();
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
  const addToCartButton = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  addToCartButton.addEventListener('click', () => {
    fetch(`https://api.mercadolibre.com/items/${event.target.parentNode.firstChild.innerText}`)
    .then(result => result.json())
    .then((data) => {
      const product = {
        sku: data.id,
        name: data.title,
        salePrice: data.price,
      };
      const cartItem = createCartItemElement(product);
      document.getElementById('cart__items').appendChild(cartItem);
      sumPrice(data.price);
      saveCart();
    });
  });
  section.appendChild(addToCartButton);
  return section;
}

function createProductItemList(QUERY) {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${QUERY}`)
    .then(result => result.json())
    .then(data =>
      data.results.forEach((item) => {
        const features = {
          sku: item.id,
          name: item.title,
          image: item.thumbnail,
        };
        document.getElementById('items').innerHTML = document.getElementById('items').innerHTML.replace('loading...', '');
        console.log(document.getElementById('items').innerText.split('...'));
        document
          .getElementById('items')
          .appendChild(createProductItemElement(features));
      }),
    );
}
createProductItemList('computador');

window.onload = () => {
  document.getElementById('empty-cart').addEventListener('click', () => {
    document.getElementById('cart__items').innerHTML = '';
    document.getElementById('price').innerHTML = 0;
    saveCart();
  });
  document.getElementById('cart__items').innerHTML = localStorage.cartList;
  const cartSaved = document.getElementsByClassName('cart__item');
  for (let index = 0; index < cartSaved.length; index += 1) {
    cartSaved[index].addEventListener('click', cartItemClickListener);
  }
  if (localStorage.totalPrice === undefined) {
    localStorage.totalPrice = 0;
  } else {
    document.getElementById('price').innerHTML = localStorage.totalPrice;
  }
};
