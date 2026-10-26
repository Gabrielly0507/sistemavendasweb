
package br.com.sistemavendas.sistemavendasweb.repository;

import br.com.sistemavendas.sistemavendasweb.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {
}
