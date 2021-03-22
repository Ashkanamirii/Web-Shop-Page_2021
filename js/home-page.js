
let listItem = [];
let totalPrice = 0;
let cartList = document.querySelector(".cart-list");
getProducts();
checkOutStorage()



async function getProducts() {
  await fetch("https://webacademy.se/fakestore/")
    .then((res) => res.json())
    .then((json) => {
      pro(json);
    });
}

function pro(products) {
  let products_list = document.getElementById("products_list");

  products.forEach((element) => {
    let elementId = element.id;
    let ptest = element.id;
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
    linkProduct.setAttribute("href", "javascript:productDetails("+ptest+")");
     linkProduct.setAttribute("data-toggle", "modal");
     linkProduct.setAttribute("data-target", "#quickview");

    let iconPlus = document.createElement("i");
    iconPlus.setAttribute("class", "ti-plus");

    let description_p = document.createElement("div");
    description_p.setAttribute("class", "product-description");

    let price_p = document.createElement("h4");
    price_p.setAttribute("class", "product-price");
    price_p.innerText = ""+element.price+"$";

    let title_p = document.createElement("p");
    title_p.innerText = element.title;

    let addToCart = document.createElement("a");
    
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

  let checkOut = document.createElement("li");
  checkOut.setAttribute("id", "checkout-cart");
  checkOut.setAttribute("class", "total");
  checkOut.innerHTML = `
      <span class="pull-right total_l">Total: ${totalPrice.toFixed(2)}</span>
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





function productDetails(id){
  console.log(id)

}

$('[data-toggle="modal"]').on('click', function (e) {

  console.log("e");
  // convert target (e.g. the button) to jquery object
  var $target = $(e.target);
  // modal targeted by the button
  var modalSelector = $target.data('target');
  
  // iterate over each possible data-* attribute
  ATTRIBUTES.forEach(function (attributeName) {
    // retrieve the dom element corresponding to current attribute
    var $modalAttribute = $(modalSelector + ' #modal-' + attributeName);
    var dataValue = $target.data(attributeName);
    
    // if the attribute value is empty, $target.data() will return undefined.
    // In JS boolean expressions return operands and are not coerced into
    // booleans. That way is dataValue is undefined, the left part of the following
    // Boolean expression evaluate to false and the empty string will be returned
    $modalAttribute.text(dataValue || '');
  });
});


// `
// <div
//         class="modal fade"
//         id="quickview"
//         tabindex="-1"
//         role="dialog"
//         aria-labelledby="quickview"
//         aria-hidden="true"
//       >
//         <div
//           class="modal-dialog modal-lg modal-dialog-centered"
//           role="document"
//         >
//           <div class="modal-content">
//             <button
//               type="button"
//               class="close btn"
//               data-dismiss="modal"
//               aria-label="Close"
//             >
//               <span aria-hidden="true">&times;</span>
//             </button>

//             <div class="modal-body">
//               <div class="quickview_body">
//                 <div class="container">
//                   <div class="row">
//                     <div class="col-12 col-lg-5">
//                       <div class="quickview_pro_img">
//                         <img src=${image} />
//                       </div>
//                     </div>
//                     <div class="col-12 col-lg-7">
//                       <div class="quickview_pro_des">
//                         <h4 class="title">${title}</h4>
//                         <div class="top_seller_product_rating mb-15">
//                           <i class="fa fa-star" aria-hidden="true"></i>
//                           <i class="fa fa-star" aria-hidden="true"></i>
//                           <i class="fa fa-star" aria-hidden="true"></i>
//                           <i class="fa fa-star" aria-hidden="true"></i>
//                           <i class="fa fa-star" aria-hidden="true"></i>
//                         </div>
//                         <h5 class="price">$${price}<span>$${price+10}</span></h5>
//                         <p>
//                         ${description_p}
//                         </p>
//                         <a href="#">View Full Product Details</a>
//                       </div>
//                       <!-- Add to Cart Form -->
//                       <form class="cart" method="post">
//                         <div class="quantity">
//                           <span
//                             class="qty-minus"
//                             onclick="var effect =
//                             document.getElementById('qty');
//                              var qty = effect.value; 
//                              if( !isNaN( qty ) && qty== 1 ) 
//                              effect.value--;return false;"
//                             ><i class="fa fa-minus" aria-hidden="true"></i
//                           ></span>

//                           <input
//                             type="number"
//                             class="qty-text"
//                             id="qty"
//                             step="1"
//                             min="1"
//                             max="12"
//                             name="quantity"
//                             value="1"
//                           />

//                           <span
//                             class="qty-plus"
//                             onclick="var effect = document.getElementById('qty'); 
//                             var qty = effect.value; 
//                             if( !isNaN( qty )) effect.value++;
//                             return false;"
//                             ><i class="fa fa-plus" aria-hidden="true"></i
//                           ></span>
//                         </div>
//                         <button
//                           type="submit"
//                           name="addtocart"
//                           value="5"
//                           class="cart-submit"
//                         >
//                           Add to cart
//                         </button>
//                         <!-- Wishlist -->
//                         <div class="modal_pro_wishlist">
//                           <a href="wishlist.html" target="_blank"
//                             ><i class="ti-heart"></i
//                           ></a>
//                         </div>
//                         <!-- Compare -->
//                         <div class="modal_pro_compare">
//                           <a href="compare.html" target="_blank"
//                             ><i class="ti-stats-up"></i
//                           ></a>
//                         </div>
//                       </form>

//                       <div class="share_wf mt-30">
//                         <p>Share With Friend</p>
//                         <div class="_icon">
//                           <a href="#"
//                             ><i class="fa fa-facebook" aria-hidden="true"></i
//                           ></a>
//                           <a href="#"
//                             ><i class="fa fa-twitter" aria-hidden="true"></i
//                           ></a>
//                           <a href="#"
//                             ><i class="fa fa-pinterest" aria-hidden="true"></i
//                           ></a>
//                           <a href="#"
//                             ><i class="fa fa-google-plus" aria-hidden="true"></i
//                           ></a>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
// `

