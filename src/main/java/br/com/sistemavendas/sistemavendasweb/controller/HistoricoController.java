
package br.com.sistemavendas.sistemavendasweb.controller;

import br.com.sistemavendas.sistemavendasweb.repository.VendaRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HistoricoController {

    private final VendaRepository vendaRepository;

    public HistoricoController(VendaRepository vendaRepository) {
        this.vendaRepository = vendaRepository;
    }

    @GetMapping("/historico")
    public String listarHistorico(Model model) {
        model.addAttribute("vendas", vendaRepository.findAll());
        return "historico";
    }
}
