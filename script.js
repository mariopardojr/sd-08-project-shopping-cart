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
  return item.querySelector('span.item__sku').innerText;
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

const getItemsFromApi = async () => {
  const sectionItens = document.querySelector('.items');
  return new Promise((resolve, reject) => {
    fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
      .then((response) => {
        response.json().then((data) => {
          const resultado = data.results;
          resultado.forEach((element) => {
            sectionItens.appendChild(createProductItemElement({
              sku: element.id,
              name: element.title,
              image: element.thumbnail,
            }));
          });
          resolve();
        });
      });
  })
}

const getSingleItem = (itemId) => {
  const listItens = document.querySelector('.cart__items');
  fetch(`https://api.mercadolibre.com/items/${itemId}`)
    .then((response) => {
      response.json().then((data) => {
        listItens.appendChild(createCartItemElement({
          sku: data.id,
          name: data.title,
          salePrice: data.price,
        }))
      });
    });
}

window.onload = async function onload() {
  await getItemsFromApi();
  const allButtons = document.querySelectorAll('.item__add');
  allButtons.forEach((element) => {
    element.addEventListener('click', () => {
      const elementId = element.parentNode.firstChild.innerText;
      getSingleItem(elementId);
    })
  })
};

