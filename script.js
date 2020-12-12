const loadLocalStorage = () => {
  document.querySelector('.cart__items').innerHTML = localStorage.getItem('products');
};

const saveCartIntoLocalStorage = () => {
  const cart = document.querySelector('.cart__items').innerHTML;

  localStorage.setItem('products', cart);
};

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

  saveCartIntoLocalStorage();
};

const createCartItemElement = ({ sku, name, salePrice }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);

  return li;
};

const handleLoading = () => {
  const p = document.createElement('p');
  p.className = 'loading';
  p.innerText = 'Loading...';

  return {
    start: document.body.appendChild(p),
    stop: document.body.removeChild(p),
  }
};

const listAllProducts = () => {

  handleLoading().start;

  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then(data => data.results.forEach((object) => {
      handleLoading().stop;

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

        saveCartIntoLocalStorage();
        cartTotalPrice(data.price);
      })
      .catch(err => console.error(err));
  }
});

document.querySelector('.empty-cart').addEventListener('click', () => {
  localStorage.clear();

  document.querySelector('.cart__items').innerHTML = '';
});

window.onload = function onload() {
  listAllProducts();
  loadLocalStorage();
};
