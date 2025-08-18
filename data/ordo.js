let orders = JSON.parse(localStorage.getItem('orders')) || []; 

export function addOrder(order){
    orders.unshift(order); 
    SaveToStorage(); 
}
function SaveToStorage(){
    localStorage.setItem('orders', JSON.stringify(orders));
}