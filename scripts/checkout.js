import { cart,removeFromCart , updateDeliveryOption} from "../data/cart.js";
import { products } from "../data/products.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import { deliveryOptions } from "../data/deliveryOptions.js";

let cartSummaryHTML = '';
cart.forEach((cartItem) => {
    const productId = cartItem.productId;

    let matchingProduct;

    products.forEach((product) => {

        if(product.id === productId){
            matchingProduct = product;
        }
    });

  const deliveryOptionId = cartItem.
                            deliveryOptionId;
  
  let  deliveryOption;

  deliveryOptions.forEach((option)=>{
    if (option.id === deliveryOptionId){
      deliveryOption = option;
    }
  });                         

  const today = dayjs();
    const deliveyDate = today.add(
      deliveryOption.deliveyDays,
      'days'
    );
    const dateString = deliveyDate.format(
      'dddd, MMMM D'
    );

cartSummaryHTML += `
    <div class="cart-item-container 
                js-cart-item-container-${matchingProduct.id}">
            <div class="delivery-date">
              Delivery date: ${dateString}
            </div>

            <div class="cart-item-details-grid">
              <img class="product-image"
                src="${matchingProduct.image}">

              <div class="cart-item-details">
                <div class="product-name">
                  ${matchingProduct.name}
                </div>
                <div class="product-price">
                  $${matchingProduct.priceCents / 100}
                </div>
                <div class="product-quantity">
                  <span>
                    Quantity: <span class="quantity-label">${cartItem.quantity}</span>
                  </span>
                  <span class="update-quantity-link link-primary">
                    Update
                  </span>
                  <span class="delete-quantity-link link-primary js-delete-link" data-product-id = "${matchingProduct.id}">
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
              </div>
              ${deliveryOptionsHTML(matchingProduct,cartItem)}
              </div>
            </div>
          </div>
    `;
});

function deliveryOptionsHTML(matchingProduct,cartItem){
  let html = '';
  deliveryOptions.forEach((deliveryOption)=>{
    const today = dayjs();
    const deliveyDate = today.add(
      deliveryOption.deliveyDays,
      'days'
    );
    const dateString = deliveyDate.format(
      'dddd, MMMM D'
    );
    const priceString = deliveryOption
    .priceCents===0 ? 'FREE' : `${((deliveryOption.priceCents)/100).toFixed(2)} `;

    const isChecked = deliveryOption.id === 
    cartItem.deliveryOptionId;

    html += `

   <div class="delivery-option js-delivery-option"
    data-product-id="${matchingProduct.id}"
    data-delivery-option-id="${deliveryOption.id}">
    <input type="radio"
      ${isChecked ? 'checked' : ''}
      class="delivery-option-input"
      name="delivery-option-${matchingProduct.id}">
    <div>
      <div class="delivery-option-date">
        ${dateString}
      </div>
      <div class="delivery-option-price">
        ${priceString} Shipping
      </div>
    </div>
  </div>
  `
  });
  return html;
}

document.querySelector('.js-order-summary')
.innerHTML = cartSummaryHTML;

document.querySelectorAll('.js-delete-link')
.forEach((link) => {
  link.addEventListener('click',() =>{
    const productId = link.dataset.productId;
    removeFromCart(productId);


    const container = document.querySelector(
      `.js-cart-item-container-${productId}`
    );
    container.remove();
    updateCartQuantity();
  });
})


function updateCartQuantity(){
  let cartQuantity = 0;

cart.forEach((cartItem) => {
  cartQuantity += cartItem.quantity;
});

document.querySelector('.js-return-to-home-link')
  .innerHTML = `${cartQuantity} items`;

}
updateCartQuantity();

document.querySelectorAll('.js-delivery-option')
.forEach((element)=>{
  element.addEventListener('click',()=>{
    const productId = element.dataset.productId;
    const deliveryOptionId = element.dataset.deliveryOptionId;
    updateDeliveryOption(productId,deliveryOptionId);
  })
});