
document.addEventListener("DOMContentLoaded", function () {

    // Funções para guardar e recuperar dados do navegador
    function lerDados(chave) {
        try {
            return JSON.parse(localStorage.getItem(chave)) || [];
        } catch (erro) {
            return [];
        }
    }

    function salvarDados(chave, dados) {
        localStorage.setItem(chave, JSON.stringify(dados));
    }

    function formatarMoeda(valor) {
        return valor.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    }

    // Dados compartilhados entre as páginas
    let produtos = lerDados("produtos");
    let vendas = lerDados("vendas");

    console.log("Sistema de Vendas carregado!");

    // ==========================================
    // CADASTRO DE PRODUTOS
    // ==========================================

    const formProduto = document.getElementById("formProduto");
    const listaProdutos = document.getElementById("listaProdutos");

    if (formProduto && listaProdutos) {

        function atualizarTabelaProdutos() {
            listaProdutos.innerHTML = "";

            if (produtos.length === 0) {
                listaProdutos.innerHTML =
                    '<tr><td colspan="5">Nenhum produto cadastrado.</td></tr>';
                return;
            }

            produtos.forEach(function (produto) {
                const linha = document.createElement("tr");

                const codigo = document.createElement("td");
                codigo.textContent = produto.codigo;

                const nome = document.createElement("td");
                nome.textContent = produto.nome;

                const preco = document.createElement("td");
                preco.textContent = formatarMoeda(produto.preco);

                const estoque = document.createElement("td");
                estoque.textContent = produto.estoque;

                const acoes = document.createElement("td");
                const botao = document.createElement("button");

                botao.type = "button";
                botao.textContent = "Excluir";
                botao.dataset.codigo = produto.codigo;
                botao.classList.add("btnExcluir");

                acoes.appendChild(botao);

                linha.append(codigo, nome, preco, estoque, acoes);
                listaProdutos.appendChild(linha);
            });
        }

        formProduto.addEventListener("submit", function (evento) {
            evento.preventDefault();

            const nome = document.getElementById("nomeProduto").value.trim();
            const preco = Number(
                document.getElementById("precoProduto").value
            );
            const estoque = Number(
                document.getElementById("estoqueProduto").value
            );

            if (nome === "") {
                alert("Informe o nome do produto.");
                return;
            }

            if (!Number.isFinite(preco) || preco <= 0) {
                alert("Informe um preço maior que zero.");
                return;
            }

            if (!Number.isInteger(estoque) || estoque < 0) {
                alert("Informe uma quantidade inteira igual ou maior que zero.");
                return;
            }

            const novoCodigo = produtos.length > 0
                ? Math.max(...produtos.map(function (p) {
                    return Number(p.codigo);
                })) + 1
                : 1;

            produtos.push({
                codigo: novoCodigo,
                nome: nome,
                preco: preco,
                estoque: estoque
            });

            salvarDados("produtos", produtos);
            atualizarTabelaProdutos();
            formProduto.reset();
            document.getElementById("nomeProduto").focus();
        });

        listaProdutos.addEventListener("click", function (evento) {
            if (evento.target.classList.contains("btnExcluir")) {
                const codigo = Number(evento.target.dataset.codigo);

                const produtoEmVenda = vendas.some(function (venda) {
                    return venda.itens.some(function (item) {
                        return Number(item.codigo) === codigo;
                    });
                });

                if (produtoEmVenda) {
                    alert(
                        "Este produto já aparece em uma venda registrada " +
                        "e não pode ser excluído."
                    );
                    return;
                }

                produtos = produtos.filter(function (produto) {
                    return Number(produto.codigo) !== codigo;
                });

                salvarDados("produtos", produtos);
                atualizarTabelaProdutos();
            }
        });

        atualizarTabelaProdutos();
    }

    // ==========================================
    // NOVA VENDA
    // ==========================================

    const formItemVenda = document.getElementById("formItemVenda");
    const seletorProduto = document.getElementById("produtoVenda");
    const listaItensVenda = document.getElementById("itensVenda");
    const totalVenda = document.getElementById("totalVenda");
    const botaoFinalizar = document.getElementById("finalizarVenda");
    const mensagemVenda = document.getElementById("mensagemVenda");

    if (formItemVenda && seletorProduto && listaItensVenda) {

        let carrinho = [];

        function atualizarSeletorProdutos() {
            seletorProduto.innerHTML =
                '<option value="">Selecione um produto</option>';

            produtos.forEach(function (produto) {
                const opcao = document.createElement("option");

                opcao.value = produto.codigo;
                opcao.textContent =
                    produto.nome + " - " + formatarMoeda(produto.preco) +
                    " (Estoque: " + produto.estoque + ")";

                seletorProduto.appendChild(opcao);
            });

            if (produtos.length === 0) {
                const opcao = document.createElement("option");
                opcao.value = "";
                opcao.textContent = "Cadastre um produto primeiro";
                seletorProduto.appendChild(opcao);
            }
        }

        function atualizarCarrinho() {
            listaItensVenda.innerHTML = "";
            let total = 0;

            if (carrinho.length === 0) {
                listaItensVenda.innerHTML =
                    '<tr><td colspan="5">Nenhum item adicionado.</td></tr>';
            }

            carrinho.forEach(function (item) {
                const subtotal = item.preco * item.quantidade;
                total += subtotal;

                const linha = document.createElement("tr");

                const nome = document.createElement("td");
                nome.textContent = item.nome;

                const preco = document.createElement("td");
                preco.textContent = formatarMoeda(item.preco);

                const quantidade = document.createElement("td");
                quantidade.textContent = item.quantidade;

                const valorSubtotal = document.createElement("td");
                valorSubtotal.textContent = formatarMoeda(subtotal);

                const acoes = document.createElement("td");
                const botao = document.createElement("button");

                botao.type = "button";
                botao.textContent = "Remover";
                botao.dataset.codigo = item.codigo;
                botao.classList.add("btnRemoverItem");

                acoes.appendChild(botao);
                linha.append(nome, preco, quantidade, valorSubtotal, acoes);
                listaItensVenda.appendChild(linha);
            });

            totalVenda.textContent = "Total: " + formatarMoeda(total);
        }

        formItemVenda.addEventListener("submit", function (evento) {
            evento.preventDefault();
            mensagemVenda.textContent = "";

            const codigo = Number(seletorProduto.value);
            const quantidade = Number(
                document.getElementById("quantidadeVenda").value
            );

            const produto = produtos.find(function (p) {
                return Number(p.codigo) === codigo;
            });

            if (!produto) {
                alert("Selecione um produto válido.");
                return;
            }

            if (!Number.isInteger(quantidade) || quantidade < 1) {
                alert("Informe uma quantidade inteira maior que zero.");
                return;
            }

            const itemExistente = carrinho.find(function (item) {
                return Number(item.codigo) === codigo;
            });

            const quantidadeNoCarrinho = itemExistente
                ? itemExistente.quantidade
                : 0;

            if (quantidade + quantidadeNoCarrinho > produto.estoque) {
                alert("Estoque insuficiente. Disponível: " + produto.estoque);
                return;
            }

            if (itemExistente) {
                itemExistente.quantidade += quantidade;
            } else {
                carrinho.push({
                    codigo: produto.codigo,
                    nome: produto.nome,
                    preco: produto.preco,
                    quantidade: quantidade
                });
            }

            atualizarCarrinho();
            document.getElementById("quantidadeVenda").value = 1;
        });

        listaItensVenda.addEventListener("click", function (evento) {
            if (evento.target.classList.contains("btnRemoverItem")) {
                const codigo = Number(evento.target.dataset.codigo);

                carrinho = carrinho.filter(function (item) {
                    return Number(item.codigo) !== codigo;
                });

                atualizarCarrinho();
            }
        });

        botaoFinalizar.addEventListener("click", function () {
            mensagemVenda.textContent = "";

            if (carrinho.length === 0) {
                alert("Adicione pelo menos um produto à venda.");
                return;
            }

            // Confere novamente o estoque antes de finalizar
            for (const item of carrinho) {
                const produto = produtos.find(function (p) {
                    return Number(p.codigo) === Number(item.codigo);
                });

                if (!produto || produto.estoque < item.quantidade) {
                    alert("Estoque insuficiente para o produto: " + item.nome);
                    atualizarSeletorProdutos();
                    return;
                }
            }

            const total = carrinho.reduce(function (soma, item) {
                return soma + item.preco * item.quantidade;
            }, 0);

            // Baixa as quantidades do estoque
            carrinho.forEach(function (item) {
                const produto = produtos.find(function (p) {
                    return Number(p.codigo) === Number(item.codigo);
                });

                produto.estoque -= item.quantidade;
            });

            const novaVenda = {
                codigo: vendas.length > 0
                    ? Math.max(...vendas.map(function (v) {
                        return Number(v.codigo);
                    })) + 1
                    : 1,

                data: new Date().toLocaleString("pt-BR"),

                itens: carrinho.map(function (item) {
                    return {
                        codigo: item.codigo,
                        nome: item.nome,
                        preco: item.preco,
                        quantidade: item.quantidade
                    };
                }),

                total: total
            };

            vendas.push(novaVenda);

            salvarDados("produtos", produtos);
            salvarDados("vendas", vendas);

            carrinho = [];
            atualizarCarrinho();
            atualizarSeletorProdutos();

            mensagemVenda.textContent =
                "Venda #" + novaVenda.codigo + " finalizada com sucesso!";

            formItemVenda.reset();
            document.getElementById("quantidadeVenda").value = 1;
        });

        atualizarSeletorProdutos();
        atualizarCarrinho();
    }

    // ==========================================
    // PAINEL INICIAL
    // ==========================================

    const totalVendasPainel = document.getElementById("totalVendas");
    const totalProdutosPainel = document.getElementById("totalProdutos");
    const quantidadeVendasPainel =
        document.getElementById("quantidadeVendas");

    if (totalVendasPainel) {
        const somaVendas = vendas.reduce(function (soma, venda) {
            return soma + Number(venda.total);
        }, 0);

        totalVendasPainel.textContent = formatarMoeda(somaVendas);
    }

    if (totalProdutosPainel) {
        totalProdutosPainel.textContent = produtos.length;
    }

    if (quantidadeVendasPainel) {
        quantidadeVendasPainel.textContent = vendas.length;
    }

    // ==========================================
    // HISTÓRICO DE VENDAS
    // ==========================================

    const pesquisaVenda = document.getElementById("pesquisaVenda");
    const filtroSituacao = document.getElementById("filtroSituacao");
    const listaHistorico = document.getElementById("listaHistorico");
    const quantidadeHistorico =
        document.getElementById("quantidadeHistorico");

    if (pesquisaVenda && filtroSituacao && listaHistorico) {

        function atualizarHistorico() {
            const termo = pesquisaVenda.value.trim().toLowerCase();
            const situacao = filtroSituacao.value;

            const vendasFiltradas = vendas.filter(function (venda) {
                const codigo = String(venda.codigo);

                const nomesProdutos = venda.itens.map(function (item) {
                    return item.nome;
                }).join(" ").toLowerCase();

                const correspondePesquisa =
                    codigo.includes(termo) || nomesProdutos.includes(termo);

                const correspondeSituacao =
                    situacao === "todas" || situacao === "registrada";

                return correspondePesquisa && correspondeSituacao;
            });

            listaHistorico.innerHTML = "";

            if (vendasFiltradas.length === 0) {
                listaHistorico.innerHTML =
                    '<tr><td colspan="5">Nenhuma venda encontrada.</td></tr>';
            }

            vendasFiltradas.forEach(function (venda) {
                const linha = document.createElement("tr");

                const codigo = document.createElement("td");
                codigo.textContent = venda.codigo;

                const data = document.createElement("td");
                data.textContent = venda.data;

                const nomes = document.createElement("td");
                nomes.textContent = venda.itens.map(function (item) {
                    return item.nome + " (x" + item.quantidade + ")";
                }).join(", ");

                const total = document.createElement("td");
                total.textContent = formatarMoeda(venda.total);

                const situacao = document.createElement("td");
                situacao.textContent = "Registrada";

                linha.append(codigo, data, nomes, total, situacao);
                listaHistorico.appendChild(linha);
            });

            quantidadeHistorico.textContent =
                "Vendas encontradas: " + vendasFiltradas.length;
        }

        pesquisaVenda.addEventListener("input", atualizarHistorico);
        filtroSituacao.addEventListener("change", atualizarHistorico);

        atualizarHistorico();
    }

});
