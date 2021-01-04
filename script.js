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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

const cartSum = () => {
  const ol = document.querySelectorAll('.cart__items li');
  let total = 0;
  ol.forEach((item) => {
    total += parseFloat(item.innerHTML.split('$')[1]);
  });
  const p = document.querySelector('.total-price');
  p.innerHTML = Math.round(total * 100) / 100;
};

const saveCart = () => {
  const ol = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cart', ol);
};

function cartItemClickListener(event) {
  const parent = event.target.parentElement;
  parent.removeChild(event.target);
  cartSum();
  saveCart();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const loadCart = (callback) => {
  const olStorage = localStorage.getItem('cart');
  const ol = document.querySelector('.cart__items');
  ol.innerHTML = olStorage;
  ol.addEventListener('click', (event) => {
    callback(event);
  });
  cartSum();
};

const fecthML = (item) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${item}`)
    .then((response) => {
      response.json()
        .then((data) => {
          data.results.forEach((results) => {
            const object = {
              sku: results.id,
              name: results.title,
              image: results.thumbnail,
            };
            const sectionItems = document.querySelector('.items');
            sectionItems.appendChild(createProductItemElement(object));
          });
        });
    });
};

const addShoppingCart = () => {
  const buttonAdd = document.querySelector('.items');
  buttonAdd.addEventListener('click', (event) => {
    if (event.target.className === 'item__add') {
      const parent = event.target.parentElement;
      const id = parent.firstChild.innerText;
      fetch(`https://api.mercadolibre.com/items/${id}`)
        .then((response) => {
          response.json()
            .then((data) => {
              const object = {
                sku: data.id,
                name: data.title,
                salePrice: data.price,
              };
              const ol = document.querySelector('.cart__items');
              ol.appendChild(createCartItemElement(object));
              cartSum();
              saveCart();
            });
        });
    }
  });
};

const removeButton = (callback) => {
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', () => {
    olLI = document.querySelectorAll('.cart__items li');
    ol = document.querySelector('.cart__items');
    olLI.forEach((item) => {
      ol.removeChild(item);
      callback();
    });
  });
};

window.onload = function onload() {
  fecthML('computador');
  addShoppingCart();
  loadCart(cartItemClickListener);
  removeButton(cartSum);
};
