const API_URL = "https://g-bot-mart-3.onrender.com";

const loginForm = document.getElementById("login-form");

function showToast(message) {
    const toast =  document.getElementById("toast");
    const toastMessage = document.getElementById("toast-message");

    toastMessage.textContent = message;
    toast.classList.remove("opacity-0", "translate-y-10");

    setTimeout(() => {
        toast.classList.add("opacity-0", "translate-y-10");


    }, 2500);
}

loginForm.addEventListener("submit", async (event) =>{
    event.preventDefault();

    const email = document.getElementById("login-email").value;

    const password = document.getElementById("login-password").value;

    const response = await fetch(
        `${API_URL}/users?email=${email}&password=${password}`
    );
    const users = await response.json();
    if(users.length === 0){
        showToast("Invalid email or password");
        return;
    }
    localStorage.setItem("loggedInUser", JSON.stringify(users[0]));

    showToast("Login successful!");

    setTimeout(() => {
        window.location.href = "store.html";
    },
    1500);
});

let togglePassword = document.getElementById("toggle-password");
let passwordInput = document.getElementById("login-password");
let eyeIcon = document.getElementById("eye-icon");

togglePassword.addEventListener("click", () => {
    if(passwordInput.type === "password"){
        passwordInput.type = "text";
        eyeIcon.src = "eye-open.png";
    }
    else{
        passwordInput.type = "password";
        eyeIcon.src = "eye-close.png";
    }
    togglePassword.src = passwordInput.type === "password" ? "eye-close.png" : "eye-open.png";
    
});
