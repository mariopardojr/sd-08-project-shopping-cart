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
  document.querySelector('.items').appendChild(section);
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener() {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  document.querySelector('.cart__items').appendChild(li);
  return li;
}

function setFetch() {
  return fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(r => r.json())
    .then((data) => {
      data.results.forEach((elem) => {
        const obj = {
          sku: elem.id,
          name: elem.title,
          image: elem.thumbnail,
        };
        createProductItemElement(obj);
      });
    });
}

function fetchId(id) {
  return fetch(`https://api.mercadolibre.com/items/${id}`)
  .then(r => r.json())
  .then((data) => {
    const obj = {
      sku: data.id,
      name: data.title,
      salePrice: data.price,
    };
    createCartItemElement(obj);
  });
}

function buttonsAdd() {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      fetchId(document.querySelectorAll('.item__sku')[index].innerText);
    });
  });
}

window.onload = async function onload() {
  await setFetch();
  await buttonsAdd();
};
