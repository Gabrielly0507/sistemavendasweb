
package br.com.sistemavendas.sistemavendasweb.repository;

import br.com.sistemavendas.sistemavendasweb.model.ItemVenda;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemVendaRepository
        extends JpaRepository<ItemVenda, Long> {
}
