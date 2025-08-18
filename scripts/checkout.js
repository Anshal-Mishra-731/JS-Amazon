import { cart, DecreCart, cart_quantity, DelFromCart, UpdateCart, UpdateDelID } from "../data/cart.js";
import { products, loadProducts } from "../data/products.js";
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import { deliveryOptions } from "../data/deliveryoptions.js";
// External library dayjs
import '../data/back-prac.js';

//Now we will look at promises, they let us control the flow of async code. 
//First the Prmise function will start running, when it hits resolve. The Compiler simultaneously starts running the then() with the exsisting promise function, the benifit of promises is that yu can do things simultaneously.
//The problem with multiple callbacks is nesting. Very heavy nesting. Promises let us flatten our code, you can, in the then function, just return new Promise((resolve) => {}) and continue.
//1) Another thing, You can feed values into resolve, they will be parameters for the immideatly next then func.
//2) All promises: give an array of multiple promises, your func will wait for all of them to finish before moving to the next them. 
/*
promise.all([
    new promise((resolve) => {}), 
    new promise((resolve) => {})
]).then(() => {})
new Promise((resolve) => {
    loadProducts(() => {
        resolve();
        //resolve("") means returning un-identified.
    })
}).then(() => {
    renderOrderSummary();
    renderPayment();
})
*/

async function loadPage() {
    await loadProducts(); 
    renderOrderSummary();
    renderPayment();
}
/*
had it been returning a promise the await keyword would basically wait until the promise is over. and the async thing makes the whole function a promise. So you can apply "then" thing to the function directly once the function executes.
on the second line is the syntax for call-back based functions, we create a new promise. the value returned can be stored and used in the rest of our code like a normal value. 
async function loadPage() {
    const value = await new promise (() => {resolve("val")})
}
*/
loadPage();



function renderOrderSummary(){
let cartSumHTML = ``;
cart.forEach((item) => {
    const productId = item.productId;
    let matchingProduct = products.find(p => p.id === productId);

    let Date = dayjs().add(7, 'days').format('dddd, MMMM D'); 

    cartSumHTML += 
    `<div class="cart-item-container-${matchingProduct.id} item-container">
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
    </div>`;
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
        renderOrderSummary();
        renderPayment();
    }) 
})

document.querySelectorAll('.update-quantity-link').forEach((link) => {
    link.addEventListener('click', () => {
        const container = link.closest('.item-container');

        if (link.innerText.trim() === 'Update'){  
        container.querySelector('.update-quantity-link').innerHTML = `Save`; 
        container.querySelector('.quantity-label').style.display = 'none';
        container.querySelector('.js-new-quantity-input').style.display = 'inline-block';
        renderPayment();}

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
        container.querySelector('.update-quantity-link').innerHTML = `Update`;
        renderPayment();}
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
        renderOrderSummary(); 
        renderPayment();
    })
})
}
// renderOrderSummary(); 
// The rendering thing has a benifit. in the MVC model, you First geenrate HTML code, interact with the genrated page, make changes and then re-render the page in order to enforce that change.

function renderPayment(){
    let ppriceCents = 0; 
    let spriceCents = 0; 
    cart.forEach((item) => {
        const productId = item.productId;
        let matchingProduct = products.find(p => p.id === productId);
        ppriceCents += matchingProduct.priceCents * item.quantity; 
        let productOption = item.deliveryOptionsId;
        let matchingOption = deliveryOptions.find(p => p.id === productOption);
        spriceCents += matchingOption.priceCents; 
    })
    const TotalBeforeTax = ppriceCents + spriceCents; 
    const TaxCents = TotalBeforeTax * 0.1; 
    const Total = TotalBeforeTax + TaxCents; 

    let PaymentHtml = ``; 
    PaymentHtml += 
    `
        <div class="payment-summary-title">
        Order Summary
        </div>

        <div class="payment-summary-row">
        <div>Items (${cart_quantity}):</div>
        <div class="payment-summary-money">$${(ppriceCents/100).toFixed(2)}</div>
        </div>

        <div class="payment-summary-row">
        <div>Shipping &amp; handling:</div>
        <div class="payment-summary-money">$${(spriceCents/100).toFixed(2)}</div>
        </div>

        <div class="payment-summary-row subtotal-row">
        <div>Total before tax:</div>
        <div class="payment-summary-money">$${(TotalBeforeTax/100).toFixed(2)}</div>
        </div>

        <div class="payment-summary-row">
        <div>Estimated tax (10%):</div>
        <div class="payment-summary-money">$${(TaxCents/100).toFixed(2)}</div>
        </div>

        <div class="payment-summary-row total-row">
        <div>Order total:</div>
        <div class="payment-summary-money">$${(Total/100).toFixed(2)}</div>
        </div>

        <button class="place-order-button button-primary">
        Place your order
        </button>
    `
    document.querySelector('.payment-summary').innerHTML = PaymentHtml; 
}
// renderPayment();


