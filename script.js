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
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: ${salePrice}`;
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
        .then((data) => {
          const element = {
            sku: data.id,
            name: data.title,
            salePrice: data.price,
          }
          const { sku, name, salePrice } = element;
          const item = createCartItemElement({ sku, name, salePrice });
          createItemOnCart(item);
          return false;
        });
    });
};

const getButtonOfAddToCart = (e) => {
  if (e.target.className === 'item__add') {
    const componentSection = e.target.parentElement;
    const id = componentSection.querySelector('.item__sku').innerText;
    getItemById(id);
  };
}

window.addEventListener('click', getButtonOfAddToCart);

window.onload = async function onload() {
  getItens('computador')
};
