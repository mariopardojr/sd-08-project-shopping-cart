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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const element = event.target;
  element.parentNode.removeChild(element);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);

  return li;
}

const addToCar = (event) => {
  const select = event.target.parentNode;
  const getId = getSkuFromProductItem(select);
  fetch(`https://api.mercadolibre.com/items/${getId}`)
    .then(resp => resp.json())
    .then((data) => {
      const product = {
        sku: data.id,
        name: data.title,
        salePrice: data.price,
      };
      const addCar = createCartItemElement(product);
      const selOl = document.querySelector('.cart__items');
      selOl.appendChild(addCar);
    });
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  section.addEventListener('click', addToCar);

  return section;
}

window.onload = function onload() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(resp => resp.json())
    .then(data => data.results
      .forEach((elem) => {
        const obj = {
          sku: elem.id,
          name: elem.title,
          image: elem.thumbnail,
        };
        const itensCarrinho = document.querySelector('.items');
        itensCarrinho.appendChild(createProductItemElement(obj));
      }));
};
