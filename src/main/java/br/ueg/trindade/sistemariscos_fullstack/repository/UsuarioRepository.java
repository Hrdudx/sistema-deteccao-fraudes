package br.ueg.trindade.sistemariscos_fullstack.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import br.ueg.trindade.sistemariscos_fullstack.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByEmail(String email);

}