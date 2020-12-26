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

async function fetchMlbSearch(query) {
  return fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
    .then(resp => resp.json())
    .then(resp => resp.results.map(({ id, title, thumbnail, price }) => {
      const itemData = {
        sku: id,
        name: title,
        image: thumbnail,
        salePrice: price,
      };
      return itemData;
    }))
    .catch(() => { throw new Error('Erro ao fazer pesquisa por produtos'); });
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

async function updateStorage() {
  const objCartItems = Array.from(document.querySelectorAll('.cart__item'))
  .map((item) => {
    const text = item.innerHTML.split(' | ');
    const objItem = {
      sku: text[0].split('SKU: ')[1],
      name: text[1].split('NAME: ')[1],
      salePrice: text[2].split('PRICE: $')[1],
    };
    return objItem;
  });
  localStorage.cartItems = JSON.stringify(objCartItems);
  /* eslint-disable no-param-reassign */
  const sum = objCartItems.reduce((total, { salePrice }) => {
    total += parseFloat(salePrice);
    return total;
  }, 0);
  /* eslint-disable no-param-reassign */
  localStorage.totalPrice = `${(Math.round(100 * sum) / 100)}`;
}

function updateTotalPrice() {
  if (localStorage.totalPrice) {
    document.querySelector('.total-price').innerHTML = localStorage.totalPrice;
  }
}

function cartItemClickListener(event) {
  event.target.remove();
  updateStorage();
  updateTotalPrice();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function insertDataOnDocSelector(selector) {
  try {
    const importedData = await fetchMlbSearch('computador');
    importedData.forEach((item) => {
      const newItem = createProductItemElement(item);
      newItem.querySelector('button').addEventListener('click', () => {
        const li = createCartItemElement(item);
        const cartItems = document.querySelector('.cart__items');
        cartItems.appendChild(li);
        updateStorage();
        updateTotalPrice();
      });
      document.querySelector(selector).appendChild(newItem);
    });
  } catch (err) {
    console.log(err);
  }
}

async function deployStorage() {
  if (localStorage.cartItems) {
    const cartItems = JSON.parse(localStorage.cartItems);
    const cartItemsDOM = document.querySelector('.cart__items');
    cartItems.forEach((item) => {
      cartItemsDOM.appendChild(createCartItemElement(item));
    });
    updateTotalPrice();
  }
}

window.onload = function onload() {
  insertDataOnDocSelector('.items');
  deployStorage();
};
