
package br.com.sistemavendas.sistemavendasweb;

import br.com.sistemavendas.sistemavendasweb.model.Venda;
import br.com.sistemavendas.sistemavendasweb.repository.ProdutoRepository;
import br.com.sistemavendas.sistemavendasweb.repository.VendaRepository;
import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    private final ProdutoRepository produtoRepository;
    private final VendaRepository vendaRepository;

    public HomeController(
            ProdutoRepository produtoRepository,
            VendaRepository vendaRepository) {
        this.produtoRepository = produtoRepository;
        this.vendaRepository = vendaRepository;
    }

    @GetMapping("/")
    public String inicio(Model model) {

        List<Venda> vendas = vendaRepository.findAll();

        BigDecimal totalVendas = vendas.stream()
                .map(Venda::getTotal)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        model.addAttribute("quantidadeProdutos",
                produtoRepository.count());

        model.addAttribute("quantidadeVendas",
                vendas.size());

        model.addAttribute("totalVendas",
                totalVendas);

        model.addAttribute("ultimasVendas", vendas.stream()
                .sorted(Comparator.comparing(
                        Venda::getData,
                        Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(5)
                .toList());

        return "index";
    }
}
