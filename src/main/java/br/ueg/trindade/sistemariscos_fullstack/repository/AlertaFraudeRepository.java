package br.ueg.trindade.sistemariscos_fullstack.repository;

import br.ueg.trindade.sistemariscos_fullstack.model.AlertaFraude;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface AlertaFraudeRepository
        extends JpaRepository<AlertaFraude, String> {

    //busca alertas associados a um cliente
    List<AlertaFraude>
    findByClienteOrigem_IdClienteOrClienteDestino_IdClienteOrClienteVitima_IdClienteOrClienteSuspeito_IdCliente(
            String idClienteOrigem,
            String idClienteDestino,
            String idClienteVitima,
            String idClienteSuspeito
    );

    //filtra alertas por critérios
    @Query("""
        SELECT a
        FROM AlertaFraude a
        WHERE (:status IS NULL OR a.statusAnalise = :status)
          AND (:severidade IS NULL OR a.severidade = :severidade)
          AND (:tipoFraude IS NULL OR a.tipoFraude = :tipoFraude)
          AND (:dataInicial IS NULL OR a.dataAlerta >= :dataInicial)
          AND (:dataFinal IS NULL OR a.dataAlerta <= :dataFinal)
          AND (
              :busca IS NULL
              OR LOWER(a.clienteOrigem.nomeRazaoSocial)
                    LIKE LOWER(CONCAT('%', :busca, '%'))
              OR LOWER(a.clienteOrigem.documentoFicticio)
                    LIKE LOWER(CONCAT('%', :busca, '%'))
              OR LOWER(a.clienteDestino.nomeRazaoSocial)
                    LIKE LOWER(CONCAT('%', :busca, '%'))
              OR LOWER(a.clienteDestino.documentoFicticio)
                    LIKE LOWER(CONCAT('%', :busca, '%'))
              OR LOWER(a.clienteVitima.nomeRazaoSocial)
                    LIKE LOWER(CONCAT('%', :busca, '%'))
              OR LOWER(a.clienteVitima.documentoFicticio)
                    LIKE LOWER(CONCAT('%', :busca, '%'))
              OR LOWER(a.clienteSuspeito.nomeRazaoSocial)
                    LIKE LOWER(CONCAT('%', :busca, '%'))
              OR LOWER(a.clienteSuspeito.documentoFicticio)
                    LIKE LOWER(CONCAT('%', :busca, '%'))
          )
        ORDER BY a.dataAlerta DESC
        """)
    List<AlertaFraude> filtrar(
            @Param("status") String status,
            @Param("severidade") String severidade,
            @Param("tipoFraude") String tipoFraude,
            @Param("dataInicial") LocalDateTime dataInicial,
            @Param("dataFinal") LocalDateTime dataFinal,
            @Param("busca") String busca
    );
}
