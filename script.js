window.onload = getObjByID();

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

// requisito 3
function cartItemClickListener() {
  const ol = document.querySelector('.cart__items');
  ol.addEventListener('click', function (click) {
    if (click.target.classList.contains('cart__item')) {
      const father = click.target.parentNode;
      console.log(click.target);
      father.removeChild(click.target);
    }
  });
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const sectionItem = document.querySelector('.items');

function makeList(url) {
  if (url !== undefined) {
    return fetch(url)
      .then(response => response.json())
      .then(data =>
        data.results.forEach((obj) => {
          const par = { sku: obj.id, name: obj.title, image: obj.thumbnail };
          sectionItem.appendChild(createProductItemElement(par));
        }),
      );
  }
  throw new Error('Erro na url');
}

async function addCart(target) {
  let par;
  const id = target.parentNode.firstChild.innerText;
  await fetch(`https://api.mercadolibre.com/items/${id}`)
    .then(response => response.json())
    .then((json) => { par = { sku: json.id, name: json.title, salePrice: json.price }; })
    .catch(() => console.log('Error'));

  const cartItems = document.querySelector('.cart__items');
  cartItems.appendChild(createCartItemElement(par));
}

async function getObjByID() {
  await makeList('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const addCartBtn = document.querySelectorAll('.item__add');
  await addCartBtn.forEach((obj) => {
    obj.addEventListener('click', function () {
      addCart(obj);
    });
  });
}
