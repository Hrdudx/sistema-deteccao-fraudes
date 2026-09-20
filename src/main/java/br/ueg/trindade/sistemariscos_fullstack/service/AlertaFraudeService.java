package br.ueg.trindade.sistemariscos_fullstack.service;

import br.ueg.trindade.sistemariscos_fullstack.exception.RecursoNaoEncontradoException;
import br.ueg.trindade.sistemariscos_fullstack.model.AlertaFraude;
import br.ueg.trindade.sistemariscos_fullstack.repository.AlertaFraudeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.time.LocalDateTime;

@Service
public class AlertaFraudeService {

    private final AlertaFraudeRepository repository;

    public AlertaFraudeService(AlertaFraudeRepository repository) {
        this.repository = repository;
    }

    public List<AlertaFraude> filtrar(
        String status,
        String severidade,
        String tipoFraude,
        LocalDateTime dataInicial,
        LocalDateTime dataFinal,
        String busca
    ) {
    return repository.filtrar(
            status,
            severidade,
            tipoFraude,
            dataInicial,
            dataFinal,
            busca
    );
    }

    public List<AlertaFraude> listarTodos() {
        return repository.findAll();
    }

    public AlertaFraude buscarPorId(String id) {
        return repository.findById(id).orElseThrow(() -> new RecursoNaoEncontradoException("AlertaFraude não encontrado: " + id));
    }

    public AlertaFraude salvar(AlertaFraude objeto) {
        return repository.save(objeto);
    }

    public AlertaFraude atualizar(String id, AlertaFraude objeto) {
        buscarPorId(id);
        objeto.setIdAlertaFraude(id);
        return repository.save(objeto);
    }

    public void excluir(String id) {
        AlertaFraude existente = buscarPorId(id);
        repository.delete(existente);
    }
}
