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
  // coloque seu código aqui
  const ol = document.querySelector('.cart__items');
  ol.removeChild(event.target);
}

const saveList = () => {
  localStorage.clear();
  const ol = document.querySelector('.cart__items');
  const arr = [];
  for (let index = 0; index < ol.children.length; index += 1) {
    arr.push(ol.children[index].innerText);
  }
  localStorage.setItem('list', JSON.stringify(arr));
};

const cartTotalPrice = async () => {
  const ol = document.querySelector('.cart__items');
  let total = 0;
  if (ol.children.length > 0) {
    for (let index = 0; index < ol.children.length; index += 1) {
      const price = parseFloat(ol.children[index].innerText.split('$')[1]);
      total += price;
    }
  }
  document.querySelector('.total-price').innerHTML = total;
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  li.addEventListener('click', saveList);
  li.addEventListener('click', cartTotalPrice);
  return li;
}

const createListSaved = () => {
  const ol = document.querySelector('.cart__items');
  const listSaved = JSON.parse(localStorage.getItem('list'));
  if (listSaved !== null) {
    listSaved.forEach((element) => {
      const li = createCustomElement('li', 'cart__item', element);
      li.addEventListener('click', cartItemClickListener);
      li.addEventListener('click', saveList);
      li.addEventListener('click', cartTotalPrice);
      ol.appendChild(li);
    });
  }
};

const loadingAppear = () => {
  const div = createCustomElement('div', 'loading', 'loading...');
  const spot = document.querySelector('.loading_spot');
  spot.appendChild(div);
  spot.style.display = 'contents';
};

const loadingDisappear = () => {
  const div = document.querySelector('.loading');
  const spot = document.querySelector('.loading_spot');
  spot.removeChild(div);
  spot.style.display = 'none';
};

const fetchSelectedItem = async (event) => {
  const itemId = event.currentTarget.parentNode.firstChild.innerText;
  loadingAppear();
  await fetch(`https://api.mercadolibre.com/items/${itemId}`)
  .then((response) => {
    response.json().then((data) => {
      const obj = {
        sku: data.id,
        name: data.title,
        salePrice: data.price,
      };
      const item = createCartItemElement(obj);
      document.querySelector('.cart__items').appendChild(item);
      saveList();
      cartTotalPrice();
    });
  });
  loadingDisappear();
};

const fetchItems = async () => {
  loadingAppear();
  await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => {
      response.json().then((data) => {
        data.results.forEach((product, index) => {
          const obj = {
            sku: product.id,
            name: product.title,
            image: product.thumbnail,
          };
          const item = createProductItemElement(obj);
          document.querySelector('.items').appendChild(item);
          document.querySelectorAll('.item__add')[index]
            .addEventListener('click', fetchSelectedItem);
        });
      });
    });
  loadingDisappear();
};

const eraseCart = () => {
  const ol = document.querySelector('.cart__items');
  ol.innerHTML = '';
  saveList();
  cartTotalPrice();
};

window.onload = async function onload() {
  fetchItems();
  createListSaved();
  await cartTotalPrice();
  document.querySelector('.empty-cart').addEventListener('click', eraseCart);
};
