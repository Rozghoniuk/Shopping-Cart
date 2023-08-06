// ------------Open Basket-----------

let openBasketBtn = document.querySelector(".cart");
let windowBasket = document.querySelector(".basket");
let closeBasketBtn = document.querySelector(".close");
let basketBackground = document.querySelector(".basket_background");
let counter = document.querySelector('figure');

openBasketBtn.addEventListener("click", openBasket)

closeBasketBtn.addEventListener('click', () => { 
  windowBasket.classList.remove("active");
  document.body.style.overflow = "";
  basketBackground.classList.remove("active");
})

function openBasket() { 
  windowBasket.classList.add("active");
  document.body.style.overflow = "hidden";
  basketBackground.classList.add("active");
}

function updateCounter() {
  if (arr.length > 0) {
    counter.style.display = 'block';
    counter.innerText = arr.length;
  } else { 
    counter.style.display = 'none';
  }
}

// -----------------Product List------------------

function getProductList() {
  let request = new XMLHttpRequest();
  request.open("GET", "https://run.mocky.io/v3/e2fccc20-178f-4206-a8ce-52e5853363b2");
  request.send();
  request.addEventListener('load', () => { 
    if (request.status = 200) {
      productsList = JSON.parse(request.response);
      renderProductList();
    }
  })
}


let productsList = [];
let productsListElement = document.querySelector('.grid');


function renderProductList() {
  productsListElement.innerHTML = "";
  let template = "";

  productsList.forEach((el) => {
    template += `<div class="product_card" data-key="${el.id}">
            <img src=${el.img} alt=${el.alt} />
            <p>${el.title}</p>
            <div class="product_card-price"><span>${el.price}</span>грн</div>
            ${!arr.find(obj => obj.id === el.id) ? "<button>Купити</button>" : "<button class='active'>В кошику</button>"}            
          </div>`
  });

  productsListElement.innerHTML = template;
}




function addTobasket(button, key) {
  
  if (!arr.find(obj => obj.id === key)) {
    let object = productsList.find(obj => obj.id === key);
    arr.push({ ...object, quantity: 1 });
    button.classList.add("active");
    button.innerText = "В кошику";
    renderBasket();
    calcTotalPrice();
    updateCounter();
  } else {
    openBasket();
  }
  
};

productsListElement.addEventListener('click', (e) => { 
  if (e.target.matches("button")) { 
    let productCard = e.target.closest('.product_card');
    addTobasket(e.target, +productCard.dataset.key);
  }
})



// -------------Basket-------------

let arr = [];


let basketProduct = document.querySelector(".basket_product")
let totalPrice = document.querySelector('.total_price span')
let total;
let emptyBasket = document.createElement("div");
emptyBasket.innerText = "Ваша корзина пуста";
basketProduct.append(emptyBasket);

function renderBasket() {
  basketProduct.innerHTML = "";
  let template = "";
  
  arr.forEach((el, i) => {
    template += `<div class="basket_product-item" data-price=${el.price} data-key=${el.id}>
            <img src=${el.img} alt=${el.alt} />
            <p>${el.title}</p>
            <div class="item_quantity">
              <button class="decr" data-action="minus">-</button>
              <span>${el.quantity}</span>
              <button class="incr" data-action="plus">+</button>
            </div>
            <div class="price"><span>${el.price}</span>грн</div>
            <button class="del"></button>
          </div>`
  });
  basketProduct.innerHTML = template;
}


function calcTotalPrice() {
  total = 0;
  let cardsProduct = document.querySelectorAll(".basket_product-item")
  cardsProduct.forEach((el) => {
    let price = +el.querySelector(".price span").innerText;
    total+=price
  })
  totalPrice.innerText = total.toFixed(2)
  saveData();
}

function changeQuantity(product, action, price, key) {
  console.log(product);
  let quantityEl = product.querySelector(".item_quantity span")
  let priceEl = product.querySelector(".price span")
  let quantity = +quantityEl.innerText
  if (action === "plus") {
    quantity++;
  } else { 
    quantity = Math.max(1, quantity-1);
  }
  arr.forEach(obj => obj.id === key ? obj.quantity = quantity : null);
  quantityEl.innerText = quantity;
  priceEl.innerText = (price * quantity).toFixed(2)
  calcTotalPrice();
}

function removeCardProduct(product, key) {
  let index = arr.findIndex(obj => obj.id === key);
  arr.splice(index, 1);
  product.remove();
  calcTotalPrice();
  if (arr.length === 0) { 
    basketProduct.append(emptyBasket);
  }
  renderProductList();
  updateCounter();
}

  
function saveData() { 
  localStorage.setItem("basket", JSON.stringify(arr));
}
function getData(){
  let data = JSON.parse(localStorage.getItem("basket"));
  if (data && data.length>0) { 
    arr = data;
    renderBasket();
    calcTotalPrice();
  }
}
// localStorage.removeItem("basket");
getData();

basketProduct.addEventListener("click", (e) => {
  if (e.target.matches("button:not(.del)")) {
    let product = e.target.closest(".basket_product-item");
    changeQuantity(product, e.target.dataset.action, +product.dataset.price, +product.dataset.key);
  } else if (e.target.matches(".del")) { 
    let product = e.target.closest(".basket_product-item");
    removeCardProduct(product, +product.dataset.key);
  }
});
getProductList();
updateCounter();