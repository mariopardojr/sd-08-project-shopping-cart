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

function save() {
  const cartList = document.getElementsByClassName('cart__item');
  const cartListToStorage = [];
  for (let index = 0; index < cartList.length; index += 1) {
    cartListToStorage.push(cartList[index].innerHTML);
  }
  // const cartListToStorage = cartList.map((element, index) => element[index].innerText);
  // console.log(cartListToStorage);
  // console.log(cartList)
  localStorage.setItem('cartItems', JSON.stringify(cartListToStorage));
}

// async function sumPrice(price, result) {
async function sumPrice() {
  // const total = (result + price).toFixed(2)
  // const element = document.querySelector("body > section > section.cart > div > p");
  // element.innerHTML = `R$ ${total}`
  const listItems = document.querySelectorAll('.cart__item');
  let total = 0;
  listItems.forEach((element) => {
    total += parseFloat(element.innerHTML.slice(element.innerHTML.indexOf('$') + 1, element.innerHTML.length));
    total = parseFloat(total.toFixed(2));
  });
  const containerPrice = document.querySelector('body > section > section.cart > div > p');
  containerPrice.innerHTML = `R$ ${total}`;
}

function cartItemClickListener(event) {
  const itemParent = event.target.parentNode;
  const listItem = event.target;
  itemParent.removeChild(listItem);
  sumPrice();
  save();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function load() {
  const cartItemsSaved = JSON.parse(localStorage.getItem('cartItems'));
  console.log(cartItemsSaved);
  return cartItemsSaved.forEach((element) => {
    const olContainer = document.querySelector('body > section > section.cart > ol');
    const li = document.createElement('li');
    li.className = 'cart__item';
    li.innerText = element;
    li.addEventListener('click', cartItemClickListener);
    olContainer.appendChild(li);
  });
}

// function parsefloat() {
//   const element = document.querySelector("body > section > section.cart > div > p");
//   // console.log(parseFloat(element.innerHTML.slice(3, 7)))
//   return parseFloat(element.innerHTML.slice(3, element.innerHTML.length))
// }

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
        // console.log(newObject);
        // const result = parsefloat();
        // sumPrice(data.price, result)
        sumPrice();
        save();
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
        load();
        sumPrice();
      });
  });
}
// addItemListener("MLB1341706310");


function clearChart() {
  const chartList = document.querySelectorAll('.cart__item');
  chartList.forEach(element => element.parentElement.removeChild(element));
  save();
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
