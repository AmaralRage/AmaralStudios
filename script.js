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

// Selecione todos os botões de adicionar ao carrinho
const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

// Adicione um evento de clique a cada botão
addToCartButtons.forEach(button => {
    button.addEventListener('click', function () {
        const name = this.getAttribute('data-name');
        const price = parseFloat(this.getAttribute('data-price'));
        const image = this.getAttribute('data-image'); // Pega a URL da imagem

        // Chama a função addToCart com os parâmetros do item
        addToCart(name, price, image);
    });
});



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
    }
})

function addToCart(name, price, image) { // Adicione o parâmetro "image"
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
    } else {
        cart.push({
            name,
            price,
            quantity: 1,
            image // Adiciona a imagem ao item
        });
    }

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

    if (navigator.vibrate) {
        navigator.vibrate(200);
    } else {
        console.log("Vibração não suportada neste dispositivo/navegador.");
    }
}


function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "gap-2", "mb-4");

        cartItemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="w-28 h-28 rounded-md hover:scale-110 duration-200">
            <div class="w-full flex flex-col justify-between">
                <div>
                    <p class="font-bold">${item.name}</p>
                    <p>Quantidade: ${item.quantity}</p>
                    <p class="font-medium mt-2">R$ ${item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
                <div class="flex justify-end mt-2">
                    <button class="remove-from-cart-btn bg-stone-600 text-white px-4 py-1 rounded mt-2" data-name="${item.name}">
                    Remover
                </button>
                </div>
            </div>

        `;

        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement);
    });

    if (cart.length >= 4) {
        cartItemsContainer.classList.add("max-h-[300px]", "overflow-y-auto", "pr-2");
    } else {
        cartItemsContainer.classList.remove("max-h-[300px]", "overflow-y-auto", "pr-2");
    }

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.reduce((acc, item) => acc + item.quantity, 0);
}

cartItemsContainer.addEventListener("click", function (event) {
    const name = event.target.closest("button").getAttribute("data-name");

    if (event.target.classList.contains("remove-from-cart-btn")) {
        removeItemCart(name);
    }

    if (event.target.classList.contains("increase-quantity")) {
        const item = cart.find(item => item.name === name);
        if (item) {
            item.quantity += 1;
            updateCartModal();
        }
    }

    if (event.target.classList.contains("decrease-quantity")) {
        const item = cart.find(item => item.name === name);
        if (item) {
            item.quantity -= 1;
            if (item.quantity <= 0) {
                removeItemCart(name);
            } else {
                updateCartModal();
            }
        }
    }
});



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
                background: "#FF0000",
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
        `*Total:* R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\n` +
        `*Endereço:* ${addressInput.value}\n` + // Endereço do cliente
        `----------------------------------------------------\n` + // Linha de separação
        `Venha conhecer nosso Instagram\n` +
        `https://www.instagram.com/goldenburgerrj/\n\n`
    );

    const phone = "+5521983837957";

    // Desabilitar o botão de checkout usando o ID
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.setAttribute('disabled', 'disabled');
    }

    Swal.fire({
        title: 'Obrigado!',
        text: 'Seu pedido foi finalizado com sucesso.',
        icon: 'success',
        confirmButtonText: 'OK',
        timer: 5000,
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading();
        }
    })
    setTimeout(() => {
        window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
    }, 2500); // Atraso de 500 milissegundos (0.5 segundos)
    updateCartModal();


})

function verificaAberto() {
    const data = new Date();
    const diaDaSemana = data.getDay();
    const hora = data.getHours();

    if (diaDaSemana === 2) {
        return false;
    }
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
