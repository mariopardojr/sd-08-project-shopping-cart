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
  // coloque seu código aqui!!!!
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function findItems(category = 'computador') {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=$${category}`)
    .then(resposta => resposta.json())
    .then(dados => dados.results)
    .then(results => results.forEach(({ id, title, thumbnail }) => {
      const item = {
        sku: id,
        name: title,
        image: thumbnail,
      };
      const sectionItems = document.querySelector('.items');
      sectionItems.appendChild(createProductItemElement(item));
    }));
}

function btnAddEvent() {
  const sectionItems = document.querySelector('.items');
  sectionItems.addEventListener('click', (event) => {
    if (event.target.className === 'item__add') {
      const parent = event.target.parentElement;
      const child = parent.children;
      const sku = child[0].innerText;
      fetch(`https://api.mercadolibre.com/items/${sku}`)
      .then(resposta => resposta.json())
      .then((dados) => {
        const { id, title, price } = dados;
        const itemSelect = {
          sku: id,
          name: title,
          salePrice: price,
        };
        const classCart = document.querySelector('.cart__items');
        classCart.appendChild(createCartItemElement(itemSelect));
      });
    }
  });
}

function emptyCart() {
  const btnEmpty = document.querySelector('.empty-cart');
  btnEmpty.addEventListener('click', fBtnEmpty);
}

function fBtnEmpty(){
  const cartOl = document.querySelector('.cart__items');
  console.log(cartOl);
  cartOl.textContent = '';
}

window.onload = function onload() {
  findItems();
  btnAddEvent();
  emptyCart();
};
