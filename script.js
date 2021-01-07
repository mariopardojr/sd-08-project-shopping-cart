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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

// function createCartItemElement({ sku, name, salePrice }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }

async function productsByQuery(word, loadFn) {
  const url = `https://api.mercadolibre.com/sites/MLB/search?q=${word}`;
  try {
    const response = await fetch(url);
    const { results } = await response.json();
    loadFn(results);
  } catch (err) {
    throw new Error(err);
  }
}

const loadProducts = (products) => {
  const itemSection = document.querySelector('.items');
  products.forEach((cartItem) => {
    itemSection.appendChild(createProductItemElement(cartItem));
  });
};

window.onload = function onload() {
  productsByQuery('computer', loadProducts);
};
