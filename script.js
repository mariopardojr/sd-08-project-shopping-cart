
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

// recebe o objeto da api retornada da função fetchAndRenderProducts,
// para criar os elementos no html.
function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

// retorna o id do item
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function saveDatas() {
  const chosen = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cart', chosen);
}

// remove o item do carrinho ai clicar nele
function cartItemClickListener() {
  const ol = document.querySelector('.cart__items');
  ol.addEventListener('click', (event) => {
    event.target.remove();
    saveDatas();
  });
}

function clearList() {
  document.querySelector('.cart__items').innerHTML = '';
  document.querySelector('.total-price').innerHTML = 0;
  totalPrice();
  saveDatas();
}

function removeList() {
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', clearList);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function totalPrice() {
  let total = 0;
  document.querySelectorAll('.cart__item')
  .forEach((items) => { total += parseFloat(items.innerHTML.split('$')[1]); });
  document.querySelector('.total-price').innerHTML = total;
}

function addItemsToCart() {
  const buttonAddItem = document.querySelector('.items');
  buttonAddItem.addEventListener('click', (event) => {
    if (event.target.classList.contains('item__add')) {
      const parentElement = event.target.parentElement;
      const getClassName = getSkuFromProductItem(parentElement);
      fetch(`https://api.mercadolibre.com/items/${getClassName}`)
      .then(response => response.json())
      .then((data) => {
        const chosenItem = { sku: data.id, name: data.title, salePrice: data.price };
        const createCart = createCartItemElement(chosenItem);
        document.querySelector('.cart__items').appendChild(createCart);
        totalPrice();
        saveDatas();
      });
    }
  });
}

function returnDatas() {
  document.querySelector('.cart__items').innerHTML = localStorage.getItem('cart');
}

async function fetchAndRenderProducts() {
  try {
    const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
    const { results } = await response.json();
    results.forEach((product) => {
      const productItem = createProductItemElement(product);
      document.querySelector('.items').appendChild(productItem);
    });
  } catch (error) {
    console.log('caiu aqui', error);
  }
}

window.onload = function onload() {
  fetchAndRenderProducts();
  addItemsToCart();
  cartItemClickListener();
  returnDatas();
  removeList();
};
