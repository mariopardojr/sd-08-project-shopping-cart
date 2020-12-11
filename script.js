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

const createItemOnScreen = (element) => {
  const getSessionItem = document.querySelector('.items');
  getSessionItem.appendChild(element);
};

const createItemOnCart = (element) => {
  const getOl = document.querySelector('.cart__items');
  getOl.appendChild(element);
};

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
  console.log('ops')
  event.target.remove();
  // saveCartItemToLocalStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const getItens = async (computador) => {
  await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${computador}#json`)
    .then((response) => {
      response.json()
        .then((data) => {
          data.results.map((result) => {
            const element = {
              sku: result.id,
              name: result.title,
              image: result.thumbnail,
            };
            const { sku, name, image } = element;
            const ProductItemElement = createProductItemElement({ sku, name, image });
            createItemOnScreen(ProductItemElement);
            return false;
          });
        });
    });
};

const getItemById = async (ItemID) => {
  await fetch(`https://api.mercadolibre.com/items/${ItemID}`)
    .then((response) => {
      response.json()
        .then((pratala) => {
          const sku = pratala.id;
          const name = pratala.title;
          const salePrice = pratala.price;
          const item = createCartItemElement({ sku, name, salePrice });
          createItemOnCart(item);
          saveCartItemToLocalStorage();
          return false;
        });
    });
};

const getButtonOfAddToCart = (e) => {
  if (e.target.className === 'item__add') {
    const componentSection = e.target.parentElement;
    const id = componentSection.querySelector('.item__sku').innerText;
    getItemById(id);
  }
};

window.addEventListener('click', getButtonOfAddToCart);

const saveCartItemToLocalStorage = () => {
  const itensAdded = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('Itens', itensAdded);
}

const getItensFromLocalStorage = () => {
  const itensOnLocalStorage = localStorage.getItem('Itens');
  let getOl = document.querySelector('.cart__items');
  getOl.innerHTML = itensOnLocalStorage;
  document.querySelector('.cart__items').addEventListener('click', cartItemClickListener);
}

window.onload = async function onload() {
  getItens('computador');
  getItensFromLocalStorage();
};
