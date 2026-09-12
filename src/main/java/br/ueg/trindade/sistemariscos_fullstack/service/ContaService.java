package br.ueg.trindade.sistemariscos_fullstack.service;

import br.ueg.trindade.sistemariscos_fullstack.exception.RecursoNaoEncontradoException;
import br.ueg.trindade.sistemariscos_fullstack.model.Conta;
import br.ueg.trindade.sistemariscos_fullstack.repository.ContaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContaService {

    private final ContaRepository repository;

    public ContaService(ContaRepository repository) {
        this.repository = repository;
    }

    public List<Conta> listarTodos() {
        return repository.findAll();
    }

    public Conta buscarPorId(String id) {
        return repository.findById(id).orElseThrow(() -> new RecursoNaoEncontradoException("Conta não encontrado: " + id));
    }

    public Conta salvar(Conta objeto) {
        return repository.save(objeto);
    }

    public Conta atualizar(String id, Conta objeto) {
        buscarPorId(id);
        objeto.setIdConta(id);
        return repository.save(objeto);
    }

    public void excluir(String id) {
        Conta existente = buscarPorId(id);
        repository.delete(existente);
    }
}
