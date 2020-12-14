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
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!')).addEventListener('click', () => {
    fetch(`https://api.mercadolibre.com/items/${sku}`)
      .then(resolve => resolve.json())
      .then((data) => {
        const cartItem = {
          sku,
          name,
          salePrice: data.price,
        };
        console.log("pko");
        const car = document.querySelector(".cart__items");
        car.appendChild(createCartItemElement(cartItem));
      });
  });
  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }


// Req1 - Criando os itens a partir da API e ligando com a função createProductItemElement
const products = (search) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${search}`)
  .then(response => response.json())
  .then(data => data.results.forEach(({ id, title, thumbnail }) => {
    const object = {
      sku: id,
      name: title,
      image: thumbnail,
    };
    const items = document.querySelector('.items');
    items.appendChild(createProductItemElement(object));
  }));
};
window.onload = async () => products('computador');
