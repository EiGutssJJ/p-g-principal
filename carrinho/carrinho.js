
// ===================================
// CONFIGURAÇÕES DO CARRINHO
// ===================================

// Recupera os produtos salvos no navegador
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];


// ===================================
// SALVAR CARRINHO
// ===================================

function salvarCarrinho() {

    localStorage.setItem("carrinho", JSON.stringify(carrinho));

}


// ===================================
// ADICIONAR PRODUTOS
// ===================================

function adicionarCarrinho(produto) {

    // Verifica se o produto já existe
    let produtoExistente = carrinho.find(item => item.id === produto.id);

    if (produtoExistente) {

        // Aumenta a quantidade
        produtoExistente.quantidade++;

    } else {

        // Adiciona um novo produto
        carrinho.push({
            id: produto.id,
            nome: produto.nome,
            preco: produto.preco,
            imagem: produto.imagem,
            quantidade: 1
        });

    }

    salvarCarrinho();

    atualizarCarrinho();

    alert("Produto adicionado ao carrinho!");

}


// ===================================
// AUMENTAR QUANTIDADE
// ===================================

function aumentarQuantidade(id) {

    let produto = carrinho.find(item => item.id === id);

    if (produto) {
        produto.quantidade++;
    }

    salvarCarrinho();

    atualizarCarrinho();

}


// ===================================
// DIMINUIR QUANTIDADE
// ===================================

function diminuirQuantidade(id) {

    let produto = carrinho.find(item => item.id === id);

    if (produto) {

        produto.quantidade--;

        // Remove se chegar a zero
        if (produto.quantidade <= 0) {

            removerProduto(id);

            return;

        }

    }

    salvarCarrinho();

    atualizarCarrinho();

}


// ===================================
// REMOVER PRODUTO
// ===================================

function removerProduto(id) {

    carrinho = carrinho.filter(item => item.id !== id);

    salvarCarrinho();

    atualizarCarrinho();

}


// ===================================
// ATUALIZAR VALORES E PRODUTOS
// ===================================

function atualizarCarrinho() {

    let lista = document.getElementById("lista-carrinho");

    let subtotalElemento = document.getElementById("subtotal");

    let totalElemento = document.getElementById("total");

    if (!lista) return;

    // Verifica se o carrinho está vazio
    if (carrinho.length === 0) {

        lista.innerHTML = `
            <p class="carrinho-vazio">
                Seu carrinho está vazio.
            </p>
        `;

        subtotalElemento.textContent = "R$ 0,00";

        totalElemento.textContent = "R$ 0,00";

        return;

    }

    let subtotal = 0;

    lista.innerHTML = "";

    // Percorre todos os produtos
    carrinho.forEach(produto => {

        let totalProduto = produto.preco * produto.quantidade;

        subtotal += totalProduto;

        let item = document.createElement("div");

        item.classList.add("produto-carrinho");

        let imagem = produto.imagem
            ? `<img src="${produto.imagem}" alt="${produto.nome}">`
            : "";

        item.innerHTML = `
            ${imagem}

            <div class="informacoes-produto">

                <h3>${produto.nome}</h3>

                <p>Preço: ${produto.preco.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL"
                })}</p>

                <div class="quantidade">

                    <button data-acao="diminuir" data-id="${produto.id}">
                        -
                    </button>

                    <span>${produto.quantidade}</span>

                    <button data-acao="aumentar" data-id="${produto.id}">
                        +
                    </button>

                </div>

                <p>
                    Total: ${totalProduto.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL"
                    })}
                </p>

                <button data-acao="remover" data-id="${produto.id}">
                    Remover
                </button>

            </div>
        `;

        lista.appendChild(item);

    });

    // Atualiza os valores
    subtotalElemento.textContent = subtotal.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    totalElemento.textContent = subtotal.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

}


// ===================================
// CLIQUES NOS BOTÕES DO CARRINHO
// ===================================

document.addEventListener("click", function(event) {

    let botao = event.target.closest("[data-acao]");

    if (!botao) return;

    let id = botao.dataset.id;

    let acao = botao.dataset.acao;

    if (acao === "aumentar") {
        aumentarQuantidade(id);
    }

    if (acao === "diminuir") {
        diminuirQuantidade(id);
    }

    if (acao === "remover") {
        removerProduto(id);
    }

});


// ===================================
// BOTÕES DE ADICIONAR PRODUTOS
// ===================================

document.addEventListener("click", function(event) {

    let botao = event.target.closest("[data-adicionar]");

    if (!botao) return;

    let produto = {

        id: botao.dataset.id,

        nome: botao.dataset.nome,

        preco: Number(botao.dataset.preco.replace(",", ".")),

        imagem: botao.dataset.imagem || ""

    };

    if (!produto.id || !produto.nome || !Number.isFinite(produto.preco) || produto.preco <= 0) {
        alert("Não foi possível adicionar este produto. Confira seus dados.");
        return;
    }

    adicionarCarrinho(produto);

});


// ===================================
// FINALIZAR PEDIDO
// ===================================

let botaoFinalizar = document.getElementById("finalizar-pedido");

if (botaoFinalizar) {

    botaoFinalizar.addEventListener("click", function() {

        if (carrinho.length === 0) {

            alert("Seu carrinho está vazio!");

            return;

        }

        alert("Seu pedido está organizado! Em breve vamos configurar o envio pelo WhatsApp.");

    });

}


// ===================================
// INICIALIZAR CARRINHO
// ===================================

atualizarCarrinho();
