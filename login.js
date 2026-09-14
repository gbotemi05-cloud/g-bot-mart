const API_URL = "http://localhost:3000";

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