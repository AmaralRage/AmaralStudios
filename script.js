const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")

let cart = [];

// abrir modal
cartBtn.addEventListener("click", function () {
    updateCartModal()
    cartModal.style.display = "flex"
})

// fechar modal 
cartModal.addEventListener("click", function (event) {
    if (event.target === cartModal) {
        cartModal.style.display = "none"
    }
})

closeModalBtn.addEventListener("click", function () {
    cartModal.style.display = "none"
})

menu.addEventListener("click", function (event) {
    let parentButton = event.target.closest(".add-to-cart-btn")

    if (parentButton) {
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))

        addToCart(name, price)
    }
})

function addToCart(name, price) {
    const isOpen = verificaAberto();

    if (!isOpen) {
        Toastify({
            text: "Desculpe, estamos fechados no momento!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "#FF0000", // Vermelho
            },
        }).showToast();
        return;
    }

    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;

        Toastify({
            text: "O item foi adicionado ao carrinho!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "#228B22", // Verde
            },
        }).showToast();

    } else {
        cart.push({
            name,
            price,
            quantity: 1,
        });
        updateCartModal();

        Toastify({
            text: "O item foi adicionado ao carrinho!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "#228B22", // Verde
            },
        }).showToast();
    }

    if (navigator.vibrate) {
        navigator.vibrate(300);
    } else {
        console.log("Vibração não suportada neste dispositivo/navegador.");
    }
}

function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-bold">${item.name}</p>
                    <p>Quantidade: ${item.quantity}</p>
                    <p class="font-medium mt-2">R$ ${item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
            
                <button class="remove-from-cart-btn bg-stone-600 text-white px-4 py-1 rounded" data-name="${item.name}">
                    Remover
                </button>
        </div>
        `

        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement)

    })

    if (cart.length >= 6) {
        cartItemsContainer.classList.add("max-h-[300px]", "overflow-y-auto", "pr-2");
    } else {
        cartItemsContainer.classList.remove("max-h-[300px]", "overflow-y-auto", "pr-2");
    }

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;
}

cartItemsContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-from-cart-btn")) {
        const name = event.target.getAttribute("data-name")

        removeItemCart(name);
    }
})


function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name)

    if (index !== -1) {
        const item = cart[index];

        if (item.quantity > 1) {
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }
}

addressInput.addEventListener("input", function (event) {
    let inputValue = event.target.value;

    if (inputValue !== "") {
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
})

checkoutBtn.addEventListener("click", function () {

    const isOpen = verificaAberto();
    if (!isOpen) {

        Toastify({
            text: "A Hamburgueria está fechada!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "#EF4444",
            },
        }).showToast();

        return;
    }


    if (cart.length === 0)
        return;
    if (addressInput.value === "") {
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    let total = 0;
    const cartItems = cart.map((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        return (
            `${item.name}\n` +
            `(R$ ${item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})\n` +
            `Quantidade: ${item.quantity}\n` +
            `R$ ${itemTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n` +
            `\n`
        );
    }).join("\n");

    const message = encodeURIComponent(
        `*Golden Burguer*\n\n` +
        `${cartItems}\n` +
        // `Subtotal: R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n` +
        `*Total: R$* ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\n` +
        `Venha conhecer nosso Instagram\n` +
        `https://www.instagram.com/goldenburgerrj/\n\n` +
        `*Endereço:* ${addressInput.value}` // Endereço do cliente
    );

    const phone = "+5521983837957";
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");

    cart = [];
    updateCartModal();

})

function verificaAberto() {
    const data = new Date();
    const hora = data.getHours();
    return (hora >= 18 && hora < 24) || (hora >= 0 && hora < 1);
}

const spanItem = document.getElementById("data-span")
const isOpen = verificaAberto();

if (isOpen) {
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-600")
} else {
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}