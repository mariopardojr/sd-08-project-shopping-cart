function saveCart() {
  const lastCart = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cart', lastCart);
}

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
  event.target.parentElement.removeChild(event.target);
  saveCart();
}

const removeProductInCart = () => {
  const itemCart = document.querySelectorAll('cart__item');
  itemCart.forEach(item => item.addEventListener('click', cartItemClickListener));
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  saveCart();
  return li;
}

// A função addProductInCart está sendo executada dentro da função findItens.
const addProductInCart = () => {
  const addButton = document.querySelectorAll('.item__add');
  addButton.forEach(allAddButtons => allAddButtons
    .addEventListener('click', (event) => {
      // Essa variavel pega o ID do mercado livre para passar para o fetch.
      const id = event.target.parentElement.firstChild.innerText;
      const url = `https://api.mercadolibre.com/items/${id}`;
      fetch(url)
        .then(response => response.json())
        .then((data) => {
          const item = {
            sku: id,
            name: data.title,
            salePrice: data.price,
          };
          document.querySelector('.cart__items').appendChild(createCartItemElement(item));
          saveCart();
        });
    }));
};

const findItens = (item) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${item}`)
    .then(response => response.json())
    .then((data) => {
      const items = data.results.map(results => ({
        sku: results.id,
        name: results.title,
        image: results.thumbnail,
      }));
      document.querySelector('.loading').remove();
      items.forEach(itemList => document.querySelector('.items').appendChild(createProductItemElement(itemList)));
    })
    .then(() => addProductInCart());
};

const loadCart = () => {
  const currentCart = document.querySelector('.cart__items');
  currentCart.innerHTML = localStorage.getItem('cart');
  // restaura a função de remover com um clique sobre o item que está no carrinho.
  const currentElements = document.querySelectorAll('.cart__item');
  currentElements.forEach(items => items.addEventListener('click', cartItemClickListener));
};

function eraseAllButton() {
  const eraseButton = document.querySelector('.empty-cart');
  eraseButton.addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
    saveCart();
  });
}
removeProductInCart();

window.onload = () => {
  findItens('computador');
  loadCart();
  eraseAllButton();
};
