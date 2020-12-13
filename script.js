
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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

// function createCartItemElement({ sku, name, salePrice }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }

const promiseApi = (url) => {
  const results = new Promise((resolve, reject) => {
    fetch(url).then(response => response.json())
      .then(data => resolve(data))
      .catch(err => reject(err));
  });
  return results;
};

const getListIdsProduct = async () => {
  const PRODUCT = 'computador';
  const url = `https://api.mercadolibre.com/sites/MLB/search?q=${PRODUCT}`;
  const { results } = await promiseApi(url);
  const ids = results.reduce((acc, item) => {
    acc.push(item.id);
    return acc;
  }, []);
  return ids;
};

const getProductByIds = (arrayId) => {
  const results = arrayId.reduce((acc, id) => {
    const url = `https://api.mercadolibre.com/items/${id}`;
    const product = promiseApi(url);
    acc.push(product);
    return acc;
  }, []);
  return results;
};

const setProductView = async () => {
  const arrayIdsProduct = await getListIdsProduct();
  const listProduct = await getProductByIds(arrayIdsProduct);
  const results = await Promise.all(listProduct);
  console.log(results);
  const [elementContainer] = document.querySelectorAll('.items');
  elementContainer.innerText = '';
  results.forEach((product) => {
    const { id: sku, title: name, pictures: [{ secure_url: image } = picture] } = product;
    const newElProduct = createProductItemElement({ sku, name, image });
    elementContainer.appendChild(newElProduct);
  });
};

window.onload = function onload() {
  setProductView();
};
