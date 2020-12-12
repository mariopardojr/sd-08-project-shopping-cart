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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const array = localStorage.getItem('cartItems').split(',');
  const newArray = array.filter(e => e !== event.target.id);
  localStorage.setItem('cartItems', newArray);
  const listItens = document.querySelector('.cart__items');
  listItens.removeChild(event.target);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.id = sku;
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  let existing = localStorage.getItem('cartItems');
  existing = existing ? existing.split(',') : [];
  existing.push(li.innerText);
  localStorage.setItem('cartItems', existing.toString());
  return li;
}
function roundUp(num, decimal) {
  return parseFloat((num + (4 / ((10 ** (decimal + 1))))).toFixed(decimal));
}

function verifyPrice(resultado) {
  return new Promise((resolve) => {
    if (resultado.length === 1) {
      const cart = document.querySelector('.cart');
      const cartPrice = cart.querySelector('.total-price');
      let accumulator = 0;
      if (cartPrice.innerText.length !== 0) {
        accumulator = parseFloat(cartPrice.innerText);
        const number = accumulator + resultado[0].price;
        cartPrice.innerText = roundUp(number, 2);
      } else {
        cartPrice.innerText = resultado[0].price;
      }
      localStorage.setItem('cartPrice', cartPrice.innerText);
    }
    resolve();
  });
}

async function getItemsFromApi(url, parent, funcao) {
  return new Promise((resolve) => {
    fetch(url)
      .then((response) => {
        response.json().then((data) => {
          let resultado = [data];
          let variavel = 'salePrice';
          let value = 'price';
          if (parent === document.querySelector('.items')) {
            resultado = data.results;
            variavel = 'image';
            value = 'thumbnail';
          }
          resultado.forEach((element) => {
            parent.appendChild(funcao({
              sku: element.id,
              name: element.title,
              [variavel]: element[value],
            }));
          });
          verifyPrice(resultado);
          resolve();
        });
      });
  });
}

function stringTreatment(params) {
  const returnObj = {};
  for (let index = 0; index < 2; index += 1) {
    const key1 = ((params.split('|')[index]).split(':')[0].trim()).toLowerCase();
    const key2 = (params.split('|')[index]).split(':')[1].trim();
    const insertObj = { [key1]: key2 };
    Object.assign(returnObj, insertObj);
  }
  const preco = ((params.split('|')[2]).split(':')[1].trim()).replace('$', '');
  const insertObj = {
    salePrice: preco,
  };
  Object.assign(returnObj, insertObj);
  return returnObj;
}

async function getStorageItem(productStorage) {
  localStorage.removeItem('cartItems');
  const listItens = document.querySelector('.cart__items');
  for (let index = 0; index < productStorage.length; index += 1) {
    listItens.appendChild(createCartItemElement(stringTreatment(productStorage[index])));
  }
  const cart = document.querySelector('.cart');
  const cartPrice = cart.querySelector('.total-price');
  cartPrice.innerText = localStorage.getItem('cartPrice');
}

function clearButtonEvent() {
  const clearButton = document.querySelector('.empty-cart');
  clearButton.addEventListener('click', () => {
    const listItens = document.querySelector('.cart__items');
    listItens.innerHTML = '';
    localStorage.setItem('cartItems', '');
    const cart = document.querySelector('.cart');
    const cartPrice = cart.querySelector('.total-price');
    cartPrice.innerText = '';
    localStorage.removeItem('cartPrice');
  });
}

window.onload = async function onload() {
  const sectionItens = document.querySelector('.items');
  await getItemsFromApi('https://api.mercadolibre.com/sites/MLB/search?q=computador', sectionItens, createProductItemElement);
  const allButtons = document.querySelectorAll('.item__add');
  allButtons.forEach((element) => {
    element.addEventListener('click', () => {
      const elementId = getSkuFromProductItem(element.parentNode);
      const listItens = document.querySelector('.cart__items');
      getItemsFromApi(`https://api.mercadolibre.com/items/${elementId}`, listItens, createCartItemElement);
    });
  });
  const string = localStorage.getItem('cartItems');
  if (string !== null && string.length > 0) {
    getStorageItem(string.split(','));
  }
  clearButtonEvent();
};
