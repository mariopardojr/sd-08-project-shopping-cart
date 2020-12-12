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

function cartItemClickListener() {
  document.querySelectorAll('.cart__item').forEach(element => element.addEventListener('click', (event) => {
    event.target.remove();
  }));
}

function limpacarrinho() {
  const pegabotao = document.querySelector('.empty-cart');
  pegabotao.addEventListener('click', () => {
    const pegaol = document.querySelectorAll('.cart__items');
    if (pegaol.length > 0) pegaol.forEach(li => li.remove());
  });
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener());
  return li;
}

function pegaidproduto(item) {
  return item.querySelector('span.item__sku').innerText;
}

const pegaINFO = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then((data) => {
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
};

const fetchProduct = (productid) => {
  fetch(`https://api.mercadolibre.com/items/${productid}`)
    .then(response => response.json())
    .then((data) => {
      const itemCart = createCartItemElement({
        sku: data.id,
        name: data.title,
        salePrice: data.price,
      });
      document.querySelector('.cart__items').appendChild(itemCart);
    });
};

const adicionarCarrinho = () => {
  document.querySelectorAll('.items').forEach(element => element.addEventListener('click', (event) => {
    const passapar = pegaidproduto(event.target.parentNode);
    fetchProduct(passapar);
  }));
};

window.onload = function onload() {
  pegaINFO();
  adicionarCarrinho();
  cartItemClickListener();
  limpacarrinho();
};
