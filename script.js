function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function cartItemClickListener(event) {
event.target.addEventListener('click', () => {
event.target.remove();
});
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createCartItemElement({ sku, name, salePrice }) {
  const cartSection = document.getElementsByClassName('cart__items')[0];
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  cartSection.appendChild(li);
  return li;
}

async function fetchItem(event) {
  fetch(`https://api.mercadolibre.com/items/${getSkuFromProductItem(event.target.parentElement)}`)
  .then((response) => {
    response.json().then((data) => {
      const cartItem = Object.create({});
      cartItem.sku = data.id;
      cartItem.name = data.title;
      cartItem.salePrice = data.price;
      createCartItemElement(cartItem);
    });
  });
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const itemSection = document.getElementsByClassName('items')[0];
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  section.querySelector('button').addEventListener('click', fetchItem);
  itemSection.appendChild(section);
  return section;
}

async function getItem(item) {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${item}`)
    .then((response) => {
      response.json().then((data) => {
        const itemArray = data.results.map(function (value) {
          return { sku: value.id,
            name: value.title,
            image: value.thumbnail };
        });
        itemArray.forEach((element) => {
          createProductItemElement(element);
        });
      });
    });
}

window.onload = async function onload() {
  await getItem('computador');
};
