window.onload = function onload() { };

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
  event.target.parentNode.removeChild(event.target);
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
  const addToCartButton = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  addToCartButton.addEventListener('click', () => {
    fetch(`https://api.mercadolibre.com/items/${event.target.parentNode.firstChild.innerText}`)
    .then(result => result.json())
    .then((data) => {
      const product = {
        sku: data.id,
        name: data.title,
        salePrice: data.price,
      };
      const cartItem = createCartItemElement(product);
      document.getElementsByClassName('cart__items')[0].appendChild(cartItem);
    });
  });
  section.appendChild(addToCartButton);
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createProductItemList(QUERY) {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${QUERY}`)
    .then(result => result.json())
    .then(data =>
      data.results.forEach((item) => {
        const features = {
          sku: item.id,
          name: item.title,
          image: item.thumbnail,
        };
        document
          .getElementsByClassName('items')[0]
          .appendChild(createProductItemElement(features));
      }),
    );
}
createProductItemList('computador');
