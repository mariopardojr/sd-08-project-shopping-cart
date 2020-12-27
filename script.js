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
  const skuItemClicked = item.querySelector('span.item__sku').innerText;
  return skuItemClicked;
}
const valorTotal = document.createElement('span');

const createElementTotal = (value = 0) => {
  valorTotal.innerText = value;
  document.querySelector('.total-price').appendChild(valorTotal);
};

const totalPrice = async () => {
  const storageC = localStorage.getItem('cart');
  if (typeof storageC === 'string') {
    const storagedItems = JSON.parse(storageC);
    const totalList = storagedItems.map(item => Object.values(item)[2]);
    const soma = totalList.reduce((num1, num2) => (parseFloat(num1) + parseFloat(num2)), 0);
    createElementTotal(soma);
  } else {
    createElementTotal();
  }
};

const cartUpdate = async () => {
  localStorage.clear();
  const result = [];
  const items = document.querySelectorAll('.cart__item');
  if (items.length > 0) {
    items.forEach((item) => {
      const itemChildren = item.querySelectorAll('span');
      const itemsPack = {};
      itemChildren.forEach(itemChild => Object.assign(itemsPack, ({
        [`${itemChild.className}`]: `${itemChild.innerText}`,
      })));
      result.push(itemsPack);
    });
    localStorage.setItem('cart', JSON.stringify(result));
  }
  setTimeout(() => totalPrice(), 1000);
};

function cartItemClickListener(evtLi) {
  const evt = evtLi;
  if (evt.target.nodeName === 'LI') {
    evt.target.outerHTML = '';
  } else if (evt.target.parentElement.nodeName === 'LI') {
    evt.target.parentElement.outerHTML = '';
  } else if (evt.target.parentElement.parentElement.nodeName === 'LI') {
    evt.target.parentElement.parentElement.outerHTML = '';
  }
  cartUpdate();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.innerHTML = '<p>SKU: <span class="sku"></span> | NAME: <span class="name"></span> | PRICE: $<span class="salePrice"></span></p>';
  li.className = 'cart__item';
  li.querySelector('.sku').innerText = sku;
  li.querySelector('.name').innerText = name;
  li.querySelector('.salePrice').innerText = salePrice;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const createProductAPI = async (product) => {
  const itemsList = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${product}`)
    .then((response) => {
      document.querySelector('.items').appendChild(createCustomElement('span', 'loading', 'loading...'));
      return response.json();
    })
      .then(data => data.results);

  setTimeout(() => (document.querySelector('.loading').outerHTML = ''), 500);
  const itemsContainer = document.querySelector('.items');
  itemsList.forEach(({ id, title, thumbnail }) => {
    itemsContainer.appendChild(createProductItemElement({
      sku: id,
      name: title,
      image: thumbnail,
    }));
  });
};

const addToCart = async (id) => {
  const getItemInfos = await fetch(`https://api.mercadolibre.com/items/${id}`)
    .then(response => response.json());
  const { id: sku, title: name, price: salePrice } = getItemInfos;
  const itemCart = createCartItemElement({ sku, name, salePrice });
  document.querySelector('.cart__items').appendChild(itemCart);
  await cartUpdate();
};

const getItemSku = (evt) => {
  const itemId = getSkuFromProductItem(evt.target.parentElement);
  addToCart(itemId);
};

const btnItem = () => {
  const itemBtnList = document.querySelectorAll('.item__add');
  for (let a = 0; a < itemBtnList.length; a += 1) {
    itemBtnList[a].addEventListener('click', getItemSku);
  }
};

const clearAll = () => {
  const cart = document.querySelectorAll('.cart__item');
  for (let indexCart = cart.length; indexCart > 0; indexCart -= 1) {
    cart[indexCart - 1].outerHTML = '';
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
  await createProductAPI('computador');
  btnItem();
  setTimeout(() => totalPrice(), 1000);
};
