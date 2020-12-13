const cartListSaved = () => {
  const cartList = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cart', cartList);
};

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

const getProducts = (product) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${product}`)
  .then(response => response.json())
  .then((data) => {
    // console.log(data.results);
    data.results.forEach(({ id: sku, title: name, thumbnail: image }) => {
      // console.log(sku, name, image);
      const sectionItems = document.querySelector('.items');
      // console.log(sectionItems);
      sectionItems.appendChild(createProductItemElement({ sku, name, image }));
    });
  });
};

const getSection = () => {
  const sectionProducts = 'computador';
  getProducts(sectionProducts);
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // console.log(event.target);
  event.target.remove();
  // coloque seu código aqui
  cartListSaved();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const loadingCartListSaved = () => {
  const sectionCartList = document.querySelector('.cart__items');
  sectionCartList.innerHTML = localStorage.getItem('cart');
  const sectionCartItems = document.querySelector('.cart__items');
  sectionCartItems.addEventListener('click', cartItemClickListener);
};

function addProductToCart() {
  document.querySelector('.items').addEventListener('click', (Event) => {
    if (Event.target.classList.contains('item__add')) {
      const parentNode = Event.target.parentNode;
      // console.log(parentNode);
      const sku = getSkuFromProductItem(parentNode);
      fetch(`https://api.mercadolibre.com/items/${sku}`)
      .then(response => response.json())
      .then((data) => {
        // console.log(data.id);
        const sectionCartItems = document.querySelector('.cart__items');
        const { title: name, price: salePrice } = data;
        sectionCartItems.appendChild(createCartItemElement({ sku, name, salePrice }));
        cartListSaved();
      });
    }
  });
}

const cleanCartProducts = () => {
  const buttonClean = document.querySelector('.empty-cart');
  buttonClean.addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
    cartListSaved();
  });
};

window.onload = function onload() {
  getSection();
  addProductToCart();
  cleanCartProducts();
  loadingCartListSaved();
};
