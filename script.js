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

function cartItemClickListener(e) {
  // Depois
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const createProductList = async (product) => {
  const itemslist = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${product}`)
    .then(response => response.json())
      .then(data => data.results);

  const itemsContainer = document.querySelector('.items');
  itemslist.forEach(({ id, title, thumbnail }) => {
    itemsContainer.appendChild(createProductItemElement({
      sku: id,
      name: title,
      image: thumbnail,
    }));
  });
};

const functionBtnGenerator = (array, func) => {
  for (let index = 0; index < array.length; index += 1) {
    array[index].addEventListener('click', func);
  }
};

const cartUpdate = () => {
  localStorage.clear();
  const cartList = document.querySelectorAll('.cart__item');
  if (document.querySelectorAll('.cart__item').length > 0) {
    for (let indexCart = 0; indexCart < cartList.length; indexCart += 1) {
      localStorage.setItem(indexCart, cartList[indexCart].innerText.slice(5, 18));
    }
  }
};

const deleteItemCart = (evtDel) => {
  const evt = evtDel;
  evt.target.outerHTML = '';
  cartUpdate();
};

const functionLi = () => {
  const liTarget = document.getElementsByTagName('li');
  if (liTarget.length > 0) {
    functionBtnGenerator(liTarget, deleteItemCart);
  }
};

const addToCart = async (id) => {
  const itemById = await fetch(`https://api.mercadolibre.com/items/${id}`)
  .then(response => response.json());
  const { id: sku, title: name, price: salePrice } = itemById;
  document.querySelector('.cart__items').appendChild(createCartItemElement({ sku, name, salePrice }));
  cartUpdate();
  functionLi();
};

const getItemToCart = (evtAdd) => {
  const productId = evtAdd.target.parentElement.firstChild.innerText;
  addToCart(productId);
};

const functionAddBtn = () => {
  const btnAddToCart = document.getElementsByClassName('item__add');
  functionBtnGenerator(btnAddToCart, getItemToCart);
};

const cartListRecovery = () => {
  const recovery = Object.keys(localStorage);
  if (recovery.length > 0) {
    for (let indexRec = 0; indexRec < recovery.length; indexRec += 1) {
      addToCart(localStorage.getItem(indexRec));
    }
  }
};

window.onload = async function onload() {
  await createProductList('computador');
  functionAddBtn();
  cartListRecovery();
  functionLi();
};
