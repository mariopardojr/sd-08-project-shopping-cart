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

function cartItemClickListener(evt) {
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
  console.log(itemslist);

  const itemsContainer = document.querySelector('.items');
  itemslist.forEach(({ id, title, thumbnail }) => {
    itemsContainer.appendChild(createProductItemElement({
      sku: id,
      name: title,
      image: thumbnail,
    }));
  });
};

const addToCart = async (evt) => {
  const productId = evt.target.parentElement.firstChild.innerText;
  const itemById = await fetch(`https://api.mercadolibre.com/items/${productId}`)
    .then(response => response.json());
  const { id: sku, title: name, price: salePrice } = itemById;
  document.querySelector('.cart__items').appendChild(createCartItemElement({ sku, name, salePrice }));
};

const functionBtn = () => {
  const btnAddToCart = document.getElementsByClassName('item__add');
  for (let index = 0; index < btnAddToCart.length; index += 1) {
    btnAddToCart[index].addEventListener('click', addToCart);
  }
};

window.onload = async function onload() {
  await createProductList('computador');
  functionBtn();
};
