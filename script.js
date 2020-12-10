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

async function getItemsFromApi(url, parent, funcao) {
  return new Promise((resolve) => {
    fetch(url)
      .then((response) => {
        response.json().then((data) => {
          let resultado = [data];
          console.log(resultado);
          let variavel = 'salePrice';
          let value = 'price';
          if (parent === document.querySelector('.items')) {
            resultado = data.results;
            variavel = 'image';
            value = 'thumbnail';
          }
          resultado.forEach((element) => {
            parent.appendChild(funcao({
              sku: element.id,
              name: element.title,
              [variavel]: element[value],
            }));
          });
          resolve();
        });
      });
  });
}


window.onload = async function onload() {
  const sectionItens = document.querySelector('.items');
  await getItemsFromApi('https://api.mercadolibre.com/sites/MLB/search?q=computador', sectionItens, createProductItemElement);

  const allButtons = document.querySelectorAll('.item__add');
  allButtons.forEach((element) => {
    element.addEventListener('click', () => {
      const elementId = element.parentNode.firstChild.innerText;
      const listItens = document.querySelector('.cart__items');
      getItemsFromApi(`https://api.mercadolibre.com/items/${elementId}`, listItens, createCartItemElement);
    });
  });
};
