
let listItem = [];
let totalPrice = 0;
let cartList = document.querySelector(".cart-list");
getProducts();
checkOutStorage()



async function getProducts() {
  await fetch("http://webacademy.se/fakestore/")
    .then((res) => res.json())
    .then((json) => {
      pro(json);
    });
}

function pro(products) {
  let products_list = document.getElementById("products_list");

  products.forEach((element) => {
    let product = document.createElement("div");
    product.setAttribute(
      "class",
      "col-12 col-sm-6 col-md-4 single_gallery_item women wow fadeInUpBig"
    );
    // product.setAttribute("data-wow-delay", "0.2s");

    let ImgDiv = document.createElement("div");
    ImgDiv.className = "product-img";

    let img_p = document.createElement("img");
    img_p.src = element.image;

    let productQuicview = document.createElement("div");
    productQuicview.className = "product-quicview";

    let linkProduct = document.createElement("a");
    linkProduct.setAttribute("href", "#");
    linkProduct.setAttribute("data-toggle", "modal");
    linkProduct.setAttribute("data-target", "#quickview");

    let iconPlus = document.createElement("i");
    iconPlus.setAttribute("class", "ti-plus");

    let description_p = document.createElement("div");
    description_p.setAttribute("class", "product-description");

    let price_p = document.createElement("h4");
    price_p.setAttribute("class", "product-price");
    price_p.innerText = parseFloat(element.price);

    let title_p = document.createElement("p");
    title_p.innerText = element.title;

    let addToCart = document.createElement("a");
    let elementId = element.id;
    addToCart.setAttribute("id", elementId);
    addToCart.setAttribute(
      "href",
      "javascript:addproductToCart(" + elementId + ")"
    );
    addToCart.setAttribute("class", "add-to-cart-btn");
    addToCart.innerText = "ADD TO CART";

    //append
    linkProduct.appendChild(iconPlus);
    productQuicview.appendChild(linkProduct);
    ImgDiv.appendChild(img_p);
    ImgDiv.appendChild(productQuicview);

    description_p.appendChild(price_p);
    description_p.appendChild(title_p);
    description_p.appendChild(addToCart);

    product.appendChild(ImgDiv);
    product.appendChild(description_p);
    products_list.appendChild(product);
  });

  return products;
}



function increaseNumber() {
  let cartIconQ = document.getElementById("cart-q").innerText;
  document.getElementById("cart-q").innerText = ++cartIconQ;
}
/************************************************************************************ */
/************************************************************************************ */
/************************************************************************************ */
function decreaseNumber(number) {
  let cartIconQ = document.getElementById("cart-q").innerText;
  document.getElementById("cart-q").innerText = cartIconQ - number;
  cartLocalStorage(listItem)
 
  if (cartIconQ - number == 0) {
    localStorage.clear()
    totalPrice = 0;
    document.getElementById("checkout-cart").innerHTML =
      "<p> your cart has been empty again </p> ";
  }
}
/************************************************************************************ */
/************************************************************************************ */
/************************************************************************************ */
function deleteItem(event) {
  let itemDelete = event.target.parentElement;
  console.log(itemDelete);
  let numberOforder = parseInt(itemDelete.querySelector("span").innerText);
  let priceOfCurrentProduct = parseFloat(itemDelete.querySelector("span.price").innerText);
 
  let decreaseTotalPrice =  numberOforder * priceOfCurrentProduct;
  decreaseTotalPrice = decreaseTotalPrice.toFixed(2);
  
  let currentTotalText = document
    .getElementById("checkout-cart")
    .querySelector(".pull-right").innerText;
  let currentTotal = parseFloat(currentTotalText.substring(7));
  let newTotal = (currentTotal - decreaseTotalPrice).toFixed(2);
  document
    .getElementById("checkout-cart")
    .querySelector(".pull-right").innerText = "Total: " + newTotal;

  listItem.map(function (item, index) {
      if (item == itemDelete) {
        listItem.splice(index, 1);
      }
    });
  decreaseNumber(numberOforder);
  event.target.parentElement.remove();

 
}
/************************************************************************************ */
/************************************************************************************ */
/************************************************************************************ */
function addproductToCart(id) {

  increaseNumber();
  let product = document.getElementById(id).parentElement;
  let price = product.querySelector(".product-price").innerText;
  totalPrice += parseFloat(price);
  
  if (listItem.length >= 0) {
    listItem.pop();
  }

  if (document.getElementById(id + "number") == undefined) {

    let title = product.querySelector("p").innerText;
    let img = product.parentElement.querySelector("img").src;

    let Item = document.createElement("li");
    Item.style.position = "relative";
    Item.innerHTML = `
          <a href="#" class="image">
          <img
              src=${img}
              class="cart-thumb"
              alt="image"
          />
          </a>
          <div class="cart-item-desc">
            <h6><a href="#" class="title_l">${title}</a></h6>
            <p>
            <span id=${id + "number"} class="number_l">${1 + " x"} </span>
            <span class="price price_l">${price}</span>
            </p>
          </div>
          <i class="fa fa-window-close close-item" onclick="deleteItem(event)" ></i>
          `;
    listItem.unshift(Item);
  } else {
    let numberOfProduct = parseInt(
      document.getElementById(id + "number").innerHTML
    );
    ++numberOfProduct;
    document.getElementById(id + "number").innerHTML = numberOfProduct + " x";
  }
  totalPrice.toFixed(2); // kar nemikoneeeeeeeeeeee
  let checkOut = document.createElement("li");
  checkOut.setAttribute("id", "checkout-cart");
  checkOut.setAttribute("class", "total");
  checkOut.innerHTML = `
      <span class="pull-right total_l">Total: ${totalPrice}</span>
      <a
        href="checkout.html"
        class="btn btn-sm btn-checkout"
        >Checkout</a>
    `;
  listItem.push(checkOut);
  

  document.querySelector(".cart-list").innerHTML = "";
  listItem.map((item) => cartList.appendChild(item));
  cartLocalStorage(listItem)
}
/************************************************************************************ */
/************************************************************************************ */
/************************************************************************************ */
function cartLocalStorage(listItem){

  let items=[];

  listItem.forEach(function(item,index){

      let itemLS=new Object();
      if(index== (listItem.length-1) ){
        itemLS.totalPrice=item.querySelector('.total_l').innerText.substring(7)
      }
      else{
        itemLS.imgSrc=item.querySelector('img').src
        itemLS.title=item.querySelector('.title_l').innerText
        itemLS.price=item.querySelector('.price_l').innerText
        itemLS.number=parseInt(item.querySelector('.number_l').innerText)
        itemLS.id=item.querySelector('.number_l').id
      }
      items.push(itemLS);
      localStorage.setItem('items', JSON.stringify(items))
  })
  
}
/************************************************************************************ */
/************************************************************************************ */
/************************************************************************************ */
function checkOutStorage(){
  
  let totalNumber=0;
  if( localStorage.getItem('items') != null){

    let items=JSON.parse(localStorage.getItem('items'));
    items.forEach((item,index)=>{
      if( index==(items.length-1) ){
        let checkOut = document.createElement("li");
        checkOut.setAttribute("id", "checkout-cart");
        checkOut.setAttribute("class", "total");
        checkOut.innerHTML = `
            <span class="pull-right total_l">Total: ${item.totalPrice}</span>
            <a
              href="checkout.html"
              class="btn btn-sm btn-checkout"
              >Checkout</a>
          `;
        listItem.push(checkOut);
      }
      else{
        let Item = document.createElement("li");
        Item.style.position = "relative";
        Item.innerHTML = `
              <a href="#" class="image">
              <img
                  src=${item.imgSrc}
                  class="cart-thumb"
                  alt="image"
              />
              </a>
              <div class="cart-item-desc">
                <h6><a href="#" class="title_l">${item.title}</a></h6>
                <p>
                <span id=${item.id} class="number_l">${item.number + " x"} </span>
                <span class="price price_l">${item.price}</span>
                </p>
              </div>
              <i class="fa fa-window-close close-item" onclick="deleteItem(event)" ></i>
              `;
        listItem.unshift(Item);
        totalNumber += item.number
      }
    
    })
    cartList.innerHTML=""
    listItem.map((item) => cartList.appendChild(item));
    document.getElementById("cart-q").innerText =totalNumber;
}
}


