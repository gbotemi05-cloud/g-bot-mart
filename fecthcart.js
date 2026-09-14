
 async function fetchCart() {
        try{
            const  wasOpen = cartIsOpen;
            
            const response = await fetch(`${API_URL}/cart`);
            if(!response.ok) {
                throw new Error("Failed to fetch products");
            }


            const cart = await response.json();



            const cartCount = document.getElementById("cart-count");
            // const totalQuantity = cart.reduce((total, item) => {
            //     return total + item.quantity;
            // }, 0);
            cartCount.textContent = cart.length;

            const cartContainer = document.getElementById("cart-container");

            cartContainer.innerHTML = "";
            if (cart.length === 0){
                cartContainer.innerHTML = `<p class = "text-center text-gray-500 py-10">
                Your cart is empty. Please add a product to your cart.</p>`;
            }

            let total = 0;
            cart.forEach((item) => {
                total += item.price * item.quantity;
                const cartItem = cartItemTemplate.content.cloneNode(true);

                const cartItemImage = cartItem.querySelector(".cart-item-image");
                cartItemImage.src = item.image;
                cartItemImage.alt = item.title;
                
                const cartItemTitle = cartItem.querySelector(".cart-item-title");
                cartItemTitle.textContent = item.title;
                
                const cartItemPrice = cartItem.querySelector(".cart-item-price");
                cartItemPrice.textContent = `₦${(item.price * item.quantity).toLocaleString()}`;
                
                const cartItemQuantity = cartItem.querySelector(".cart-item-quantity");
                cartItemQuantity.textContent = item.quantity;

                const increaseButton = cartItem.querySelector(".increase-quantity");

                const decreaseButton = cartItem.querySelector(".decrease-quantity");

increaseButton.addEventListener("click", async () => {
    try {
        const response = await fetch(`${API_URL}/cart/${item.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    quantity: item.quantity + 1
                })
            });
        

        if (!response.ok) {
            throw new Error("Failed to increase quantity");
        }

        await fetchCart();
        

    } catch (error) {
        console.log(error);
    }
});
decreaseButton.addEventListener("click", async () => {
    try {

        if (item.quantity <= 1) {
            return;
        }

        const response = await fetch(
            `${API_URL}/cart/${item.id}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ 
                    quantity: item.quantity - 1
                })
            }
        );

        if (!response.ok) {
            throw new Error("Failed to decrease quantity");
        }

        await fetchCart();
        

    } catch (error) {
        console.log(error);
    }
});

                const removeButton = cartItem.querySelector(".remove-cart-item");

removeButton.addEventListener("click", async () => {
    try {
        const response = await fetch(`${API_URL}/cart/${item.id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Failed to remove item from cart");
        }

    
        await fetchCart();
        showToast(`${item.title} removed from cart`);

    } catch (error) {
        console.log(error);
    }
});

                cartContainer.appendChild(cartItem);

            });
             const cartTotal = document.getElementById("cart-total");
             cartTotal.textContent = `₦${total.toLocaleString()}`;

             if(wasOpen) {
                cartDrawer.classList.remove("translate-x-full")
             }
            
        } catch (error) {
            console.log(error);
            
        }
        
    }
    fetchCart();