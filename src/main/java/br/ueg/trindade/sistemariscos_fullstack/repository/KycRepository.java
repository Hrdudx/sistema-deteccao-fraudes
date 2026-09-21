package br.ueg.trindade.sistemariscos_fullstack.repository;

import br.ueg.trindade.sistemariscos_fullstack.model.Kyc;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface KycRepository extends JpaRepository<Kyc, String> {

    List<Kyc> findByCliente_IdCliente(String idCliente);
}