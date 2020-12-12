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

const total = document.createElement('span');

const createElementTotal = (value = 0) => {
  total.innerText = value;
  document.querySelector('.total-price').appendChild(total);
};

const totalPrice = async () => {
  const storagedCart = localStorage.getItem('cart');
  if (typeof storagedCart === 'string') {
    const storagedItems = JSON.parse(storagedCart);
    const listPrice = storagedItems.map(item => Object.values(item)[2]);
    const sum = listPrice.reduce((acc, curr) => (parseFloat(acc) + parseFloat(curr)), 0);
    createElementTotal(sum);
  } else {
    createElementTotal();
  }
};

const cartUpdate = async () => {
  localStorage.clear();
  const infos = [];
  const cartList = document.querySelectorAll('.cart__item');
  if (cartList.length > 0) {
    cartList.forEach((item) => {
      const itemChildren = item.querySelectorAll('div');
      const itemsPack = {};
      itemChildren.forEach(itemChild => Object.assign(itemsPack, ({
        [`${itemChild.className}`]: `${itemChild.innerText}`,
      })));
      infos.push(itemsPack);
    });
    localStorage.setItem('cart', JSON.stringify(infos));
  }
  setTimeout(() => totalPrice(), 1000);
};

async function cartItemClickListener(evtLi) {
  const evt = evtLi;
  evt.target.outerHTML = '';
  await cartUpdate();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${parseFloat(salePrice)}`;
  const spanLiSku = document.createElement('div');
  spanLiSku.className = 'sku';
  spanLiSku.innerText = sku;
  spanLiSku.style.display = 'none';
  li.appendChild(spanLiSku);
  const spanLiName = document.createElement('div');
  spanLiName.className = 'name';
  spanLiName.innerText = name;
  spanLiName.style.display = 'none';
  li.appendChild(spanLiName);
  const spanLiPrice = document.createElement('div');
  spanLiPrice.className = 'salePrice';
  spanLiPrice.innerText = salePrice;
  spanLiPrice.style.display = 'none';
  li.appendChild(spanLiPrice);
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const createProductList = async (product) => {
  const itemsList = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${product}`)
    .then(response => response.json())
      .then(data => data.results);
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

const getItemSku = async (evt) => {
  const itemId = getSkuFromProductItem(evt.target.parentElement);
  addToCart(itemId);
};

const itemBtnFunction = () => {
  const itemBtnList = document.querySelectorAll('.item__add');
  for (let indexBtn = 0; indexBtn < itemBtnList.length; indexBtn += 1) {
    itemBtnList[indexBtn].addEventListener('click', getItemSku);
  }
};

const recoveryCart = async () => {
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
  recoveryCart();
  await createProductList('computador');
  itemBtnFunction();
  await totalPrice();
};
