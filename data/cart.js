export let cart = JSON.parse(localStorage.getItem('cart')) || [];
//Now the cart variable can be accessed outside the file even if it's not loaded on the HTML
//Similar code together

export function saveCart (){
  localStorage.setItem('cart', JSON.stringify(cart));
}
export let cart_quantity = JSON.parse(localStorage.getItem('cartQ')) || 0;
export function UpdateCart(qty){
  cart_quantity += qty; 
  localStorage.setItem('cartQ', JSON.stringify(cart_quantity));
}
export function DecreCart(qty){
  cart_quantity -= qty;
  localStorage.setItem('cartQ', JSON.stringify(cart_quantity));
}


export function addToCart (productId, qty){
    const existingItem = cart.find(item => item.productId === productId);
    if(existingItem){
      existingItem.quantity += qty; 
    }
    else{
      cart.push({
        productId: productId,
        quantity: qty,
        deliveryOptionsId: '1'
      })
    }
    saveCart(); 

}

export function DelFromCart(productId){
  const index = cart.findIndex(item => item.productId === productId);
  if(index != -1){
    cart.splice(index, 1); 
    saveCart();
  }
  // location.reload(); ये भी काम कर रहा था। 
}

export function UpdateDelID(productId, delID){
  const item = cart.find(p => p.productId === productId);
  item.deliveryOptionsId = delID; 
  saveCart();
}