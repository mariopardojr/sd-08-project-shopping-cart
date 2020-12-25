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

// async function fetchMlbItemsById(idsArr) {
//   const itemsData = idsArr.map(async id =>
//   fetch(`https://api.mercadolibre.com/items/${id}`)
//     .then(resp => resp.json())
//     .then((itemObj) => {
//       const itemData = {
//         sku: itemObj.id,
//         name: itemObj.title,
//         image: itemObj.pictures[0].url,
//         price: itemObj.price,
//       };
//       return itemData;
//     })
//     .catch(() => { throw new Error('Erro ao consutar o item por id'); }));
//   return Promise.all(itemsData);
// }

async function fetchMlbSearch(query) {
  return fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
    .then(resp => resp.json())
    .then(resp => resp.results.map(({ id, title, thumbnail, price }) => {
      const itemData = {
        sku: id,
        name: title,
        image: thumbnail,
        salePrice: price,
      };
      return itemData;
    }))
    .catch(() => { throw new Error('Erro ao fazer pesquisa por produtos'); });
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

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

async function insertDataOnDocSelector(selector) {
  try {
    const importedData = await fetchMlbSearch('computador');
    importedData.forEach((item) => {
      const newItem = createProductItemElement(item);
      newItem.querySelector('button').addEventListener('click', () => {
        const li = createCartItemElement(item);
        const cartItems = document.querySelector('.cart__items');
        cartItems.appendChild(li);
      });
      document.querySelector(selector).appendChild(newItem);
    });
  } catch (err) {
    console.log(err);
  }
}

window.onload = function onload() {
  insertDataOnDocSelector('.items');
  // fetchMlbSearch('computador');
};
