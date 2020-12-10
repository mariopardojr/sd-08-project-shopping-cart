window.onload = function onload() {};

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
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  );

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

const getProductList = () => {
  return new Promise((resolve, rejected) => {
    fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
      .then((data) => data.json())
      .then((response) => resolve(response.results))
      .catch((error) => rejected('Não foi possível adquirir dados da API'));
  });
};

const displayList = async () => {
  const productList = (await getProductList()).map((item) => ({
    sku: item.id,
    name: item.title,
    image: item.thumbnail,
    salePrice: item.price,
  }));
  productList.forEach((item) => {
    document
      .querySelector('.items')
      .appendChild(createProductItemElement(item));
  });
};
displayList();

// getProductList()
//   .then((list) => {
//     const listFiltered = list.map((item) => {
//       return {
//         sku: item.id,
//         name: item.title,
//         image: item.thumbnail,
//         salePrice: item.price,
//       };
//     });
//     return listFiltered;
//   })
//   .then((list) =>
//     list.forEach((item) => {
//       document
//         .querySelector(".items")
//         .appendChild(createProductItemElement(item));
//     })
//   );
