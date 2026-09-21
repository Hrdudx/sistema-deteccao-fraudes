package br.ueg.trindade.sistemariscos_fullstack.repository;

import br.ueg.trindade.sistemariscos_fullstack.model.AlertaPld;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlertaPldRepository extends JpaRepository<AlertaPld, String> {

    List<AlertaPld> findByClienteAnalisado_IdCliente(String idCliente);
}