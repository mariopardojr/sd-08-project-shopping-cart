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
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', () => {
    //fetch()
  });
  section.appendChild(button);
  
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

// function getId() {
//   const liId = document.querySelector('.item__sku');
//   const buttonClass = document.querySelector('.items');
//   buttonClass.addEventListener('click', () => console.log(buttonClass));
  
// }

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function fetchAPI() {
  const apiResponse = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const { results } = await apiResponse.json();
  results.forEach((computer) => {
    const newComputer = createProductItemElement(computer);
    document.querySelector('.items').appendChild(newComputer);
  });
}

window.onload = function onload() {
  fetchAPI();
  getId();
};
