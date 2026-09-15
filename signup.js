const API_URL = "https://g-bot-mart-3.onrender.com";
console.log("SIGNUP JS IS WORKING");

const signupForm = document.getElementById("signup-form");
console.log("FORM:", signupForm);



function showToast(message){
    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toast-message");

    toastMessage.textContent = message;
    
    toast.classList.remove("opacity-0", "translate-y-10");

    setTimeout(() =>{
        toast.classList.add("opacity-0", "translate-y-10");
    }, 2500);
}

signupForm.addEventListener("submit", async (event) =>{
    console.log("SUBMIT EVENT FIRED");
    event.preventDefault();

    console.log("SIGNUP BUTTON CLICKED");
    

    const fullName = document.getElementById("signup-name").value;
    const email = document.getElementById("signup-email").value;
    const emailResponse = await fetch(`${API_URL}/users?email=${email}`);
const existingUsers = await emailResponse.json();
if(existingUsers.length > 0) {
    showToast("Email already exist. Please Login");
    return;
}

    const password = document.getElementById("signup-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if(password !== confirmPassword){
        showToast("Password do not match");
        return;
    }
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    
    if(!passwordPattern.test(password)){
        showToast("Password must have 8+ characters, 1 uppercase letter, 1 number, and 1 symbol");
        return;
    }
      
    const response = await fetch(`${API_URL}/users`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            fullName: fullName,
            email: email,
            password: password
        })
    });
     if (!response.ok) {
            throw new Error("Failed to create account");
            
        }
         showToast("Account created successfully");

         setTimeout(()=>{
            window.location.href = "index.html";
         });

});

let togglePassword = document.getElementById("toggle-password");
let passwordInput = document.getElementById("signup-password");

let toggleConfirmPassword = document.getElementById("toggle-confirm-password");
let confirmPasswordInput = document.getElementById("confirm-password");


togglePassword.addEventListener("click", () => {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";
        togglePassword.src = "eye-open.png";

    } else {

        passwordInput.type = "password";
        togglePassword.src = "eye-close.png";

    }

});


toggleConfirmPassword.addEventListener("click", () => {

    if (confirmPasswordInput.type === "password") {

        confirmPasswordInput.type = "text";
        toggleConfirmPassword.src = "eye-open.png";

    } else {

        confirmPasswordInput.type = "password";
        toggleConfirmPassword.src = "eye-close.png";

    }

});
 