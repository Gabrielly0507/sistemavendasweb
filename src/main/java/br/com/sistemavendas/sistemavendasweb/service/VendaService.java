
package br.com.sistemavendas.sistemavendasweb.service;

import br.com.sistemavendas.sistemavendasweb.model.ItemVenda;
import br.com.sistemavendas.sistemavendasweb.model.Produto;
import br.com.sistemavendas.sistemavendasweb.model.Venda;
import br.com.sistemavendas.sistemavendasweb.repository.ItemVendaRepository;
import br.com.sistemavendas.sistemavendasweb.repository.ProdutoRepository;
import br.com.sistemavendas.sistemavendasweb.repository.VendaRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class VendaService {

    private final ProdutoRepository produtoRepository;
    private final VendaRepository vendaRepository;
    private final ItemVendaRepository itemVendaRepository;

    public VendaService(
            ProdutoRepository produtoRepository,
            VendaRepository vendaRepository,
            ItemVendaRepository itemVendaRepository) {
        this.produtoRepository = produtoRepository;
        this.vendaRepository = vendaRepository;
        this.itemVendaRepository = itemVendaRepository;
    }

    @Transactional
    public Venda registrarVenda(Long codigoProduto, Integer quantidade) {

        if (codigoProduto == null || quantidade == null || quantidade < 1) {
            throw new IllegalArgumentException(
                    "Informe um produto e uma quantidade válida.");
        }

        Produto produto = produtoRepository.findById(codigoProduto)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Produto não encontrado."));

        if (produto.getEstoque() < quantidade) {
            throw new IllegalArgumentException(
                    "Estoque insuficiente para este produto.");
        }

        BigDecimal total = produto.getPreco()
                .multiply(BigDecimal.valueOf(quantidade));

        Venda venda = new Venda();
        venda.setData(LocalDateTime.now());
        venda.setTotal(total);
        venda = vendaRepository.save(venda);

        ItemVenda item = new ItemVenda();
        item.setVenda(venda);
        item.setProduto(produto);
        item.setQuantidade(quantidade);
        item.setPrecoUnitario(produto.getPreco());
        itemVendaRepository.save(item);

        produto.setEstoque(produto.getEstoque() - quantidade);
        produtoRepository.save(produto);

        return venda;
    }
}
