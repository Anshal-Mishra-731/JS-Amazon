export let cart = JSON.parse(localStorage.getItem('cart')) || [];
//Now the cart variable can be accessed outside the file even if it's not loaded on the HTML
//Similar code together

export function saveCart (){
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart (productId, qty){
    const existingItem = cart.find(item => item.productId === productId);
    if(existingItem){
      existingItem.quantity += qty; 
    }
    else{
      cart.push({
        productId: productId,
        quantity: qty
      })
    }

    saveCart(); 
}