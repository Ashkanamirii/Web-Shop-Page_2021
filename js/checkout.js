
let listItem = [];
let totalPrice = 0;
let cartList = document.querySelector(".cart-list");
checkOutStorage()

function decreaseNumber(number) {
    let cartIconQ = document.getElementById("cart-q").innerText;
    document.getElementById("cart-q").innerText = cartIconQ - number;
    cartLocalStorage(listItem)
   
    if (cartIconQ - number == 0) {
      localStorage.clear()
      document.getElementById("checkout-cart").innerHTML =
        "<p> your cart has been empty again </p> ";
    }
  }
  
  function deleteItem(event) {
    let itemDelete = event.target.parentElement;
    console.log(itemDelete);
    let numberOforder = parseInt(itemDelete.querySelector("span").innerText);
    let priceOfCurrentProduct = parseFloat(
      itemDelete.querySelector("span.price").innerText
    );
   
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
    location.reload(); // kar dorostie???
  }
  
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
              <span class="pull-right total_l">Total: ${item.totalPrice}$</span>
              <a
                href="index.html"
                class="btn btn-sm btn-checkout"
                >Buy more</a>
            `;
          document.getElementById('total_price_faktor').innerText = item.totalPrice+"$"

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

                let itemfaktor = document.createElement("li");
                itemfaktor.innerHTML=`
                        <span>${item.title}</span>
                        <span> X ${item.number}</span>
                         <span>${item.price}$</span>
                `
                document.getElementById('faktor-list').appendChild(itemfaktor)
          listItem.unshift(Item);
          totalNumber += item.number
        }
      
      })
      cartList.innerHTML=""
      listItem.map((item) => cartList.appendChild(item));
      document.getElementById("cart-q").innerText =totalNumber;
  }
    
  
  }
  


// **************** VALIDATE FUNCTIONS ********************************
let url = window.location.search
let splitUrl=url.split('=')
if(splitUrl[1]=='true'){
  $('#form-register').hide()
  $('#successfull-register').show()
  $('#pay').attr('disabled',false)
  $('#pay').removeClass( "bg-dark" )
  $('#pay').text("confirm your payment")
}

// **************** VALIDATE form ********************************

 
$("#first_name").focusout(function(){
let inputId = "#firstName-error-message"
const firstname = $("#first_name").val();
checkValidInput(firstname,inputId)

});
$("#last_name").focusout(function(){
  let inputId = "#lastName-error-message"
  const lastName = $("#last_name").val();
  checkValidInput(lastName,inputId)
});

$("#street_address").focusout(function(){
  let inputId ="#address-error-message"
  checkAddress(inputId);
});
$("#phone_number").focusout(function(){
    let inputId = "#phone-error-message"
    checkPhone(inputId);
});
$("#email_address").focusout(function(){
    let inputId = "#email-error-message"
    checkEmail(inputId);
});


function checkValidInput(input , inputId){
  let regPattern = /^(?=.{1,50}$)[a-z]+(?:['_.\s][a-z]+)*$/i;
  if(input == ""){
    $(inputId).css("color","red")
    $(inputId).text("please fill out this field");
    $(inputId).show();
  }
  else if(!regPattern.test(input)){
    $(inputId).css("color","red")
    $(inputId).text("only Characters please");
    $(inputId).show();
  }else{
    $(inputId).css("color","green")
    $(inputId).text("Valid");
    $(inputId).show();
  }
}


function checkEmail(inputId) {
  let regPattern = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  let email = $("#email_address").val();
  
  if(email == ""){
    $(inputId).css("color","red")
    $(inputId).text("please fill out this field");
    $(inputId).show();
  }
  else if(!regPattern.test(email)){
    $(inputId).css("color","red")
    $(inputId).text("invalid email");
    $(inputId).show();
  }else{
    $(inputId).css("color","green")
    $(inputId).text("Valid");
    $(inputId).show();
  }
}

function checkAddress(inputId) {
  let regPattern = /^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$/;
  let address = $("#street_address").val();
  if(address == ""){
    $(inputId).css("color","red")
    $(inputId).text("please fill out this field");
    $(inputId).show();
  }
  else if(!regPattern.test(address)){
    $(inputId).css("color","red")
    $(inputId).text("invalid address");
    $(inputId).show();
  }else{
    $(inputId).css("color","green")
    $(inputId).text("Valid");
    $(inputId).show();
  }

}

function checkPhone(inputId) {
  let regPattern = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  let phoneNumber = $("#phone_number").val();
  if(phoneNumber == ""){
    $(inputId).css("color","red")
    $(inputId).text("please fill out this field");
    $(inputId).show();
  }
  else if(!regPattern.test(phoneNumber)){
    $(inputId).css("color","red")
    $(inputId).text("invalid phone number");
    $(inputId).show();
  }else{
    $(inputId).css("color","green")
    $(inputId).text("Valid");
    $(inputId).show();
  }
} 





function pay(){
$("#exampleModalCenter").modal("show");
}



function cleanCart(){
  localStorage.clear();
  location.reload();
}

