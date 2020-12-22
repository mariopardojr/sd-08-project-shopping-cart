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

function createProductItemElement({ sku, name, image, price }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('span', 'item__price', price));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

function localStorageSave() {
  localStorage.setItem('cartlist',
    document.querySelector('.cart__items').innerHTML);
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const fecthProduct = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => {
      response.json().then((data) => {
        data.results.map((value) => {
          const addProduct = createProductItemElement({
            sku: value.id,
            name: value.title,
            image: value.thumbnail,
            price: value.price,
          });
          return document.querySelector('.items').appendChild(addProduct);
        });
      });
    });
};

const addValue = () => {
  const valueCart = document.querySelectorAll('.cart__item');
  let valuePrice = 0;
  valueCart.forEach((item) => {
    const value = parseFloat(item.innerHTML.split('$')[1]);
    valuePrice = value + valuePrice;
    return Math.round(valuePrice.toFixed(2));
  });
  const totalPrice = document.querySelector('.total-price');
  totalPrice.innerHTML = valuePrice;
};

function cartItemClickListener(event) {
  addValue();
  const element = event.target;
  element.parentElement.removeChild(element);
  localStorageSave();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const localStorageGet = () => {
  const cartList = document.querySelector('.cart__items');
  cartList.innerHTML = localStorage.getItem('cartlist');
  cartList.addEventListener('click', (event) => {
    const element = event.target;
    element.parentElement.removeChild(element);
    addValue();
    localStorageSave();
  });
};

const fecthProductId = (productId) => {
  fetch(`https://api.mercadolibre.com/items/${productId}`)
    .then((response) => {
      response.json().then((data) => {
        const addProduct = {
          sku: data.id,
          name: data.title,
          salePrice: data.price,
        };
        const addCart = createCartItemElement(addProduct);
        const selCart = document.querySelector('.cart__items');
        selCart.appendChild(addCart);
        addValue();
        localStorageSave();
      });
    });
};

const addToCart = () => {
  document.querySelector('.items').addEventListener('click', (event) => {
    if (event.target.classList.contains('item__add')) {
      const parentButtom = event.target.parentElement;
      const getId = getSkuFromProductItem(parentButtom);
      fecthProductId(getId);
    }
  });
};

const clearCart = () => {
  const clear = document.getElementsByClassName('empty-cart')[0];
  clear.addEventListener('click', (event) => {
    if (event.target.classList.contains('empty-cart')) {
      const ol = document.querySelectorAll('.cart__items')[0];
      ol.innerHTML = '';
      const totalPrice = document.querySelector('.total-price');
      totalPrice.innerHTML = 0;
      localStorage.clear();
    }
  });
};

window.onload = function onload() {
  fecthProduct();
  localStorageGet();
  addToCart();
  clearCart();
  addValue();
};
