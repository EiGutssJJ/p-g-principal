
/* ========================================
   CARROSSEL
======================================== */

let slides = document.querySelectorAll(".slide");
let slideAtual = 0;

function mostrarSlide() {

    if (slides.length === 0) {
        return;
    }

    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    slides[slideAtual].style.display = "block";
}

mostrarSlide();

function mudarSlide(direcao) {

    slideAtual = slideAtual + direcao;

    if (slideAtual >= slides.length) {
        slideAtual = 0;
    }

    if (slideAtual < 0) {
        slideAtual = slides.length - 1;
    }

    mostrarSlide();
}

// Troca automática a cada 4 segundos

setInterval(function() {
    mudarSlide(1);
}, 4000);


/* ========================================
   LOGIN E CADASTRO
======================================== */

function abrirUsuario(event) {

    event.preventDefault();

    document.getElementById("modalUsuario").style.display = "flex";
}

function fecharUsuario() {

    document.getElementById("modalUsuario").style.display = "none";
}

function abrirCadastro(event) {

    event.preventDefault();

    document.querySelector(".form-login").style.display = "none";

    document.querySelector(".cadastro").style.display = "none";

    document.getElementById("formCadastro").style.display = "flex";
}

function voltarLogin(event) {

    event.preventDefault();

    document.querySelector(".form-login").style.display = "flex";

    document.querySelector(".cadastro").style.display = "block";

    document.getElementById("formCadastro").style.display = "none";
}


/* ========================================
   CARRINHO DE COMPRAS
======================================== */

// Recupera os produtos salvos no navegador

let carrinho = [];

try {
    carrinho = JSON.parse(localStorage.getItem("carrinhoGiovana")) || [];
} catch (erro) {
    carrinho = [];
}

// Formatação dos valores em reais

function formatarPreco(valor) {

    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

// Salva o carrinho no navegador

function salvarCarrinho() {

    localStorage.setItem("carrinhoGiovana", JSON.stringify(carrinho));
}


// ABRIR CARRINHO

function abrirCarrinho(event) {

    if (event) {
        event.preventDefault();
    }

    document.getElementById("modalCarrinho").style.display = "flex";

    atualizarCarrinho();
}


// FECHAR CARRINHO

function fecharCarrinho() {

    document.getElementById("modalCarrinho").style.display = "none";
}


// ADICIONAR PRODUTO

function adicionarCarrinho(nome, preco) {

    preco = Number(String(preco).replace(",", "."));

    if (!nome || !Number.isFinite(preco) || preco <= 0) {
        alert("Produto ou preço inválido!");
        return;
    }

    let produtoExistente = carrinho.find(function(item) {
        return item.nome === nome && item.preco === preco;
    });

    if (produtoExistente) {

        produtoExistente.quantidade++;

    } else {

        carrinho.push({
            nome: nome,
            preco: preco,
            quantidade: 1
        });

    }

    salvarCarrinho();

    atualizarCarrinho();

    alert(nome + " foi adicionado ao carrinho!");
}


// ATUALIZAR CARRINHO

function atualizarCarrinho() {

    let lista = document.getElementById("listaCarrinho");

    let subtotalElemento = document.getElementById("subtotal");

    let totalElemento = document.getElementById("total");

    lista.innerHTML = "";

    let subtotal = 0;

    if (carrinho.length === 0) {

        lista.innerHTML = '<p class="carrinho-vazio">Seu carrinho está vazio.</p>';

    }

    carrinho.forEach(function(item, indice) {

        let valorProduto = item.preco * item.quantidade;

        subtotal += valorProduto;

        let produto = document.createElement("div");

        produto.className = "item-carrinho";

        produto.innerHTML = `
            <div class="info-produto-carrinho">

                <span class="produto-carrinho">${item.nome}</span>

                <span class="preco-produto-carrinho">
                    ${formatarPreco(valorProduto)}
                </span>

                <button class="remover-produto" onclick="removerProduto(${indice})">
                    Remover
                </button>

            </div>

            <div class="controles-quantidade">

                <button onclick="alterarQuantidade(${indice}, -1)">−</button>

                <span>${item.quantidade}</span>

                <button onclick="alterarQuantidade(${indice}, 1)">+</button>

            </div>
        `;

        lista.appendChild(produto);

    });

    subtotalElemento.textContent = formatarPreco(subtotal);

    totalElemento.textContent = formatarPreco(subtotal);
}


// AUMENTAR OU DIMINUIR QUANTIDADE

function alterarQuantidade(indice, quantidade) {

    carrinho[indice].quantidade += quantidade;

    if (carrinho[indice].quantidade <= 0) {

        carrinho.splice(indice, 1);

    }

    salvarCarrinho();

    atualizarCarrinho();
}


// REMOVER PRODUTO

function removerProduto(indice) {

    carrinho.splice(indice, 1);

    salvarCarrinho();

    atualizarCarrinho();
}


/* ========================================
   FINALIZAR PEDIDO
======================================== */

function finalizarPedido() {

    if (carrinho.length === 0) {

        alert("Seu carrinho está vazio!");

        return;
    }

    let mensagem = "Olá! Gostaria de fazer um pedido na Doces da Giovana:\n\n";

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

    // Copia o pedido para facilitar o envio pelo WhatsApp

    if (navigator.clipboard && navigator.clipboard.writeText) {

        navigator.clipboard.writeText(mensagem)
            .then(function() {

                window.open(
                    "https://wa.me/qr/7NE5S63ZMAVMK1?s=r",
                    "_blank"
                );

                alert("Pedido copiado! Agora é só colar a mensagem na conversa do WhatsApp.");

            })
            .catch(function() {

                alert("Não foi possível copiar automaticamente. Tente novamente.");

            });

    } else {

        alert("Seu navegador não permite copiar automaticamente. Utilize outro navegador para finalizar o pedido.");

    }

}


/* ========================================
   BOTÕES DE ADICIONAR PRODUTOS
======================================== */

// Identifica os botões de adicionar ao carrinho

document.addEventListener("click", function(event) {

    let botao = event.target.closest(".adicionar-carrinho");

    if (!botao) {
        return;
    }

    let nome = botao.dataset.nome;

    let preco = botao.dataset.preco;

    adicionarCarrinho(nome, preco);

});


// Atualiza o carrinho ao abrir a página

atualizarCarrinho();


// Botão de finalizar pedido

document.querySelector(".finalizar-pedido").addEventListener("click", finalizarPedido);
