const loading = {
  start: () => {
    const e = document.createElement('div');
    e.className = 'loading';
    e.innerText = 'Carregando...';
    document.querySelector('.items').appendChild(e);
  },
  finish: () => {
    setTimeout(() => {
      document.querySelector('.loading').remove();
      // document.querySelectorAll('.item').forEach(i => i.classList.remove('hidden'));
    }, 1000);
  },
};

const calcPrice = () => {
  const list = document.querySelectorAll('.cart__item');
  const data = {
    sum: 0,
  };
  list.forEach(item => {
    const arr = item.innerHTML.split('PRICE: $');
    // console.log(arr[arr.length - 1]);
    const price = arr[arr.length - 1];
    data.sum += parseFloat(price);
  });
  // data.sum = data.sum.toFixed(2);
  document.getElementById('cart_sum').innerHTML = `${data.sum}`;
};

const saveCart = () => {
  localStorage.setItem(
    'card',
    document.getElementById('cart__items_list').innerHTML,
  );
};

function cartItemClickListener(event) {
  event.target.remove();
  saveCart();
  calcPrice();
}

const loadCart = () => {
  if (localStorage.getItem('card')) {
    document.getElementById(
      'cart__items_list',
    ).innerHTML = localStorage.getItem('card');
  }
  const list = document.querySelectorAll('.cart__item');
  list.forEach(item => {
    item.addEventListener('click', cartItemClickListener);
  });
  calcPrice();
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

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function createProductButtonElement(element, className, innerText, sku) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  e.addEventListener('click', () => {
    fetch(`https://api.mercadolibre.com/items/${sku}`)
      .then(response => response.json())
      .then(data => {
        const { id, title, price } = data;
        return { sku: id, name: title, salePrice: price };
      })
      .then(productDetails => {
        const cart = document.querySelector('.cart__items');
        cart.appendChild(createCartItemElement(productDetails));
        saveCart();
        calcPrice();
      });
  });
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(
    createProductButtonElement(
      'button',
      'item__add',
      'Adicionar ao carrinho!',
      sku,
    ),
  );
  return section;
}

const fetchProducts = () => {
  loading.start();
  const items = document.querySelector('.items');
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then(data => data.results.map(p => [p.id, p.title, p.thumbnail]))
    .then(products => {
      products.forEach(product => {
        const [sku, name, image] = product;
        items.appendChild(createProductItemElement({ sku, name, image }));
      });
    })
    .then(loading.finish());
};

document.getElementById('btnclearcart').addEventListener('click', () => {
  document.querySelectorAll('.cart__item').forEach(item => {
    item.remove();
  });
  saveCart();
  calcPrice();
});

window.onload = function onload() {
  fetchProducts();
  loadCart();
  calcPrice();
};
