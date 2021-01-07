
function apiItem(event) {
  const itemId = event.path[1].firstChild.innerText;

  fetch(`https://api.mercadolibre.com/items/${itemId}`)
    .then(response => response.json())
    .then(data => {
      const newItem = {
        sku: data.id,
        name: data.title,
        salePrice: data.price,
      }
      document.querySelector('ol').appendChild(createCartItemElement(newItem));
    })
    .catch(error => console.log(error));
}

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
  if (element === 'button') {
    e.addEventListener('click', apiItem);
  }


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
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {

}


function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function apiMercado() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then((data) => {
      data.results.forEach((element) => {
        const newData = {
          sku: element.id,
          name: element.title,
          image: element.thumbnail,
        };
        document.querySelector('.items').appendChild(createProductItemElement(newData));
      });
    });
}

window.onload = function onload() {
  apiMercado();
};
