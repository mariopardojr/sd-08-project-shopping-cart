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

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  li.addEventListener('click', saveList);
  return li;
}

const createListSaved = () => {
  const ol = document.querySelector('.cart__items');
  const listSaved = JSON.parse(localStorage.getItem('list'));
  listSaved.forEach((element) => {
    const li = createCustomElement('li', 'cart__item', element);
    li.addEventListener('click', cartItemClickListener);
    li.addEventListener('click', saveList);
    ol.appendChild(li);
  });
};

const fetchSelectedItem = (event) => {
  const itemId = event.currentTarget.parentNode.firstChild.innerText;
  fetch(`https://api.mercadolibre.com/items/${itemId}`)
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
    });
  });
};

const fetchItems = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
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
};

window.onload = function onload() {
  fetchItems();
  createListSaved();
};
