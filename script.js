const createProductImageElement = (imageSource) => {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;

  return img;
};

const createCustomElement = (element, className, innerText) => {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;

  return e;
};

const createProductItemElement = ({ sku, name, image }) => {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__name', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
};

const getSkuFromProductItem = item => item.querySelector('span.item__sku').innerText;

const cartItemClickListener = (event) => {
  if (event.target.classList.contains('cart__item')) {
    document.querySelector('.cart__items').removeChild(event.target);
  }
};

const createCartItemElement = ({ sku, name, salePrice }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);

  return li;
};

const listAllProducts = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then(data => data.results.forEach((object) => {
      const item = {
        sku: object.id,
        name: object.title,
        image: object.thumbnail,
      };

      const product = createProductItemElement(item);

      document.querySelector('.items').appendChild(product);
    }))
    .catch(err => console.error(err));
};

document.querySelector('.items').addEventListener('click', (event) => {
  if (event.target.classList.contains('item__add')) {
    const id = getSkuFromProductItem(event.target.parentElement);

    fetch(`https://api.mercadolibre.com/items/${id}`)
      .then(response => response.json())
      .then((data) => {
        const product = {
          sku: id,
          name: data.title,
          salePrice: data.price,
        };

        document.querySelector('.cart__items').appendChild(createCartItemElement(product));
      })
      .catch(err => console.error(err));
  }
});

window.onload = function onload() {
  listAllProducts();
};
