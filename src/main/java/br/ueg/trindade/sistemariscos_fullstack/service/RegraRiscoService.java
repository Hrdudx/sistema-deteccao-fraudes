package br.ueg.trindade.sistemariscos_fullstack.service;

import br.ueg.trindade.sistemariscos_fullstack.exception.RecursoNaoEncontradoException;
import br.ueg.trindade.sistemariscos_fullstack.model.RegraRisco;
import br.ueg.trindade.sistemariscos_fullstack.repository.RegraRiscoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RegraRiscoService {

    private final RegraRiscoRepository repository;

    public RegraRiscoService(RegraRiscoRepository repository) {
        this.repository = repository;
    }

    public List<RegraRisco> listarTodos() {
        return repository.findAll();
    }

    public RegraRisco buscarPorId(String id) {
        return repository.findById(id).orElseThrow(() -> new RecursoNaoEncontradoException("RegraRisco não encontrado: " + id));
    }

    public RegraRisco salvar(RegraRisco objeto) {
        return repository.save(objeto);
    }

    public RegraRisco atualizar(String id, RegraRisco objeto) {
        buscarPorId(id);
        objeto.setIdRegra(id);
        return repository.save(objeto);
    }

    public void excluir(String id) {
        RegraRisco existente = buscarPorId(id);
        repository.delete(existente);
    }
}
