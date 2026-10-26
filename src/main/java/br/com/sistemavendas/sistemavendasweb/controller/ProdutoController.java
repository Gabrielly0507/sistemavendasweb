
package br.com.sistemavendas.sistemavendasweb.controller;

import br.com.sistemavendas.sistemavendasweb.model.Produto;
import br.com.sistemavendas.sistemavendasweb.repository.ProdutoRepository;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class ProdutoController {

    private final ProdutoRepository produtoRepository;

    public ProdutoController(ProdutoRepository produtoRepository) {
        this.produtoRepository = produtoRepository;
    }

    @GetMapping("/produtos")
    public String listarProdutos(Model model) {
        model.addAttribute("produto", new Produto());
        model.addAttribute("produtos", produtoRepository.findAll());
        return "produtos";
    }

    @PostMapping("/produtos")
    public String cadastrarProduto(
            @Valid @ModelAttribute("produto") Produto produto,
            BindingResult resultado,
            Model model,
            RedirectAttributes atributos) {

        if (resultado.hasErrors()) {
            model.addAttribute("produtos", produtoRepository.findAll());
            return "produtos";
        }

        produtoRepository.save(produto);
        atributos.addFlashAttribute("sucesso", "Produto cadastrado com sucesso!");

        return "redirect:/produtos";
    }

    @PostMapping("/produtos/excluir/{codigo}")
    public String excluirProduto(
            @org.springframework.web.bind.annotation.PathVariable Long codigo,
            RedirectAttributes atributos) {

        if (produtoRepository.existsById(codigo)) {
            produtoRepository.deleteById(codigo);
            atributos.addFlashAttribute("sucesso", "Produto excluído com sucesso!");
        }

        return "redirect:/produtos";
    }
}
