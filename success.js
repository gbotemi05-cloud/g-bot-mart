const API_URL = "https://g-bot-mart-3.onrender.com";

const customerName = document.getElementById("customer-name");
const customerEmail = document.getElementById("customer-email");
const paymentMethod = document.getElementById("payment-method");
const paymentStatus = document.getElementById("payment-status");
const orderTotal = document.getElementById("order-total");
const orderItems = document.getElementById("order-items");

async function fetchLatestOrder() {
    try {
        const response = await fetch(`${API_URL}/orders`);

        if (!response.ok) {
            throw new Error("Failed to fetch order");
        }

        const orders = await response.json();

        if (orders.length === 0) {
            return;
        }

        const order = orders[orders.length - 1];

        customerName.textContent = order.customer.fullName;
        customerEmail.textContent = order.customer.email;
        paymentMethod.textContent = order.paymentMethods;
        paymentStatus.textContent = order.paymentStatus || order.status;
        orderTotal.textContent = `₦${order.total.toLocaleString()}`;

        orderItems.innerHTML = "";

        order.items.forEach((item) => {
            const itemElement = document.createElement("div");

            itemElement.className = "flex justify-between items-center gap-4 border-b border-gray-200 pb-3";

            itemElement.innerHTML = `
                <div>
                    <p class="font-semibold text-gray-900">
                        ${item.title}
                    </p>

                    <p class="text-sm text-gray-500">
                        Quantity: ${item.quantity}
                    </p>
                </div>

                <span class="font-bold text-gray-900">
                    ₦${(item.price * item.quantity).toLocaleString()}
                </span>
            `;

            orderItems.appendChild(itemElement);
        });

    } catch (error) {
        console.log("Error loading order:", error);
    }
}

fetchLatestOrder();