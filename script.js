// function savedStorage() {
//   const cartItems = document.querySelector('.cart__items').innerHTML;
//   localStorage.setItem('itens', cartItems);
// }

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
  const btn = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  btn.addEventListener('click', () => {
    fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then(data => data.json()) 
    .then(data => {
      const itemObj = {
        sku: data.id,
        name: data.title,
        salePrice: data.price,
      }
      const cart = document.querySelector('.cart__items');
      cart.appendChild(createCartItemElement(itemObj));
    })
  })
  section.appendChild(btn);

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function getApi() {
  return fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
  .then(data => data.json())
  .then((data) => {
    const arrayResults = data.results;
    const listItems = document.querySelector('.items');
    arrayResults.forEach((element) => {
      const product = createProductItemElement({
        sku: element.id,
        name: element.title,
        image: element.thumbnail,
      });
      listItems.appendChild(product);
    });
    console.log(arrayResults);
    return arrayResults;
  });
}

window.onload = function onload() {
  getApi();
};
