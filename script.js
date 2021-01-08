function salvar() {
  const salvados = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('carrinho', salvados);
}
function precoTotal() {
  const preco = document.querySelectorAll('.cart__item');
  let total = 0;
  preco.forEach((item) => {
    total += parseFloat(item.innerHTML.split('$')[1]);
  });
  document.querySelector('.total-price').innerHTML = total;
}


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

function cartItemClickListener(event) {
  const remover = event.target.parentElement;
  remover.removeChild(event.target);
  salvar();
  precoTotal();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
function gerarProdutos() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then((data) => {
      document.querySelector('.loading').remove();
      data.results.forEach(({ id, title, thumbnail }) => {
        const obj = {
          sku: id,
          name: title,
          image: thumbnail,
        };
        document.querySelector('.items').appendChild(createProductItemElement(obj));
      });
    },
    );
}
function colocarCarrinho() {
  document.querySelector('.items').addEventListener('click', (event) => {
    const item = getSkuFromProductItem(event.target.parentElement);
    fetch(`https://api.mercadolibre.com/items/${item}`)
      .then(response => response.json())
      .then((data) => {
        const datas = {
          sku: data.id,
          name: data.title,
          salePrice: data.price,
        };
        document.querySelector('.cart__items').appendChild(createCartItemElement(datas));
        salvar();
        precoTotal();
      });
  });
}
function limpar() {
  const botao = document.querySelector('.empty-cart');
  botao.addEventListener('click', function () {
    const limparItem = document.querySelector('.cart__items');
    limparItem.innerHTML = '';
    precoTotal();
  });
}


window.onload = function onload() {
  gerarProdutos('computador');
  colocarCarrinho();
  limpar();
};
