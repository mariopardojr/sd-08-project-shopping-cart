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

}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener());
  return li;
}

/* const productList = () => {       // pega informacao da api com id computador converte pra objeto json faz um array e da append
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador').then(
    (response) => {
      response.json().then((data) => {
        const arrayData = data.results;
        arrayData.map((produtos) => {
          const upItens = createProductItemElement({
            sku: produtos.id,
            name: produtos.title,
            image: produtos.thumbnail,
          });
          return document.querySelector('.items').appendChild(upItens);
        });
      });
    });
}; */

/* const cartItens = (id) => {
  fetch(`https://api.mercadolibre.com/items/${id}`)  //pega a informacao do id e coloca dentro do espaço do carrinho
    .then(response => response.json())
    .then((data) => {
      const itemCart = createCartItemElement({
        sku: data.id,
        name: data.title,
        salePrice: data.price,
      });
      document.querySelector('.cart__items').appendChild(itemCart);
    });
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText; //pega o texto do botao clicado */
/* 

const onClickButton = () => {
  document.querySelectorAll('.items').forEach(element =>   //adiciona event listener pra cada botao
    element.addEventListener('click', (event) => {
      const theID = getSkuFromProductItem(event.target.parentNode);
      cartItens(theID);
    }));
};
 */
function pegaidproduto(item) {
  return item.querySelector('span.item__sku').innerText;
}

const pegaINFO = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then(data => {
      const arrayData = data.results;
      arrayData.map((produtos) => {
        const upItens = createProductItemElement({
          sku: produtos.id,
          name: produtos.title,
          image: produtos.thumbnail,
        });
        return document.querySelector('.items').appendChild(upItens);
      });
    })
}

const adicionarCarrinho = () => {
  document.querySelectorAll(".items").forEach(element => element.addEventListener("click", event => {
    const passapar = pegaidproduto(event.target.parentNode);
    fetchProduct(passapar)
  }))
}

const fetchProduct = (productid) => {
  fetch(`https://api.mercadolibre.com/items/${productid}`)
}


window.onload = function onload() {
  pegaINFO();
  adicionarCarrinho();
};
