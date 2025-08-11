const xhr = new XMLHttpRequest(); 
// The above is an HTTP request to the "backend"; 
xhr.addEventListener('load', () => {
    console.log(xhr.response);
    //We saw the message! it's a string, now we can do anything with it in our code.
})
xhr.open('GET', 'https://supersimplebackend.dev') //GET is one of the types of message you can send. You wanna get some some information. The second parameter is a URL, our "backend" for now. 
//We we type a URL in the browser, it sends a GET request as well, it's the same as our code.
xhr.send(); //The request is sent. the response will come after some time. This is Async code, cause it dosn't wait for the response, it immideatly moves to the next line of code. so we need an event listener to do something with that response.