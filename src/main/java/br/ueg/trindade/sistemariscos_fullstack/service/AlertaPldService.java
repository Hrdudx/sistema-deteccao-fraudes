package br.ueg.trindade.sistemariscos_fullstack.service;

import br.ueg.trindade.sistemariscos_fullstack.exception.RecursoNaoEncontradoException;
import br.ueg.trindade.sistemariscos_fullstack.model.AlertaPld;
import br.ueg.trindade.sistemariscos_fullstack.repository.AlertaPldRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AlertaPldService {

    private final AlertaPldRepository repository;

    public AlertaPldService(AlertaPldRepository repository) {
        this.repository = repository;
    }

    public List<AlertaPld> listarTodos() {
        return repository.findAll();
    }

    public AlertaPld buscarPorId(String id) {
        return repository.findById(id).orElseThrow(() -> new RecursoNaoEncontradoException("AlertaPld não encontrado: " + id));
    }

    public AlertaPld salvar(AlertaPld objeto) {
        return repository.save(objeto);
    }

    public AlertaPld atualizar(String id, AlertaPld objeto) {
        buscarPorId(id);
        objeto.setIdAlertaPld(id);
        return repository.save(objeto);
    }

    public void excluir(String id) {
        AlertaPld existente = buscarPorId(id);
        repository.delete(existente);
    }
}
