window.onload = function onload() {};

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
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const getProductList = async () => {
  const data = await fetch(
    'https://api.mercadolibre.com/sites/MLB/search?q=computador',
  );
  return (await data.json()).results;
};

const addCart = sku => async event => {
  const url = `https://api.mercadolibre.com/items/${sku}`;
  const product = await (await fetch(url)).json();
  document.querySelector('.cart__items').appendChild(
    createCartItemElement({
      sku: product.id,
      name: product.title,
      salePrice: product.price,
    }),
  );
};

const displayList = async () => {
  const productList = (await getProductList()).map(item => ({
    sku: item.id,
    name: item.title,
    image: item.thumbnail,
    salePrice: item.price,
  }));
  productList.forEach((item) => {
    const product = createProductItemElement(item);
    product
      .querySelector('button')
      .addEventListener('click', addCart(item.sku));
    document.querySelector('.items').appendChild(product);
  });
};
displayList();
