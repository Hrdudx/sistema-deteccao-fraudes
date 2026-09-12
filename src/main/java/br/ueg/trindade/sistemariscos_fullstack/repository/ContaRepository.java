package br.ueg.trindade.sistemariscos_fullstack.repository;

import br.ueg.trindade.sistemariscos_fullstack.model.Conta;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContaRepository extends JpaRepository<Conta, String> {

}