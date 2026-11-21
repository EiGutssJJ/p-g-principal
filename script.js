
/* ========================================
   CARROSSEL
======================================== */

let slides = document.querySelectorAll(".slide");
let slideAtual = 0;

function mostrarSlide() {

    if (slides.length === 0) return;

    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    slides[slideAtual].style.display = "block";
}

mostrarSlide();

function mudarSlide(direcao) {

    if (slides.length === 0) return;

    slideAtual += direcao;

    if (slideAtual >= slides.length) {
        slideAtual = 0;
    }

    if (slideAtual < 0) {
        slideAtual = slides.length - 1;
    }

    mostrarSlide();
}

if (slides.length > 0) {
    setInterval(function() {
        mudarSlide(1);
    }, 4000);
}


/* ========================================
   LOGIN E CADASTRO
======================================== */

function abrirUsuario(event) {

    if (event) event.preventDefault();

    let modal = document.getElementById("modalUsuario");

    if (modal) modal.style.display = "flex";
}

function fecharUsuario() {

    let modal = document.getElementById("modalUsuario");

    if (modal) modal.style.display = "none";
}

function abrirCadastro(event) {

    if (event) event.preventDefault();

    let login = document.querySelector(".form-login");
    let cadastro = document.querySelector(".cadastro");
    let formulario = document.getElementById("formCadastro");

    if (login) login.style.display = "none";
    if (cadastro) cadastro.style.display = "none";
    if (formulario) formulario.style.display = "flex";
}

function voltarLogin(event) {

    if (event) event.preventDefault();

    let login = document.querySelector(".form-login");
    let cadastro = document.querySelector(".cadastro");
    let formulario = document.getElementById("formCadastro");

    if (login) login.style.display = "flex";
    if (cadastro) cadastro.style.display = "block";
    if (formulario) formulario.style.display = "none";
}


/* ========================================
   CARRINHO DE COMPRAS
======================================== */

// Recupera os produtos salvos

let carrinho = [];

try {

    carrinho = JSON.parse(
        localStorage.getItem("carrinhoGiovana")
    ) || [];

} catch (erro) {

    carrinho = [];

}

// Garante que produtos antigos tenham um ID

carrinho.forEach(function(item) {

    if (!item.id) {
        item.id = item.nome;
    }

});


/* ========================================
   FORMATAÇÃO DE PREÇOS
======================================== */

function formatarPreco(valor) {

    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

}


/* ========================================
   SALVAR CARRINHO
======================================== */

function salvarCarrinho() {

    localStorage.setItem(
        "carrinhoGiovana",
        JSON.stringify(carrinho)
    );

}


/* ========================================
   ABRIR E FECHAR CARRINHO ANTIGO
======================================== */

function abrirCarrinho(event) {

    if (event) event.preventDefault();

    let modal = document.getElementById("modalCarrinho");

    if (modal) {
        modal.style.display = "flex";
    }

    atualizarCarrinho();
}

function fecharCarrinho() {

    let modal = document.getElementById("modalCarrinho");

    if (modal) {
        modal.style.display = "none";
    }

}


/* ========================================
   ADICIONAR PRODUTO
======================================== */

function adicionarCarrinho(produto) {

    let nome = produto.nome;
    let preco = Number(produto.preco);
    let id = produto.id;

    if (!nome || !id || !Number.isFinite(preco) || preco <= 0) {

        alert("Produto ou preço inválido!");

        return;
    }

    let produtoExistente = carrinho.find(function(item) {

        return item.id === id;

    });

    if (produtoExistente) {

        produtoExistente.quantidade++;

    } else {

        carrinho.push({

            id: id,
            nome: nome,
            preco: preco,
            imagem: produto.imagem || "",
            quantidade: 1

        });

    }

    salvarCarrinho();

    atualizarCarrinho();

    alert(nome + " foi adicionado ao carrinho!");

}


/* ========================================
   ATUALIZAR CARRINHO
======================================== */

function atualizarCarrinho() {

    // Aceita o ID antigo e o novo

    let lista =
        document.getElementById("lista-carrinho") ||
        document.getElementById("listaCarrinho");

    let subtotalElemento = document.getElementById("subtotal");
    let totalElemento = document.getElementById("total");

    let subtotal = 0;

    // Se a página não tiver a lista, não continua

    if (!lista) return;

    lista.innerHTML = "";

    // Verifica se está vazio

    if (carrinho.length === 0) {

        lista.innerHTML = `
            <p class="carrinho-vazio">
                Seu carrinho está vazio.
            </p>
        `;

    }

    // Percorre os produtos

    carrinho.forEach(function(item) {

        let valorProduto = item.preco * item.quantidade;

        subtotal += valorProduto;

        let produto = document.createElement("div");

        produto.className = "item-carrinho";

        let imagem = item.imagem
            ? `<img src="${item.imagem}" alt="${item.nome}" class="imagem-produto-carrinho">`
            : "";

        produto.innerHTML = `

            ${imagem}

            <div class="info-produto-carrinho">

                <h3>${item.nome}</h3>

                <span>
                    ${formatarPreco(item.preco)}
                </span>

                <p>
                    Total: ${formatarPreco(valorProduto)}
                </p>

                <button
                    class="remover-produto"
                    data-acao="remover"
                    data-id="${item.id}">
                    Remover
                </button>

            </div>

            <div class="controles-quantidade">

                <button
                    data-acao="diminuir"
                    data-id="${item.id}">
                    −
                </button>

                <span>${item.quantidade}</span>

                <button
                    data-acao="aumentar"
                    data-id="${item.id}">
                    +
                </button>

            </div>

        `;

        lista.appendChild(produto);

    });

    // Atualiza os valores

    if (subtotalElemento) {
        subtotalElemento.textContent = formatarPreco(subtotal);
    }

    if (totalElemento) {
        totalElemento.textContent = formatarPreco(subtotal);
    }

}


/* ========================================
   ALTERAR QUANTIDADE
======================================== */

function alterarQuantidade(id, quantidade) {

    let produto = carrinho.find(function(item) {
        return item.id === id;
    });

    if (!produto) return;

    produto.quantidade += quantidade;

    if (produto.quantidade <= 0) {

        removerProduto(id);

        return;

    }

    salvarCarrinho();

    atualizarCarrinho();

}


/* ========================================
   REMOVER PRODUTO
======================================== */

function removerProduto(id) {

    carrinho = carrinho.filter(function(item) {
        return item.id !== id;
    });

    salvarCarrinho();

    atualizarCarrinho();

}


/* ========================================
   BOTÕES DO CARRINHO
======================================== */

document.addEventListener("click", function(event) {

    let botao = event.target.closest("[data-acao]");

    if (!botao) return;

    let id = botao.dataset.id;
    let acao = botao.dataset.acao;

    if (acao === "aumentar") {
        alterarQuantidade(id, 1);
    }

    if (acao === "diminuir") {
        alterarQuantidade(id, -1);
    }

    if (acao === "remover") {
        removerProduto(id);
    }

});


/* ========================================
   BOTÕES DE ADICIONAR PRODUTOS
======================================== */

document.addEventListener("click", function(event) {

    let botao = event.target.closest(
        "[data-adicionar], .adicionar-carrinho"
    );

    if (!botao) return;

    let nome = botao.dataset.nome;
    let preco = Number(
        String(botao.dataset.preco).replace(",", ".")
    );

    let imagemElemento = botao.closest(".produto")?.querySelector("img");

    let imagem = imagemElemento
        ? imagemElemento.src
        : "";

    let produto = {

        id: botao.dataset.id,
        nome: nome,
        preco: preco,
        imagem: imagem

    };

    adicionarCarrinho(produto);

});


/* ========================================
   FINALIZAR PEDIDO
======================================== */

function finalizarPedido() {

    if (carrinho.length === 0) {

        alert("Seu carrinho está vazio!");

        return;
    }

    let mensagem =
        "Olá! Gostaria de fazer um pedido na Doces da Giovanna:\n\n";

    let total = 0;

    carrinho.forEach(function(item) {

        let valor = item.preco * item.quantidade;

        total += valor;

        mensagem +=
            item.nome +
            " - Quantidade: " + item.quantidade +
            " - " + formatarPreco(valor) + "\n";

    });

    mensagem += "\nTotal do pedido: " + formatarPreco(total);

    if (navigator.clipboard && navigator.clipboard.writeText) {

        navigator.clipboard.writeText(mensagem)

            .then(function() {

                window.open(
                    "https://wa.me/qr/7NE5S63ZMAVMK1?s=r",
                    "_blank"
                );

                alert(
                    "Pedido copiado! Agora é só colar a mensagem na conversa do WhatsApp."
                );

            })

            .catch(function() {

                alert("Não foi possível copiar o pedido.");

            });

    } else {

        alert("Seu navegador não permite copiar automaticamente.");

    }

}


// Configura o botão de finalizar

let botoesFinalizar = document.querySelectorAll(
    "#finalizar-pedido, .finalizar-pedido"
);

botoesFinalizar.forEach(function(botao) {

    botao.addEventListener("click", finalizarPedido);

});


/* ========================================
   INICIALIZAÇÃO
======================================== */

atualizarCarrinho();
