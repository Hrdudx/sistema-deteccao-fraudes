package br.ueg.trindade.sistemariscos_fullstack.repository;

import br.ueg.trindade.sistemariscos_fullstack.model.RiscoCliente;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RiscoClienteRepository extends JpaRepository<RiscoCliente, String> {
}
