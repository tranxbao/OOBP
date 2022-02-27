

const iconQtyAction = document.querySelector('.header__icon');

//fetch all data
function fetchData() {
  fetch('../products.json')
    .then((data) => data.json())
    .then((response) => displayData(response))
    .catch((err) => console.error(err.message));
}

function getLocalStorage(description) {
  return localStorage.getItem(description)
    ? JSON.parse(localStorage.getItem(description))
    : undefined;
}

function setLocalStorage(description, article) {
  localStorage.setItem(description, JSON.stringify(article));
  if (description === 'currentCart') displayCartItems(article);
}

iconQtyAction.addEventListener('click', handlePageView);

function handlePageView() {
  const allProductsApp = document.querySelector('.allProductsApp');
  const shoppingCartApp = document.querySelector('.shoppingCartApp');
  allProductsApp.style.display = 'none';
  shoppingCartApp.style.display = 'block';
}

//start app loading all data
fetchData();



//products.js

const iconQty = document.querySelector('.header__icon--total');
const productContainer = document.querySelector('.products');
let currentCart;

// loop thorough data and display each field

function displayData(data) {
  data.items.forEach((item, index) => {
    const div = document.createElement('div');
    div.classList.add('product-item');
    div.id = item.sys.id;

    div.innerHTML = `
    <div class="product__${index + 1}">
    <h3 class="product__${index + 1}--title">${item.fields.title}</h3>
    <div class="product__${index + 1}--image">
    <img
        class="image--${index + 1}"
        src="${item.fields.image.fields.file.url}"
        alt="product ${index + 1}"
        class="product-image"
    />
    </div>
    <h5 class="product__1--price">${item.fields.desc} </h5>
    </div>
    </div>
    <h5 class="product__1--price">${item.fields.price} €</h5>
    <button class="btn add-cart">Add to Order</button>
    </div>
`;

productContainer.append(div);
});

   

  loadListeners();
  loadPreviousCart();
  loadPreviousQtyCart();
}

function loadListeners() {
  const addCartBtn = document.querySelectorAll('.add-cart');

  addCartBtn.forEach((btn) => btn.addEventListener('click', handleAddProduct));
}

function loadPreviousCart() {
  const prevCart = getLocalStorage('currentCart');
  currentCart = prevCart ? prevCart : [];
  prevCart && displayCartItems(currentCart);
}

function loadPreviousQtyCart() {
  displayCartIcon('initialState');
}

function handleAddProduct(e) {
  const price = e.target.previousElementSibling.innerText.split(' ')[0];

  displayCartIcon();
  console.log(currentCart);
  addToCart(e, price);
}

function addToCart(e, price) {
  const productCard = e.target.closest('.product-item');
  const [image, id, title] = selectElementsForCart(productCard);
  let existingItem = false;
  if (currentCart.length !== 0) {
    currentCart = currentCart.map((el) => {
      if (el.id === id) {
        existingItem = true;
        return { ...el, qty: el.qty + 1 };
      }
      return { ...el };
    });
  }
  if (!existingItem) {
    const newArticle = {
      id,
      image,
      price,
      qty: 1,
      title,
    };
    currentCart.push(newArticle);
  }
  setLocalStorage('currentCart', currentCart);
}

function displayCartIcon(type) {
  if (type !== 'initialState') {
    const currentQty = Number(iconQty.innerText) + 1;
    iconQty.innerText = currentQty;
    setLocalStorage('qtyCart', currentQty);
  } else {
    iconQty.innerText = getLocalStorage('qtyCart') || 0;
  }
};


//cart.js

const currentCartItemsContainer = document.querySelector('.item');
let totalPrice = document.querySelector('.totalPrice');
let currentPrice = [];

function selectElementsForCart(card) {
  const image = card.querySelector('img').src;
  const id = card.id;
  const title = card.querySelector('h3').innerText;

  return [image, id, title];
}

function displayCartItems(currentCart) {
  currentCartItemsContainer.innerHTML = '';

  currentPrice = [];
  currentCart.forEach((item) => {
    const currentQtyPrice = Number(item.price) * item.qty;
    currentPrice.push(currentQtyPrice);

    currentCartItemsContainer.innerHTML += `
    <div class="cartItem" id=${item.id}>
        <div class="cartInfo">
          <h3 class="product__1--title">${item.title}</h3>
          <div class="product__1--image">
            <img
              class="image--1"
              src="${item.image}"
              alt="product 1"
              class="product-image"
            />
        </div>
        <h5 class="product__1--price">${item.price} €</h5>
      </div>
      <div class="buttons-action">
        <form class="form">
          <label for="quantity">Quantity:</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            class="quantity"
            min="1"
            max="500"
            value="${item.qty}"
            autofocus
          />
        </form>
        <button class="btn add-cart deleteBtn">Delete</button>
      </div>
    </div>
    `;
  });

  totalPrice.innerText = currentPrice
    .reduce((curr, acc) => curr + acc, 0)
    .toFixed(2);

  loadCartListeners();
}

function loadCartListeners() {
  const deleteBtn = document.querySelectorAll('.deleteBtn');
  const qtyInput = document.querySelectorAll('.quantity');
  const form = document.querySelectorAll('.form');

  deleteBtn.forEach((btn) => btn.addEventListener('click', handleDelete));
  form.forEach((el) =>
    el.addEventListener('oninput', (e) => e.preventDefault(),true)
  );
  qtyInput.forEach((btn) => btn.addEventListener('change', handleChange));
}

function handleDelete(e) {
  const id = e.target.closest('.cartItem').id;
  const qty = e.target.previousElementSibling.querySelector('.quantity').value;

  const currentCart = getLocalStorage('currentCart');
  const currentQty = getLocalStorage('qtyCart');

  const filteredCart = currentCart.filter((product) => product.id !== id);
  const filteredQty = currentQty - qty;

  setLocalStorage('currentCart', filteredCart);
  setLocalStorage('qtyCart', filteredQty);
}

function handleChange(e) {
  const newQty = e.target.closest('.quantity').value;
  const id = e.target.closest('.cartItem').id;

  const currentCart = getLocalStorage('currentCart');

  const filteredCart = currentCart.map((product) =>
    product.id === id ? { ...product, qty: newQty } : { ...product }
  );

  const filteredQty = filteredCart.reduce(
    (acc, curr) => acc + Number(curr.qty),
    0
  );

  setLocalStorage('currentCart', filteredCart);
  setLocalStorage('qtyCart', filteredQty);
}

//pizzaInfo.js


