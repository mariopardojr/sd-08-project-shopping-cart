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
  const skuItemClick = item.querySelector('span.item__sku').innerText;
  return skuItemClick;
}

const totalElement = (value = 0) => {
  const total = document.createElement('span');
  total.innerText = value;
  document.querySelector('.total-price').appendChild(total);
};

const totalPrice = async () => {
  const cart = localStorage.getItem('cart');
  if (typeof cart === 'string') {
    const itens = JSON.parse(cart);
    const priceList = itens.map(item => Object.values(item)[2]);
    const total = priceList.reduce((num1, num2) => (parseFloat(num1) + parseFloat(num2)), 0);
    totalElement(total);
  } else {
    totalElement();
  }
};

const cartUpdate = async () => {
  localStorage.clear();
  const armazena = [];
  const cart = document.querySelector('.cart__item');
  if (cart.lenght > 0) {
    cart.forEach((list) => {
      const itemFilho = list.querySelectorAll('span');
      const itensObject = {};
      itemFilho.forEach(filho => Object.assign(itensObject, ({
        [`${filho.className}`]: `${filho.innerText}`,
      })));
      armazena.push(itensObject);
    });
    localStorage.setItem('cart', JSON.stringify(armazena));
  }
  setTimeout(() => totalPrice(), 1000);
};

function cartItemClickListener(event) {
  // coloque seu código aqui
  const targetEvent = event;
  if (targetEvent.target.nodName === 'LI') {
    targetEvent.target.outerHTML = '';
  } else if (targetEvent.parentElement.nodName === 'LI') {
    targetEvent.target.parentElement.outerHTML = '';
  } else if (targetEvent.target.parentElement.parentElement.nodName === 'LI') {
    targetEvent.target.parentElement.parentEouterHTML = '';
  }
  cartUpdate();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.innerHTML = '<p>SKU: <span class="sku"></span - NAME: <span class="name"><span> - PRICE $<span class="salePrice"></span</p>';
  li.className = 'cart__item';
  li.querySelector('.sku').innerText = sku;
  li.querySelector('.name').innerText = name;
  list.querySelector('.salePrice').innerText = salePrice;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const apiCreateProduct = async (produto) => {
  const listItems = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${produto}`)
  .then((response) => {
    document.querySelector('.items').appendChild(createCustomElement('span', 'loading', 'loading...'));
    return response.json();
  })
    .then(data => data.results);

  setTimeout(() => (document.querySelector('.loading').outerHTML = ''), 500);
  const container = document.querySelector('.items');
  listItems.forEach(({ id, title, thumbnail }) => {
    container.appendChild(createProductItemElement({
      sku: id,
      name: title,
      image: thumbnail,
    }));
  });
};

const addCart = async (id) => {
  const getItemInfos = await fetch(`https://api.mercadolibre.com/items/${id}`)
    .then(response => response.json());
  const { id: sku, title: name, price: salePrice } = getItemInfos;
  const itemCart = createCartItemElement({ sku, name, salePrice });
  document.querySelector('.cart__items').appendChild(itemCart);
  await cartUpdate();
};

const getItemSku = (evt) => {
  const itemId = getSkuFromProductItem(evt.target.parentElement);
  addCart(itemId);
};

const itemBtn = () => {
  const itemBtnList = document.querySelectorAll('.item__add');
  for (let indexBtn = 0; indexBtn < itemBtnList.length; indexBtn += 1) {
    itemBtnList[indexBtn].addEventListener('click', getItemSku);
  }
};

const clearAll = () => {
  const cart = document.querySelectorAll('.cart__item');
  for (let a = cart.length; a > 0; a -= 1) {
    cart[a - 1].outerHTML = '';
  }
  cartUpdate();
};

const emptyCartBtn = document.querySelector('.empty-cart');
emptyCartBtn.addEventListener('click', clearAll);

const recovCart = async () => {
  const cartRecovered = localStorage.getItem('cart');
  if (typeof cartRecovered === 'string') {
    const itemsCartRecovred = JSON.parse(cartRecovered);
    itemsCartRecovred.forEach((item) => {
      const { sku, name, salePrice } = item;
      const itemCart = createCartItemElement({ sku, name, salePrice });
      document.querySelector('.cart__items').appendChild(itemCart);
    });
  }
  await cartUpdate();
};

window.onload = async function onload() {
  recovCart();
  await apiCreateProduct('computador');
  itemBtn();
  setTimeout(() => totalPrice(), 1000);
};
