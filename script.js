function saveItems() {
  const cart = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cart', cart);
}

// task4 - Carregue o carrinho de compras através do **LocalStorage** ao iniciar a página
// faço a função saveItems, const cart = document.querySelector('.cart__items').innerHTML, toda vez
// que eu clicar ele vai salvar o que tiver dentro, o que retornar daquele clique.
// e então ele salva no localstorage
// e depois eu adiciono a função saveitems na função cartItemClickListener
// assim qdo eu clico ele salva tbm
// continua no final - task4 continuação
// codeclimate reclamou, hoisting nao funcionou por isso ela ta aqui em cima do codigo.

function totalPriceCart() {
  const itemsAddToCart = document.querySelectorAll('.cart__item');
  let total = 0;
  itemsAddToCart.forEach((item) => {
    total += parseFloat(item.innerHTML.split('$')[1]);
  });
  document.querySelector('.total-price').innerHTML = Math.round(total * 100) / 100;
}

// task5. Some o valor total dos itens do carrinho de compras de forma assíncrona
// dessa maneira ficou menos complexo do q com async await - Plantão Massaki
// Cada vez que se adicionar um item ao carrinho de compras será necessário somar seus valores
// fazer um Preço Total, como no exemplo do readme-git.
// e apresentá-los na página principal do projeto. Faço uma classe <p> no html
// <p>Preço Total: $<span class="total-price"></span></p>
// como fazer a soma -> o item é uma string, "sku, name , price"
// function totalPriceCart() -> pegar cada item, quebrar a string e pegar só o numero do price.
// const itemsAddToCart=document.querySelectorAll('.cart__items') pego todos os items do cart
// me retorna em formato de array
// atraves da Hof - itemsAddToCart.forEach para poder iterar sob os elementos do array
// para cada item eu pego o innerHTML que me retorna só o texto, uma string,
// usando o .split('$'), entrega um array de todas posições do item até o $ na posição[0]
// e na posição 1 ele me entrega o número
// utilizo a parseFloat pq eu quero pegar cada item de numero com as suas virgulas
// iterando o total item a item.
// e depois adiciono as funções que estão o saveitems e no loaditems, pq dae ele mantem a soma
// qdo eu adiciono e qdo eu retiro item.
// o tofixed(2) para trabalhar o total em no máximo 2 casas após a virgula - codeclimate acusou
// então uso do MAth roud resolveu.
// codeclimate reclamou, hoisting nao funcionou por isso ela ta aqui em cima do codigo.

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// Essa função cria elemento imagem, adiciona classe item image e coloca o source.

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// cria elemento personalizado, que depende de qual elemento ele vai conter.

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// vai pega um objeto com os dados sku, name , image e vai criar um elemento e inserir os
// elementos criados e depois pelo appendchild cria e insere os itens.
// criar os itens, pegue os elementos que vao ser entregues pela API do mercado livre e colocar
// isso na section class itens no html.

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// busca span que tem uma classe item sku

function cartItemClickListener(event) {
  const parentElement = event.target.parentElement;
  parentElement.removeChild(event.target);
  saveItems();
  totalPriceCart();
}

// task 3- criar um evento quando clica em um item da lista, no caso remover o item clicado
// o event já existe e ta entregando qual o item que to clicando, adicionando.
// console.log(event.target)
// função mais ou menos com a logica da additemtocart
// vou para o elemento pai do lugar que eu cliquei, const parentElement
// que vai ser o event target elemento pai
// defino então qual child eu vou remover, quero que remova da lista o item que eu cliquei,
// event.target
// vai pro meu parentElement, e depois remove o filho, o item q eu cliquei, removechild
// independente da onde ele estiver na lista.


function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
// li.addEventListener('click', cartItemClickListener);
  return li;
}

// função para criar o carrinho de compras

function generateItemsList() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(response => response.json())
    .then((data) => {
      document.querySelector('.loading').remove();
      data.results.forEach((item) => {
        const obj = {
          sku: item.id,
          name: item.title,
          image: item.thumbnail,
        };
        document.querySelector('.items').appendChild(createProductItemElement(obj));
      });
    });
}

// task1 - função para fazer um fetch da api, que recebe uma resposta - Plantão Massaki
// essa resposta traz os intens, dados, jogados no primeiro .then
// um grupo de dados que eu transformo no .json
// depois de transformado em json, eu
// pego os dados, os results dessa data, data.results.
// acesso como objetos. O results, é um array então eu posso fazer um forEach
// com esse forEach eu rodo ele varias vezes e busco sku, name, e image
// e esses itens vao gerando a lista, baseados nessas caracteristicas daquele item
// crio o item, e esse item vai ser jogado (appendChild) numa lista que cria o elemento
// createProductitemelemnt

// task7 Adicionar um texto de "loading" durante uma requisição à API
// crio um item no html, <h2 class="loading"></h2> que tem q ser carregado e removido qdo
// termina de carregar.
// fazendo um document.queryselector('.loading) to selecionando essa classe,
// posicionado ela logo apos o carregamento da pagina pelo fetch, eu ja posso remove-la
// pelo .remove();


function addItemToCart() {
  document.querySelector('.items').addEventListener('click', (event) => {
    if (event.target.classList.contains('item__add')) {
      const parentElement = event.target.parentElement;
      const sku = getSkuFromProductItem(parentElement);
      fetch(`https://api.mercadolibre.com/items/${sku}`)
        .then(response => response.json())
        .then((data) => {
          const skuObj = {
            sku,
            name: data.title,
            salePrice: data.price,
          };
          document.querySelector('.cart__items').appendChild(createCartItemElement(skuObj));
          saveItems();
          totalPriceCart();
        });
    }
  });
}

// task2 - adicionar o produto ao carrinho de compras
// clicar em adicionar carrinho, e o evento click adicione na lista do carrinho
// quando eu clicar no botao ele pega o item e joga no ol
// itemId - Readme é o sku que to buscando.
// sei que a lista de itens, é um container com tds os items. Plantão Massaki
// eventbubbling - pego a seção inteira, se eu clicar em algum lugar da seção
// ele vai gerar um evento especifico que seja qdo cliquei no botão
// crio  uma função additemtocart, qdo eu clicar no botão,
// ele vai pegar o item que eu cliquei e vai jogar ele no ol
// document.queryselector('.items') pega todo o meu items, geral. section - class - items
// nessa seção eu coloco o eventlistener, que vai ser, qdo eu clicar, ele me entrega o event target
// entregando td q tenho no produto, imagem, titulo, botao, seja o q for
// se o meu event target class list contem uma classe chamada item__add, ele vai fazer algo.
// clico no botao item__add - Adicionar ao carrinho, com o intuito de buscar a ID desse elemento
// que tá no SKU. Da seguinte forma, clico no botao, vou pro Elemento pai, parentElement
// const parentElement pega o event targe que é o item que eu cliquei e retorna o item completo
// crio a const sku, uso a função já existente, getSkuFromProductItem, que busca a ID
// passo como elemento = item a parentElement que é o item que eu cliquei anteriormente
// ele busca dentro do elemento pai e procura dentro dele se existe algum span, class item__sku ID
// faço um fetch buscando o sku em especifico, que vai ter um response enorme, que eu transformo em
// response.json()
// então, através do data eu pego os dados, recebidos em json, crio a const skuobj
// essa const vai conter o sku, name e o salePrice, link do recebido com o buscado especificamente
// e através do documentquery para selecionar o .cart__items, faço o appendchild através da
// função já criada createCartItemElement que passo como parametro meu skuobj
// e a cada click é adicionada a lista as propriedades que passei


function loadItems() {
  const loadedCart = localStorage.getItem('cart');
  const cartList = document.querySelector('.cart__items');
  cartList.innerHTML = loadedCart;
  cartList.addEventListener('click', (event) => {
    if (event.target.classList.contains('cart__item')) {
      cartItemClickListener(event);
    }
  });
  totalPriceCart();
}

// continuação task4
// eu faço a função loadItems para que o localstorage, deixe o carrinho carregado com os itens
// selecionados anteriormente.
// eu pego a minha lista pelo documentqueryselector, onde meu innerhtml, vai ser a minha
// função loadedcart, trazendo a minha lista de itens salvos pela função SaveItens.
// qdo eu puxo o item ele perde o evento, na função createCartItemElement, já criada
// Plantão do Massaki, podendo alterar a função já criada, eu comento ela no addEvent.
// eu quero q o evento ocorra qdo eu clicar no item da lista
// windown onload. pŕimeira coisa a executar, loadItems, assim ele cria o meu evento,
// crio a const cartList que vai ter meu document.querySelector
// onde existe meu evento click, que qdo eu clicar no item ele vai executar a minha função
// cartItemclickListener(event), quando eu clico eu ele executa o evento e retorna o item q eu clic

function emptyCart() {
  document.querySelector('.empty-cart').addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
    saveItems();
    totalPriceCart();
  });
}

// task6. Botão para limpar carrinho de compras
// Crie um botão para remover todos os itens do carrinho de compras
// Ele deve, **obrigatóriamente**, ter a classe `empty-cart`.
// Para funcionalizar o botão, crio um document.query selector nessa class empty cart
// que qdo eu clicar, atraves do addeventlistener, click e a declaração da func anonima()
// executa a documentqueryslector na class cart items, os seus innerhtml serão removidos
// uso a saveitems e a totalpricecart chamando as tbm, para q qdo eu clique ele limpe e nao
// fique salvo os itens colocados somados e nem localstorage.

// invocação das funçoes na ordem especificada no onload.
window.onload = function onload() {
  loadItems();
  generateItemsList();
  addItemToCart();
  totalPriceCart();
  emptyCart();
};
