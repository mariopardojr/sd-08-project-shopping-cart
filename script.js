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
  const btn = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  btn.addEventListener('click',itself);
  section.appendChild(btn);
  

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


const ProductsOnScr = (array) => {
  const items = document.querySelector('.items');
  array.forEach(element => items.appendChild(createProductItemElement(element)));
};


const getApi = () => new Promise((resolve, reject) => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then(response => response.json())
  .then(data => data.results)
  .then(array => array.map(product => ({
    sku: product.id,
    name: product.title,
    image: product.thumbnail,
  })))
  .then(newArray => ProductsOnScr(newArray))
  .then(results => resolve(results))
  .catch(results => reject(alert(results)));
});

//pega o id do objeto clicado
const itself = (fonte) => {
ids = fonte.target.parentNode.firstChild.innerText;
tocart(ids);
}


//cria o objeto com os parametros e chama a função que cria o item do carrinho
const tocart = () => new Promise((resolve, reject) => {
  fetch(`https://api.mercadolibre.com/items/${ids}`)
  .then(objapi => objapi.json())
  .then(objson => { return (
    { 
      sku: info.id,
      name: info.title,
      salePrice: info.salePrice
    })
})
  .then(objparam => createCartItemElement(objparam));
})




//Traz a lista da  primeira api 
window.onload = function onload() {
  getApi();
};
