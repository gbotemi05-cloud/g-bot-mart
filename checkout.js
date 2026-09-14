const PAYSTACK_PUBLIC_KEY = "pk_test_dfdaba709e00ea2ed92a376726311d644580e557";

const API_URL = "https://g-bot-mart-3.onrender.com";

const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

if(!loggedInUser) {
    window.location.href = "index.html";
};
 
let cart = [];


const checkoutForm = document.getElementById("checkout-form");

function showToast(message) {
    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toast-message");

    toastMessage.textContent = message;

    toast.classList.remove("opacity-0", "translate-y-10");

    setTimeout(() => {
        toast.classList.add("opacity-0", "translate-y-10");
    }, 2500);
}


 document.getElementById("full-name").value = loggedInUser.fullName;
 document.getElementById("email").value = loggedInUser.email;

const checkoutItems = document.getElementById("checkout-items");

const checkoutSubtotal = document.getElementById("checkout-subtotal");

const checkoutTotal = document.getElementById("checkout-total");

const checkoutItemTemplate = document.getElementById("checkout-item-template");

// const cardDetails = document.querySelectorAll(".card-details");
// console.log("Card sections:", cardDetails.length);

// const cardNumber = document.getElementById("card-number");

// const expiryDate = document.getElementById("expiry-date");

// const cvv = document.getElementById("cvv");

const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');


// paymentMethods.forEach((method)=> {
//     method.addEventListener("change", () =>{
//         cardDetails.forEach((section) => {
//         if (method.value === "card") {
//             section.classList.remove("hidden");
//         }else{
//             section.classList.add("hidden");
//         }
//     });

//     cardNumber.required = method.value === "card";
//     expiryDate.required = method.value === "card";
//     cvv.required = method.value ==="card";
        
//     });
// });

async function fetchCheckoutCart() {
    const response = await fetch(`${API_URL}/cart`);

     cart = await response.json();
     console.log("Checkout cart:", cart);

    checkoutItems.innerHTML = "";

    if (cart.length === 0){
        checkoutItems.innerHTML = `<p class ="text-center text-gray-500 py-10">
        Your cart is empty. Please add a product to your cart.</p>`;

        return;
    }
let subtotal = 0;

cart.forEach((item)=>{
    subtotal += item.price * item.quantity;

    const checkoutItem = checkoutItemTemplate.content.cloneNode(true);

    const checkoutItemImage = checkoutItem.querySelector("img");

    checkoutItemImage.src = item.image;

    checkoutItemImage.alt = item.title;

    const checkoutItemTitle = checkoutItem.querySelector(".checkout-item-title");

    checkoutItemTitle.textContent = item.title;

    const checkoutItemQuantity = checkoutItem.querySelector(".checkout-item-quantity");
    
    checkoutItemQuantity.textContent = `Quantity: ${item.quantity}`;

    const checkoutItemPrice = checkoutItem.querySelector(".checkout-item-price");

    checkoutItemPrice.textContent = `₦${(item.price * item.quantity).toLocaleString()}`;

    checkoutItems.appendChild(checkoutItem);
});

checkoutSubtotal.textContent = `₦${subtotal.toLocaleString()}`;

checkoutTotal.textContent = `₦${subtotal.toLocaleString()}`;

checkoutForm.addEventListener("submit", async (event) =>{
    event.preventDefault();
    console.log("SUBMIT BUTTON CLICKED");
    

    const selectedPayment = document.querySelector(
        'input[name="paymentMethod"]:checked'
      
    );

    if(!selectedPayment) {
        showToast("please select a payment method");
        return;
    }
      console.log("Payment method:", selectedPayment?.value);
      const customerInfo = {
        fullName: document.getElementById("full-name").value,
        email: document.getElementById("email").value,
        address: document.getElementById("address").value,
        phone: document.getElementById("phone").value,
        
      };

      console.log("Customer:", customerInfo);

      if (cart.length === 0) {
        showToast("Your cart is empty");
        return;
      }
      const orderTotal = cart.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0);

      console.log("Order total:", orderTotal);

      if (selectedPayment.value === "cash") {
        const orderResponse = await fetch(`${API_URL}/orders`, {
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                customer: customerInfo,
                items: cart,
                total:orderTotal,
                paymentMethods:"Cash on Delivery",
                status: "Pending"
            })
        });  

        if(!orderResponse.ok) {
            throw new Error("Failed to create order");
        }
        console.log("Cash on Delivery order created successfully");
         
        console.log("Cart before delete:", cart);
        for (const item of cart) {
            const deleteResponse = await fetch(`${API_URL}/cart/${item.id}`, {
            method: "DELETE"
            });
            if (!deleteResponse.ok){
                throw new Error(`Failed to delete cart item ${item.id}`);
            }

        
        }
        
        
        
            window.location.href = "success.html";
        return; 
      }
      
      const paystack = new PaystackPop();

      paystack.newTransaction({
        key: PAYSTACK_PUBLIC_KEY,
        email: customerInfo.email,
        amount: Math.round(orderTotal * 100),
        currency: "NGN",
        channels:["card"],

        onSuccess: async (transaction) => {
            try{
            
            const orderResponse = await fetch(`${API_URL}/orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    customer: customerInfo,
                    items: cart,
                    total: orderTotal,
                    paymentMethods: "Card Payment",
                    paymentStatus: "Paid",
                    paymentReference: transaction.reference,
                    status: "Processing"

                })

            });
             if (!orderResponse.ok) {
                    throw new Error("Failed to create card payment order");
                    
                }

                for (const item of cart) {
                    await fetch(`${API_URL}/cart/${item.id}`,{
                        method: "DELETE"
                    });
                }
            
                window.location.href = "success.html";
                return;
            }catch (error) {
                console.log("Order error:", error);
                return;
            }
        },
        onCancel: (transaction) => {
            showToast("Payment cancelled");
            return;
        },
        onError: (error) =>{
            console.log("Payment error:", error);
             showToast("Payment error:", error);
            return;
            
        },
        
      });
});

    
}
fetchCheckoutCart();