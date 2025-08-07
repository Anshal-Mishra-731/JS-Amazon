import { cart, DecreCart, cart_quantity, DelFromCart, UpdateCart } from "../data/cart.js";
import { products } from "../data/products.js";

let cartSumHTML = "";
cart.forEach((item) => {
    const productId = item.productId;
    let matchingProduct = products.find(p => p.id === productId);
    cartSumHTML += 
    `
    <div class="cart-item-container-${matchingProduct.id} item-container">
        <div class="delivery-date">
            Delivery date: Tuesday, June 21
            </div>
                <div class="cart-item-details-grid">
                    <img class="product-image"
                    src="${matchingProduct.image}">

                    <div class="cart-item-details">
                    <div class="product-name">
                        ${matchingProduct.name}
                    </div>
                    <div class="product-price">
                        $${(matchingProduct.priceCents / 100).toFixed(2)}
                    </div>
                    <div class="product-quantity">
                        <span>
                        Quantity: <span class="quantity-label">${item.quantity}</span>
                        <input class = "js-new-quantity-input" type = "number" value = "${item.quantity}" autocomplete = "off"style="width: 40px; display: none;">
                        </span>
                        <span class="update-quantity-link link-primary" data-product-id = "${matchingProduct.id}" ">
                        Update
                        </span>
                        <span class="delete-quantity-link link-primary" data-product-id = "${matchingProduct.id}" ">
                        Delete
                        </span>
                    </div>
                    </div>

                    <div class="delivery-options">
                    <div class="delivery-options-title">
                        Choose a delivery option:
                    </div>
                    <div class="delivery-option">
                        <input type="radio" checked
                        class="delivery-option-input"
                        name="delivery-option-${matchingProduct.id}">
                        <div>
                        <div class="delivery-option-date">
                            Tuesday, June 21
                        </div>
                        <div class="delivery-option-price">
                            FREE Shipping
                        </div>
                        </div>
                    </div>
                    <div class="delivery-option">
                        <input type="radio"
                        class="delivery-option-input"
                        name="delivery-option-${matchingProduct.id}">
                        <div>
                        <div class="delivery-option-date">
                            Wednesday, June 15
                        </div>
                        <div class="delivery-option-price">
                            $4.99 - Shipping
                        </div>
                        </div>
                    </div>
                    <div class="delivery-option">
                        <input type="radio"
                        class="delivery-option-input"
                        name="delivery-option-${matchingProduct.id}">
                        <div>
                        <div class="delivery-option-date">
                            Monday, June 13
                        </div>
                        <div class="delivery-option-price">
                            $9.99 - Shipping
                        </div>
                    </div>
                </div>
             </div>
         </div>
    </div>
    `;
});
document.querySelector('.order-summary').innerHTML = cartSumHTML;
document.querySelector('.return-to-home-link').innerHTML = cart_quantity;

document.querySelectorAll('.delete-quantity-link').forEach((link) => {
    link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        const matchingProduct = cart.find(item => item.productId == productId);
        DecreCart(matchingProduct.quantity);
        DelFromCart(productId);
        document.querySelector(`.cart-item-container-${productId}`).remove();
        document.querySelector('.return-to-home-link').innerHTML = cart_quantity;
    }) 
})

document.querySelectorAll('.update-quantity-link').forEach((link) => {
    link.addEventListener('click', () => {
        const container = link.closest('.item-container');

        if (link.innerText.trim() === 'Update'){  
        container.querySelector('.update-quantity-link').innerHTML = `Save`; 
        container.querySelector('.quantity-label').style.display = 'none';
        container.querySelector('.js-new-quantity-input').style.display = 'inline-block';}

        else{
        let neu_qty = parseInt(container.querySelector('.js-new-quantity-input').value);
        if(neu_qty < 1){
            alert("Not a valid value");
            container.querySelector('.quantity-label').style.display = 'inline-block';
            container.querySelector('.js-new-quantity-input').style.display = 'none';
            container.querySelector('.update-quantity-link').innerHTML = `Update`;
            return;
        }
        const productId = link.dataset.productId;
        const matchingProduct = cart.find(item => item.productId == productId);
        DecreCart(matchingProduct.quantity);
        matchingProduct.quantity = neu_qty; 
        UpdateCart(neu_qty);
        document.querySelector('.return-to-home-link').innerHTML = cart_quantity;
        container.querySelector('.quantity-label').style.display = 'inline-block';
        container.querySelector('.js-new-quantity-input').style.display = 'none';
        container.querySelector('.update-quantity-link').innerHTML = `Update`;}
    });
})
