package br.ueg.trindade.sistemariscos_fullstack.repository;

import br.ueg.trindade.sistemariscos_fullstack.model.Transacao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransacaoRepository extends JpaRepository<Transacao, String> {

    List<Transacao>
    findByClienteOrigem_IdClienteOrClienteDestino_IdCliente(
            String idClienteOrigem,
            String idClienteDestino
    );
}