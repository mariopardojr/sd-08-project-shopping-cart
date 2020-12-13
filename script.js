function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function cartItemClickListener(event) {
  console.log(event.target);
  event.target.remove();
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

  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  const createBtn = createCustomElement(
    'button',
    'item__add',
    'Adicionar ao carrinho!',
  );
  createBtn.addEventListener('click', () => {
    console.log(sku);
    fetch(`https://api.mercadolibre.com/items/${sku}`)
      .then(response => response.json())
      .then(value => {
        // console.log(value);
        const { price } = value;
        console.log(price);
        const productObj = { sku, name, salePrice: price };
        document
          .querySelector('.cart__items')
          .appendChild(createCartItemElement(productObj));
      });
  });
  section.appendChild(createBtn);
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const productList = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador').then(
    response => {
      response.json().then(data => {
        data.results.map(value => {
          const dataMl = createProductItemElement({
            sku: value.id,
            name: value.title,
            image: value.thumbnail,
          });
          // console.log(dataMl);
          return document.querySelector('.items').appendChild(dataMl);
        });
      });
    },
  );
};
// armazenar a class em uma variável. Em seguida, chamar essa variável e add um evento de click, que, ao ser clicado, apaga a Li dos produtos selecionados.
const emptyCart = document.querySelector('.empty-cart');
emptyCart.addEventListener('click', () => {
  const deleteLi = document.querySelectorAll('.cart__item');
  deleteLi.forEach((item) => item.remove());
});

window.onload = function onload() {
  productList();
};
