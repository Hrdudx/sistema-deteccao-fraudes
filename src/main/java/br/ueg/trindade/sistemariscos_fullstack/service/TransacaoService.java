package br.ueg.trindade.sistemariscos_fullstack.service;

import br.ueg.trindade.sistemariscos_fullstack.exception.RecursoNaoEncontradoException;
import br.ueg.trindade.sistemariscos_fullstack.model.Transacao;
import br.ueg.trindade.sistemariscos_fullstack.repository.TransacaoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransacaoService {

    private final TransacaoRepository repository;

    public TransacaoService(TransacaoRepository repository) {
        this.repository = repository;
    }

    public List<Transacao> listarTodos() {
        return repository.findAll();
    }

    public Transacao buscarPorId(String id) {
        return repository.findById(id).orElseThrow(() -> new RecursoNaoEncontradoException("Transacao não encontrado: " + id));
    }

    public Transacao salvar(Transacao objeto) {
        return repository.save(objeto);
    }

    public Transacao atualizar(String id, Transacao objeto) {
        buscarPorId(id);
        objeto.setIdTransacao(id);
        return repository.save(objeto);
    }

    public void excluir(String id) {
        Transacao existente = buscarPorId(id);
        repository.delete(existente);
    }
}
