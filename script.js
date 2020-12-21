window.onload = function onload() { 
  criaItens();
  document.body.addEventListener('click', async event => {
    if(event.target.matches('.item__add')){
      const parent = event.target.parentNode;
      const id = getSkuFromProductItem(parent);
      const { id: sku, title: name, price: salePrice} = await pegaItem(id)
      const cartItems = document.querySelector('.cart__items');
      cartItems.appendChild(createCartItemElement({sku, title, price}))
    }
  })
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
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function criaItens(){
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then(data => {
      const results = data.results;
      const itemsContainer = document.querySelector('.items');
      results.forEach(item => {
        const { id: sku, title: name, thumbnail: image} = item;
        itemsContainer.appendChild(createProductItemElement({sku, name, image }));
  })
});
}

function pegaItem(id){
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then(response => response.json())
    .then(data => console.log(data));
}