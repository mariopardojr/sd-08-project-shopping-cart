const localStorageGet = () => {
  const ol = localStorage.getItem('compras');
  document.querySelector('.cart__items').innerHTML = ol;
};

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
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
function cartItemClickListener(event) {
  //   // coloque seu código aqui
  event.target.parentNode.removeChild(event.target);
}
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function localStorageSave() {
  localStorage.setItem('compras', document.querySelector('.cart__items').innerHTML);
}
const addProducts = (event) => {
  const test = event.target.parentNode;
  const idItem = getSkuFromProductItem(test);
  fetch(`https://api.mercadolibre.com/items/${idItem}`)
    .then(resolve => resolve.json())
    .then((data) => {
      const item = {
        sku: data.id,
        name: data.title,
        salePrice: data.price,
      };
      const itemSelect = document.querySelector('.cart__items');
      itemSelect.appendChild(createCartItemElement(item));
      localStorageSave();
    });
};
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', addProducts);
  return section;
}
// ideia pega no repositorio do Douglas Cajueiro
const loadRemove = () => {
  const loading = document.querySelector('.loading');
  loading.remove();
};

const fetchProducts = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then((data) => {
      loadRemove();
      data.results.forEach((product) => {
        const object = {
          sku: product.id,
          name: product.title,
          image: product.thumbnail,
        };
        document.querySelector('.items').appendChild(createProductItemElement(object));
      });
    });
};

// const salvando = () => {
//   const salvar = document.querySelector('.cart__items');
//   console.log(salvar);
//      let lista = document.querySelector('.cart__items').innerHTML;
//      localStorage.setItem('lista', lista);
// }
// const recuperar = document.querySelector('cart__items')
// .innerHTML = localStorage.getItem('lista');

function limparCarrinho() {
  document.querySelector('.empty-cart').addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
  });
}

window.onload = async () => {
  await fetchProducts();
  limparCarrinho();
  localStorageGet();
};
