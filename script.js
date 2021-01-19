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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {

  // coloque seu código aqui
  // vou colocar aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// projeto feito  com o apoio de https://trybecourse.slack.com/archives/C01A9A2N93R/p1608237982190300

function generateItemsList() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then(response => response.json())
  .then(data => data.results.forEach((item) => {
    const objeto = {
      sku: item.id,
      name: item.title,
      image: item.thumbnail,
    };
    document.querySelector('.items').appendChild(
    createProductItemElement(objeto));
  }));
}

function addItemShoppingList() {
  document.querySelector('.items').addEventListener('click',
  (event) => {
    if (event.target.classList.contains('item__add')) {
      const parentElement = event.target.parentElement;
      const sku = getSkuFromProductItem(parentElement);
      fetch(`https://api.mercadolibre.com/items/${sku}`)
      .then(response => response.json())
      .then((data) => {
        const objeto = {
          sku: data.id,
          name: data.title,
          salePrice: data.price,
        };
        document.querySelector('.cart__items').appendChild(
        createCartItemElement(objeto));
      });
    }
  },
  );
}


window.onload = function onload() {
  generateItemsList();
  addItemShoppingList();
};
