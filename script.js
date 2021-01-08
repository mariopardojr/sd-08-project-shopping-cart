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

function cartItemClickListener(event) {
  //  aqui deletamos os li ao clicar neles
  const toDel = event.target.parentNode;
  toDel.removeChild(event.target);
}
//  aqui deletamos os intens do carrinho
function cartClear() {
  document.querySelector('.cart__items').innerHTML = '';
  document.querySelectorAll('.cart__item').innerText = '';
  document.querySelector('.total-price').innerText = '0';
}

//  pega o id do item
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

//  calculaitens no carinho
const calcTotalPrice = async (value) => {
  const totalPrice = document.querySelector('.total-price');
  const actualPrice = parseFloat(totalPrice.innerText);
  const newPrice = parseFloat(actualPrice + parseFloat(value));
  console.log(newPrice);
  totalPrice.innerText = `${newPrice}`;
};

//  cria os itens do carrinho
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  const itemsCart = document.querySelector('.cart__items');
  itemsCart.appendChild(li);
  calcTotalPrice(`${salePrice}`);
  return li;
}

//  cria o objeto com os parametros e chama a função que cria o item do carrinho
const tocart = async (event) => {
  //  tambem adiciona evento do BTN. limpa carrinho
  const delAll = document.querySelector('.empty-cart');
  delAll.addEventListener('click', cartClear);

  const ids = getSkuFromProductItem(event.target.parentNode);
  fetch(`https://api.mercadolibre.com/items/${ids}`)
    .then(objapi => objapi.json())
    .then(objson =>
      ({
        sku: objson.id,
        name: objson.title,
        salePrice: objson.price,
      })
    )
    .then(objparam => createCartItemElement(objparam))
};
//  recebe os parametros e cria elementos
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const btn = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  btn.addEventListener('click', tocart);
  section.appendChild(btn);
  return section;
}

//  povoa com os elementos
const ProductsOnScr = (array) => {
  const items = document.querySelector('.items');
  array.forEach(element => items.appendChild(createProductItemElement(element)));
};
//  pega dados no api e repassa
const getApi = () => new Promise((resolve, reject) => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then(data => data.results)
    .then(array => array.map(product => ({
      sku: product.id,
      name: product.title,
      image: product.thumbnail,
    })))
    .then(newArray => ProductsOnScr(newArray))
    .then(results => resolve(results))
    .catch(results => reject(alert(results)));
});
//  chama  a lista da  primeira api ao carregar a pagina
window.onload = function onload() {
  getApi();
};
