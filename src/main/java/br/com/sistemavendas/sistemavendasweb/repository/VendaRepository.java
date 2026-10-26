
package br.com.sistemavendas.sistemavendasweb.repository;

import br.com.sistemavendas.sistemavendasweb.model.Venda;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VendaRepository extends JpaRepository<Venda, Long> {
}
