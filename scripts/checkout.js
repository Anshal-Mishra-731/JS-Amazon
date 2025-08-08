import { cart, DecreCart, cart_quantity, DelFromCart, UpdateCart, UpdateDelID } from "../data/cart.js";
import { products } from "../data/products.js";
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import { deliveryOptions } from "../data/deliveryoptions.js";

window.cart = cart; 

document.addEventListener('click', function(e) {
    if (e.target.classList.contains('delivery-option-input')) {
        const container = e.target.closest('.item-container');
        const checked = container.querySelector('.delivery-option-input:checked');
        const selectedDate = checked.dataset.deliveryDate;
        container.querySelector('.delivery-date').textContent = `Delivery date: ${selectedDate}`;; 
    }
    
})

let cartSumHTML = "";
cart.forEach((item) => {
    const productId = item.productId;
    let matchingProduct = products.find(p => p.id === productId);

    let Date = dayjs().add(7, 'days').format('dddd, MMMM D'); 

    cartSumHTML += 
    `
        <div class="cart-item-container-${matchingProduct.id} item-container">
            <div class="delivery-date">
            Delivery date: ${Date} 
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
                ${Deliveryoptions(item)}
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

function Deliveryoptions(item){
    let html = ''; 
    deliveryOptions.forEach((option, index) => {
        const today = dayjs()
        const DelDate = today.add(option.deliveryDays, 'days');
        const Datestring = DelDate.format('dddd, MMMM D');
        let Pricestring = "$" + (option.priceCents/100).toFixed(2); 
        if(Pricestring == "$0.00"){Pricestring = "FREE";}
        const isChecked = option.id === item.deliveryOptionsId ? "checked" : "";
        html +=     
        `
        <div class="delivery-option">
            <input type="radio"
            class="delivery-option-input"
            name="delivery-option-${item.productId}"
            data-product-id = "${item.productId}"
            data-delivery-id = "${index + 1}"
            data-delivery-date = "${Datestring}"
            ${isChecked}>
            <div>
            <div class="delivery-option-date" style="white-space: nowrap; margin-bottom: 3px;">
                ${Datestring}
            </div>
            <div class="delivery-option-price" style="white-space: nowrap; margin-bottom: 3px;">
                ${Pricestring} - Shipping
            </div>
        </div>
        `
    });
    return html; 
}

document.querySelectorAll('.delivery-option-input').forEach((elam) => {
    elam.addEventListener('click', () => {
        const prod = elam.dataset.productId;
        const id = elam.dataset.deliveryId;
        UpdateDelID(prod ,id); 
    })
})

