package br.ueg.trindade.sistemariscos_fullstack.repository;

import br.ueg.trindade.sistemariscos_fullstack.model.AlertaFraude;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AlertaFraudeRepository extends JpaRepository<AlertaFraude, String> {
}
