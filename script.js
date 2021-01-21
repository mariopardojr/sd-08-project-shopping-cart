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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  // section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  const addCartItem = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  addCartItem.addEventListener('click', () => {
    const cartList = document.querySelector('.cart__items');
    fetch(`https://api.mercadolibre.com/items/${sku}`)
      .then((response) => {
        response.json().then((data) => 
          cartList.appendChild(createCartItemElement({
            sku: data.id,
            name: data.title,
            salePrice: data.price
          }))
        );
      });
  });
  section.appendChild(addCartItem);
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const fetchItens = () => {
  const list = document.querySelector('.items');
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((response) => {
    response.json().then((data) => {
      data.results.map((items) => {
        const product = {
          sku: items.id,
          name: items.title,
          image: items.thumbnail,
        };
        return list.appendChild(createProductItemElement(product));
      });
    });
  });
};

window.onload = function onload() {
  fetchItens();
};
