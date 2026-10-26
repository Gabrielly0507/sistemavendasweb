
package br.com.sistemavendas.sistemavendasweb.controller;

import br.com.sistemavendas.sistemavendasweb.model.Produto;
import br.com.sistemavendas.sistemavendasweb.repository.ProdutoRepository;
import br.com.sistemavendas.sistemavendasweb.repository.VendaRepository;
import br.com.sistemavendas.sistemavendasweb.service.VendaService;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class VendaController {

    private final ProdutoRepository produtoRepository;
    private final VendaRepository vendaRepository;
    private final VendaService vendaService;

    public VendaController(
            ProdutoRepository produtoRepository,
            VendaRepository vendaRepository,
            VendaService vendaService) {
        this.produtoRepository = produtoRepository;
        this.vendaRepository = vendaRepository;
        this.vendaService = vendaService;
    }

    @GetMapping("/venda")
    public String abrirVenda(Model model) {
        model.addAttribute("produtos", produtoRepository.findAll());
        model.addAttribute("quantidadeVendas", vendaRepository.count());
        return "venda";
    }

    @PostMapping("/venda/finalizar")
    public String finalizarVenda(
            @RequestParam Long codigoProduto,
            @RequestParam Integer quantidade,
            RedirectAttributes atributos) {

        try {
            vendaService.registrarVenda(codigoProduto, quantidade);
            atributos.addFlashAttribute(
                    "sucesso", "Venda realizada com sucesso!");
        } catch (IllegalArgumentException e) {
            atributos.addFlashAttribute("erro", e.getMessage());
        }

        return "redirect:/venda";
    }
}
