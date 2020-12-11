window.onload = function onload() { getProducts() };


  const getProducts = async () => {
    try {
    const result = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
    const data = await result.json();
    const products = data.results;
    products = products.map((item) => {
     const { title: name, thumbnail: image, id: sku } = item;
        const things = document.querySelector('.items');
        const add = createProductItemElement({ sku, name, image });
     things.appendChild(add);
        return products;
  });
  } catch (error) {
    console.log(error);
    }
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
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
