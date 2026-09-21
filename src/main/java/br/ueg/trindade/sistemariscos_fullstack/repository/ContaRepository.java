package br.ueg.trindade.sistemariscos_fullstack.repository;

import br.ueg.trindade.sistemariscos_fullstack.model.Conta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContaRepository extends JpaRepository<Conta, String> {

    List<Conta> findByCliente_IdCliente(String idCliente);
}