package br.ueg.trindade.sistemariscos_fullstack.repository;

import br.ueg.trindade.sistemariscos_fullstack.model.AlertaFraude;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlertaFraudeRepository extends JpaRepository<AlertaFraude, String> {

    List<AlertaFraude>
    findByClienteOrigem_IdClienteOrClienteDestino_IdClienteOrClienteVitima_IdClienteOrClienteSuspeito_IdCliente(
            String idClienteOrigem,
            String idClienteDestino,
            String idClienteVitima,
            String idClienteSuspeito
    );
}