let totalValue = parseFloat(localStorage.getItem('totalValue'));

if (!totalValue) totalValue = 0;

const createProductImageElement = (imageSource) => {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
};

const getSkuFromProductItem = item => item.querySelector('span.item__sku').innerText;

// Atualizando valores no LocalStorage
const totalValueUpdate = async (value) => {
  totalValue += value;
  const totalValueFormated = Math.round(totalValue * 100) / 100;
  const totalPrice = document.querySelector('.total-price');
  totalPrice.innerText = totalValueFormated;
  localStorage.setItem('totalValue', totalValueFormated);
};

// Removendo único item da lista
const cartItemClickListener = (event) => {
  const item = event.target;
  const itemText = item.innerText;
  const price = parseFloat(itemText.split('PRICE: $')[1]);
  item.remove();
  totalValueUpdate(-price);
  const ol = document.querySelector('.cart__items');
  localStorage.setItem('itemCartStorage', ol.innerHTML);
};

// Criando item a item dentro do carrinho
const createCartItemElement = ({ sku, name, salePrice }) => {
  const ol = document.querySelector('.cart__items');
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  ol.appendChild(li);
  totalValueUpdate(salePrice);
  localStorage.setItem('itemCartStorage', ol.innerHTML);
  li.addEventListener('click', cartItemClickListener);
  return li;
};

// Esvaziando lista do carrinho
const emptyList = () => {
  const ol = document.querySelector('.cart__items');
  ol.innerHTML = '';
  totalValue = 0;
  totalValueUpdate(0);
  localStorage.removeItem('itemCartStorage');
};

// Fazendo requisição de apenas um item pelo id
const fetchItemById = (id) => {
  const url = `https://api.mercadolibre.com/items/${id}`;
  fetch(url)
    .then(response => response.json())
    .then(data => createCartItemElement(
      { sku: data.id, name: data.title, salePrice: data.price }));
};

const getItemToCart = (event) => {
  const item = (event.target).parentElement;
  const id = getSkuFromProductItem(item);
  fetchItemById(id);
};

const createCustomElement = (element, className, innerText) => {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (element === 'button') {
    e.addEventListener('click', getItemToCart);
  }
  return e;
};

// Criando itens na lista e renderizando
const createProductItemElement = ({ sku, name, image }) => {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
};

// Armazenando itens para depois renderizar
const totalResults = (results) => {
  results.forEach((result) => {
    const product = { sku: result.id, name: result.title, image: result.thumbnail };
    const itemProduct = document.querySelector('.items');
    itemProduct.appendChild(createProductItemElement(product));
  });
};

// Fazendo requisição de todos os produtos
const resultFetch = (url) => {
  const section = document.querySelector('.items');
  const h4 = document.querySelector('.load');

  fetch(url)
    .then(response => response.json())
    .then((data) => {
      section.removeChild(h4);
      totalResults(data.results);
    });
};

window.onload = function onload() {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computadores';
  resultFetch(url);
  // Adicionando evento ao botão de esvaziar o carrinho
  document.querySelector('.empty-cart').addEventListener('click', emptyList);
  //  Adicionando evento remover em cada item da lista
  const ol = document.querySelector('.cart__items');
  ol.innerHTML = localStorage.getItem('itemCartStorage');
  for (let i = 0; i < ol.children.length; i += 1) {
    ol.children[i].addEventListener('click', cartItemClickListener);
  }
  totalValueUpdate(0);
};
