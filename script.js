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

function save() {
  localStorage.setItem('carrinho', document.querySelector('ol.cart__items').innerHTML);
}
function load() {
  const storage = localStorage.getItem('carrinho');
  if (storage) {
    document.querySelector('ol.cart__items').innerHTML = storage;
  }
}

function totalItensCarrinho() {
  const lista = document.querySelectorAll('li');
  let total = 0;
  lista.forEach((element) => {
    const conteudo = element.innerText.split('$')[1];
    total += parseFloat(conteudo);
  });
  document.querySelector('.total-price').innerText = total;
}

function cartItemClickListener(event) {
  event.target.remove();
  save();
  totalItensCarrinho();
}

const productList = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador').then(
    (response) => {
      response.json().then((data) => {
        const arrayData = data.results;
        arrayData.map((produtos) => {
          const upItens = createProductItemElement({
            sku: produtos.id,
            name: produtos.title,
            image: produtos.thumbnail,
          });
          return document.querySelector('.items').appendChild(upItens);
        });
      });
      document.querySelector('.loading').remove();
    });
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const cartItens = (id) => {
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then(response => response.json())
    .then(async (data) => {
      const itemCart = createCartItemElement({
        sku: data.id,
        name: data.title,
        salePrice: data.price,
      });
      document.querySelector('.cart__items').appendChild(itemCart);
      await save();
      await totalItensCarrinho();
    });
};

const onClickButton = () => {
  document.querySelectorAll('.items').forEach(element =>
    element.addEventListener('click', (event) => {
      const theID = getSkuFromProductItem(event.target.parentNode);
      cartItens(theID);
    }));
};

const clearList = () => {
  document.querySelector('.empty-cart').addEventListener('click', () => {
    const itens = document.querySelector('.cart__items');
    while (itens.hasChildNodes()) {
      itens.removeChild(itens.firstChild);
    }
    save();
    totalItensCarrinho();
  });
};

window.onload = async function onload() {
  load();
  await productList();
  await onClickButton();
  await clearList();
  totalItensCarrinho();
};
