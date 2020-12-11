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

function loading() {
  const load = document.createElement('div');
  load.className = 'loading';
  load.innerText = 'Loading...';
  document.body.appendChild(load);
}

function sumItem() {
  let value = 0;
  document.querySelectorAll('.cart__item').forEach((item) => {
    value += parseFloat(item.innerHTML.split('$')[1]);
  });
  document.querySelector('.total-price').innerHTML = `${value}`;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  document.querySelector('.items').appendChild(section);
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function saveItems() {
  localStorage.setItem('list', (document.querySelector('.cart__items').innerHTML));
}

function loadItems() {
  document.querySelector('.cart__items').innerHTML = localStorage.getItem('list');
}

function cartItemClickListener(event) {
  event.target.parentNode.removeChild(event.target);
  saveItems();
  sumItem();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function setFetch() {
  loading();
  return fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(r => r.json())
    .then((data) => {
      data.results.forEach((elem) => {
        const obj = {
          sku: elem.id,
          name: elem.title,
          image: elem.thumbnail,
        };
        createProductItemElement(obj);
      });
    });
}

function fetchId(id) {
  loading();
  return fetch(`https://api.mercadolibre.com/items/${id}`)
  .then(r => r.json())
  .then((value) => {
    const obj = {
      sku: value.id,
      name: value.title,
      salePrice: value.price,
    };
    document.querySelector('.cart__items').appendChild(createCartItemElement(obj));
    saveItems();
    sumItem();
  });
}

function buttonsAdd() {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      fetchId(document.querySelectorAll('.item__sku')[index].innerText);
    });
  });
}

function removeItems() {
  document.querySelector('.empty-cart').addEventListener('click', () => {
    const node = document.querySelector('.cart__items');
    while (node.hasChildNodes()) {
      node.removeChild(node.lastChild);
    }
    localStorage.clear();
    sumItem();
  });
}

window.onload = async function onload() {
  await loading();
  await setFetch();
  await buttonsAdd();
  await loadItems();
  removeItems();
  await sumItem();
};
