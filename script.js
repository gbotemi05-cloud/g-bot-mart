const productContainer = document.getElementById("product-container");
const productTemplate = document.getElementById("product-template");
const searchInput = document.getElementById("search-input");
const  categoryFilter = document.getElementById("category-filter");
const openCart = document.getElementById("open-cart");
const closeCart = document.getElementById("close-cart");
const cartDrawer = document.getElementById("cart-drawer");
const cartItemTemplate = document.getElementById("cart-item-template");
const loading = document.getElementById("loading");
const userGreeting = document.getElementById("user-greeting");
const logoutBtn = document.getElementById("logout-btn");
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

if(loggedInUser){
    userGreeting.textContent = `Hi, ${loggedInUser.fullName} 👋`;
}

if(!loggedInUser){
    window.location.href = "index.html";
}

logoutBtn.addEventListener("click", ()=>{
    localStorage.removeItem("loggedInUser");
    window.location.href = "index.html";
})



const API_URL = "https://g-bot-mart-3.onrender.com";
let allProducts = [];
let cartIsOpen = false;



function showToast(message) {
    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toast-message");
     
    toastMessage.textContent = message;

    toast.classList.remove("opacity-0", "translate-y-10");
    
    setTimeout(() => {
        toast.classList.add("opacity-0", "translate-y-10");
    }, 2000);
}

openCart.addEventListener("click", async () => {
    cartIsOpen = true;
    cartDrawer.classList.remove("translate-x-full");
     fetchCart();
     
});
closeCart.addEventListener("click", () => {
    cartIsOpen = false;
    cartDrawer.classList.add("translate-x-full");
        
     });





async function fetchProducts() {
    try{
        loading.classList.remove("hidden");
        const response = await fetch(`${API_URL}/products`);
        if(!response.ok) {
            throw new Error("Failed tp fetch products");
        }

        const products = await response.json();

        allProducts = products;
        
        displayProducts(products);

    } catch (error) {
        console.log(error);
        
    } finally{
        loading.classList.add("hidden");
    }
  
}
  function filterProducts(products){
        
        const searchTerm = searchInput.value.toLowerCase().trim();
        const selectedCategory = categoryFilter.value;

         const filteredProducts = products.filter((product)=>{
            return product.title.toLowerCase().startsWith(searchTerm) &&
             (selectedCategory === "all" || product.category === selectedCategory);

            
        });
        displayProducts(filteredProducts);
    }
async function addToCart(product) {
    try{
        const response = await fetch(`${API_URL}/cart`);
        if (!response.ok) {
            throw new Error("Failed to fetch cart");
        }

        const cart = await response.json(); 
           
        const existingItem = cart.find((item) => item.productId === product.id);
         if (existingItem) {
            const updateResponse = await fetch(
                `${API_URL}/cart/${existingItem.id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        quantity: existingItem.quantity + 1
                    })
                }
            );
            if (!updateResponse.ok) {
                throw new Error ("Failed to update cart quantity");
            }
         } else {
            const addResponse = await fetch(`${API_URL}/cart`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    productId: product.id,
                    title: product.title,
                    price: product.price,
                    quantity: 1,
                    image: product.image
                })
            });
            if (!addResponse.ok) {
                throw new Error("Failed to add product to cart");
            }
         }
        await fetchCart();
        showToast(`${product.title} added to cart`);
    
    } catch (error){
        showToast("Something went wrong. Please try again.");
        

    }
    
   
}


//  async function fetchCart() {
//         try{
//             const  wasOpen = cartIsOpen;
            
//             const response = await fetch(`${API_URL}/cart`);
//             const cart = await response.json();



//             const cartCount = document.getElementById("cart-count");
//             const totalQuantity = cart.reduce((total, item) => {
//                 return total + item.quantity;
//             }, 0);
//             cartCount.textContent = cart.length;

//             const cartContainer = document.getElementById("cart-container");

//             cartContainer.innerHTML = "";
//             if (cart.length === 0){
//                 cartContainer.innerHTML = `<p class = "text-center text-gray-500 py-10">
//                 Your cart is empty. Please add a product to your cart.</p>`;
//             }

//             let total = 0;
//             cart.forEach((item) => {
//                 total += item.price * item.quantity;
//                 const cartItem = cartItemTemplate.content.cloneNode(true);

//                 const cartItemImage = cartItem.querySelector(".cart-item-image");
//                 cartItemImage.src = item.image;
//                 cartItemImage.alt = item.title;
                
//                 const cartItemTitle = cartItem.querySelector(".cart-item-title");
//                 cartItemTitle.textContent = item.title;
                
//                 const cartItemPrice = cartItem.querySelector(".cart-item-price");
//                 cartItemPrice.textContent = `₦${item.price}`;
                
//                 const cartItemQuantity = cartItem.querySelector(".cart-item-quantity");
//                 cartItemQuantity.textContent = item.quantity;

//                 const increaseButton = cartItem.querySelector(".increase-quantity");

//                 const decreaseButton = cartItem.querySelector(".decrease-quantity");

// increaseButton.addEventListener("click", async () => {
//     try {
//         const response = await fetch(`${API_URL}/cart/${item.id}`, {
//                 method: "PATCH",
//                 headers: {
//                     "Content-Type": "application/json"
//                 },
//                 body: JSON.stringify({
//                     quantity: item.quantity + 1
//                 })
//             });
        

//         if (!response.ok) {
//             throw new Error("Failed to increase quantity");
//         }

//         await fetchCart();
        

//     } catch (error) {
//         console.log(error);
//     }
// });
// decreaseButton.addEventListener("click", async () => {
//     try {

//         if (item.quantity <= 1) {
//             return;
//         }

//         const response = await fetch(
//             `${API_URL}/cart/${item.id}`,
//             {
//                 method: "PATCH",
//                 headers: {
//                     "Content-Type": "application/json"
//                 },
//                 body: JSON.stringify({ 
//                     quantity: item.quantity - 1
//                 })
//             }
//         );

//         if (!response.ok) {
//             throw new Error("Failed to decrease quantity");
//         }

//         await fetchCart();
        

//     } catch (error) {
//         console.log(error);
//     }
// });

//                 const removeButton = cartItem.querySelector(".remove-cart-item");

// removeButton.addEventListener("click", async () => {
//     try {
//         const response = await fetch(`${API_URL}/cart/${item.id}`, {
//             method: "DELETE"
//         });

//         if (!response.ok) {
//             throw new Error("Failed to remove item from cart");
//         }

    
//         await fetchCart();
//         showToast(`${item.title} removed from cart`);

//     } catch (error) {
//         console.log(error);
//     }
// });

//                 cartContainer.appendChild(cartItem);

//             });
//              const cartTotal = document.getElementById("cart-total");
//              cartTotal.textContent = `₦${total.toLocaleString()}`;

//              if(wasOpen) {
//                 cartDrawer.classList.remove("translate-x-full")
//              }
            
//         } catch (error) {
//             console.log(error);
            
//         }
        
//     }
function displayProducts(products) {
    productContainer.innerHTML ="";

    
             if (products.length === 0){
                productContainer.innerHTML = `
                <p class ="text-center text-gray-500 col-span-full py-10">No products found.</p>
                `;
                return;
             }

    products.forEach((product) => {
        const productCard = productTemplate.content.cloneNode(true);

        const productImage = productCard.querySelector(".product-image");

        productImage.src = product.image;

        productImage.alt = product.title;

        const productTitle = productCard.querySelector(".product-title");

        productTitle.textContent = product.title;

        const productDescription = productCard.querySelector(".product-description");

        productDescription.textContent = product.description;

        const productPrice = productCard.querySelector(".product-price");
        
        productPrice.textContent = `₦${product.price.toLocaleString()}`;
        const addButton = productCard.querySelector(".add-to-cart");
        addButton.addEventListener("click", async (event) => {
            event.preventDefault();
            await addToCart(product);

        });
        productContainer.appendChild(productCard);

    });
    
    
    
}
searchInput.addEventListener("input", () => {
    filterProducts(allProducts);
});
categoryFilter.addEventListener("change", () =>{
    filterProducts(allProducts);
});

fetchProducts();
fetchCart();

 const newProduct = {
    title :"",
    price :"",
    category:"",
    description:"",
    image:""
 };

 async function addProducts() {
    
 
 const response = await fetch(`${API_URL}/products`,{
    method: "POST",
    headers:{
        "Content-Type": "application/json"
    },
    body: JSON.stringify(newProduct)
 });

}