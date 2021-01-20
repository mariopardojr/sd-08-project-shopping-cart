function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText, id) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  id ? e.id = id : e.id = null;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const botaoComprar = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  botaoComprar.addEventListener('click', () => {
    fetch(`https://api.mercadolibre.com/items/${sku}`)
      .then(result => result.json())
      .then(data => {
        const { id, title, price } = data;
        const elementoCarrinho = createCartItemElement(
          { sku: id, name: title, salePrice: price }
        );
      })
  })


  return section;
}

const listagem = () =>
  new Promise((resolve, reject) => {
    fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
      .then(result => result.json())
      .then((data) => {
        data.results.forEach((computador) => {
          const { id, title, thumbnail } = computador;
          const elemento = createProductItemElement({ sku: id, name: title, image: thumbnail });
          const items = document.querySelector('.items');
          items.appendChild(elemento);
        });
      })
      .catch(error => reject(error));
  });

const botaoComprar = () =>
  new Promise((resolve, reject) => {
    const elementos = document.getElementsByClassName('item__sku');
    for (let i = 0; i < elementos.length; i++) {
      const idElemento = elementos[i].innerText;
      const btn = document.getElementById(`${idElemento}`);
      btn.addEventListener('click',
        fetch(`https://api.mercadolibre.com/items/${idElemento}`)
          .then(result => result.json())
          .then((data) => {
            const { id, title, price } = data;
            const elementoCarrinho = createCartItemElement(
              { sku: id, name: title, salePrice: price }
            );
            const itemsCarrinho = document.querySelector('.cart__items');
            itemsCarrinho.appendChild(elementoCarrinho);
          })
          .catch(error => reject(error))
      );
    };
  });

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

window.onload = function onload() {
  listagem();
  botaoComprar();
};
