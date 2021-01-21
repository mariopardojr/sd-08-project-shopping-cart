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
      document
        .querySelectorAll('.item')
        .forEach(i => i.classList.remove('hidden'));
    }, 500);
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
  document.getElementById(
    'cart_sum2',
  ).innerHTML = `Total: R$ ${data.sum.toFixed(2)}`;
};

const saveCart = () => {
  localStorage.setItem(
    'card',
    document.getElementById('cart__items_list').innerHTML,
  );
};

const cartItemClickListener = event => {
  event.target.remove();
  saveCart();
  calcPrice();
};

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

const createProductImageElement = sku => {
  const img = document.createElement('img');
  img.className = 'item__image';
  /* eslint-disable */
  fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then((response) => response.json())
    .then((data) => data.pictures.map((i) => i.url))
    .then((imageList) => {
      img.src = imageList;
    });
  /* eslint-enable */
  //
  return img;
};

const createCustomElement = (element, className, innerText) => {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
};

const createCartItemElement = ({ sku, name, salePrice }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
};

const createProductButtonElement = (element, className, innerText, sku) => {
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
      })
      .catch(() => {
        saveCart();
        calcPrice();
      });
  });
  return e;
};

const createProductItemElement = ({ sku, name }) => {
  const section = document.createElement('section');
  section.className = 'item hidden';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(sku));
  section.appendChild(
    createProductButtonElement(
      'button',
      'item__add',
      'Adicionar ao carrinho!',
      sku,
    ),
  );
  return section;
};

const fetchProducts = async () => {
  loading.start();
  const items = document.querySelector('.items');
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then(data => data.results.map(p => [p.id, p.title]))
    .then(products => {
      products.forEach(product => {
        const [sku, name] = product;
        items.appendChild(createProductItemElement({ sku, name }));
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
