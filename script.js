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
            <img src="${item.image}" alt="${item.name}" class="w-32 h-32 rounded-md hover:scale-110 duration-200">
            <div class="w-full flex flex-col justify-between">
                <div>
                    <p class="font-bold text-lg">${item.name}</p>
                    <p class="text-base">Quantidade: ${item.quantity}</p>
                    <p class="font-medium text-lg mt-2">R$ ${item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    <div class="flex items-center gap-4 mt-2">
                        <button class="decrease-quantity text-white bg-stone-800 rounded-md w-10 h-8 flex items-center justify-center" data-name="${item.name}">
                            <i class="fa fa-minus"></i>
                        </button>
                        <button class="increase-quantity text-white bg-stone-800 rounded-md w-10 h-8 flex items-center justify-center" data-name="${item.name}">
                            <i class="fa fa-plus"></i>
                        </button>
                    </div>
                    <div class="flex justify-end" style="margin-top: -32px">
                        <button class="remove-item-btn text-red-600 text-2xl" data-name="${item.name}">
                            <img src="./assets/lixeira2.svg" alt="Remover" class="w-8 h-8">
                        </button>
                    </div>
                </div>
            </div>
        `;

        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement);
    });

    // Controla a rolagem do modal
    if (cart.length >= 4) {
        cartItemsContainer.classList.add("max-h-[300px]", "overflow-y-auto", "pr-2");
    } else {
        cartItemsContainer.classList.remove("max-h-[300px]", "overflow-y-auto", "pr-2");
    }

    // Atualiza o total do carrinho
    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    // Atualiza o contador de itens
    cartCounter.innerHTML = cart.reduce((acc, item) => acc + item.quantity, 0);

    // Adiciona os event listeners para os botões de remoção e quantidade
    addEventListeners();
}

function addEventListeners() {
    document.querySelectorAll('.remove-item-btn').forEach(button => {
        button.addEventListener('click', function () {
            const trashIcon = this.querySelector('img');

            trashIcon.classList.add('animate-trash');

            setTimeout(() => {
                trashIcon.classList.remove('animate-trash');
            }, 1000);

            removeItemCompletely(this.getAttribute('data-name'));

            if (navigator.vibrate) {
                navigator.vibrate(200);
            } else {
                console.log("Vibração não suportada neste dispositivo/navegador.");
            }
        });
    });

    document.querySelectorAll('.decrease-quantity').forEach(button => {
        button.addEventListener('click', function () {
            // Diminui a quantidade do item
            decreaseItemQuantity(this.getAttribute('data-name'));

            if (navigator.vibrate) {
                navigator.vibrate(200);
            } else {
                console.log("Vibração não suportada neste dispositivo/navegador.");
            }
        });
    });

    document.querySelectorAll('.increase-quantity').forEach(button => {
        button.addEventListener('click', function () {
            // Aumenta a quantidade do item
            increaseItemQuantity(this.getAttribute('data-name'));

            if (navigator.vibrate) {
                navigator.vibrate(200);
            } else {
                console.log("Vibração não suportada neste dispositivo/navegador.");
            }
        });
    });
}

function decreaseItemQuantity(name) {
    const index = cart.findIndex(item => item.name === name);

    if (index !== -1) {
        const item = cart[index];

        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            // Caso a quantidade seja 1 e o item for removido completamente
            cart.splice(index, 1);
        }
        updateCartModal();
    }
}

function increaseItemQuantity(name) {
    const index = cart.findIndex(item => item.name === name);

    if (index !== -1) {
        const item = cart[index];
        item.quantity += 1; // Aumenta a quantidade em 1

        updateCartModal();
    }
}

function removeItemCompletely(name) {
    const index = cart.findIndex(item => item.name === name);

    if (index !== -1) {
        cart.splice(index, 1); // Remove o item completamente
        updateCartModal();
    }
}

// Adiciona um event listener ao botão de lixeira
document.querySelectorAll('.remove-from-cart-btn').forEach(button => {
    button.addEventListener('click', function () {
        const trashIcon = this.querySelector('img');

        // Adiciona a classe de animação
        trashIcon.classList.add('animate-trash');

        // Remove a classe de animação após 1 segundo
        setTimeout(() => {
            trashIcon.classList.remove('animate-trash');
        }, 1000);

        // Remove o item do carrinho completamente
        removeItemCompletely(this.getAttribute('data-name'));
    });
});


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
            text: "Desculpe, estamos fechados no momento!",
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
    }, 2500); // Atraso de 2500 milissegundos (2.5 segundos)
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
