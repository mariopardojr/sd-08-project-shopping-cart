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

function cartItemClickListener(event) {
  const itemParent = event.target.parentNode;
  const listItem = event.target;
  return itemParent.removeChild(listItem);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addItemListener(id) {
  return fetch(`https://api.mercadolibre.com/items/${id}`).then(
    (response) => {
      response.json().then((data) => {
        const newObject = {};
        newObject.sku = data.id;
        newObject.name = data.title;
        newObject.salePrice = data.price;
        const content = createCartItemElement(newObject);
        const olContainer = document.querySelector('body > section > section.cart > ol');
        olContainer.appendChild(content);
        console.log(newObject);
        return olContainer;
      });
    });
}

const onClick = (event) => {
  const elementTarget = event.target;
  addItemListener(elementTarget.parentNode.firstChild.innerText);
};

async function getproducts(product) {
  return fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${product}`)
  .then((response) => {
    response.json()
      .then((data) => {
        data.results.map((object, index) => {
          newObject = {};
          newObject.sku = object.id;
          newObject.name = object.title;
          newObject.image = object.thumbnail;
          const content = createProductItemElement(newObject);
          const sectionItems = document.querySelector('body > section > section.items');
          sectionItems.appendChild(content);
          const btn = document.querySelectorAll('.item__add');
          btn[index].addEventListener('click', event => onClick(event));
          return newObject;
        });
      });
  });
}
// addItemListener("MLB1341706310");


function clearChart() {
  const chartList = document.querySelectorAll('.cart__item');
  chartList.forEach(element => element.parentElement.removeChild(element));
}

function clearChartEvent() {
  const emptyButton = document.querySelector('body > section > section.cart > button');
  emptyButton.addEventListener('click', clearChart);
}

window.onload = function onload() {
  getproducts('computador');
  clearChartEvent();
};

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }
