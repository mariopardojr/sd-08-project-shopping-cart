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

const fecthProductId = (productId) => {
  fetch(`https://api.mercadolibre.com/items/${productId}`)
    .then((response) => {
      response.json().then((data) => {
        const addProduct = {
          sku: data.id,
          name: data.title,
          salePrice: data.title,
        }
        console.log(createCartItemElement(addProduct))
        return createCartItemElement(addProduct);
      });
    });
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addToCart = () => {
  document.querySelector('.items').addEventListener('click', (event) => {
    if (event.target.classList.contains('item__add')) {
      const adiciona = event.target.parentElement;
      console.log(adiciona)
      const teste = fecthProductId(adiciona)
      console.log(adiciona)
      // const selCart = querySelector('.cart__items');
      // selCart.appendChild(adiciona);
    }

  })
}

function cartItemClickListener(event) {
  //remover do carrinho
}

const fecthProduct = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => {
      response.json().then((data) => {
        data.results.map((value) => {
          const addProduct = createProductItemElement({
            sku: value.id,
            name: value.title,
            image: value.thumbnail,
          });
          return document.querySelector('.items').appendChild(addProduct);
        });
      });
    });
};

//fecthProductId('MLB1341706310');


window.onload = function onload() {
  fecthProduct();
  addToCart()
};
