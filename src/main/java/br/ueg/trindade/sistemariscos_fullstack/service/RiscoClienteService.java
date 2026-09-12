package br.ueg.trindade.sistemariscos_fullstack.service;

import br.ueg.trindade.sistemariscos_fullstack.exception.RecursoNaoEncontradoException;
import br.ueg.trindade.sistemariscos_fullstack.model.RiscoCliente;
import br.ueg.trindade.sistemariscos_fullstack.repository.RiscoClienteRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RiscoClienteService {

    private final RiscoClienteRepository repository;

    public RiscoClienteService(RiscoClienteRepository repository) {
        this.repository = repository;
    }

    public List<RiscoCliente> listarTodos() {
        return repository.findAll();
    }

    public RiscoCliente buscarPorId(String id) {
        return repository.findById(id).orElseThrow(() -> new RecursoNaoEncontradoException("RiscoCliente não encontrado: " + id));
    }

    public RiscoCliente salvar(RiscoCliente objeto) {
        return repository.save(objeto);
    }

    public RiscoCliente atualizar(String id, RiscoCliente objeto) {
        buscarPorId(id);
        objeto.setIdCliente(id);
        return repository.save(objeto);
    }

    public void excluir(String id) {
        RiscoCliente existente = buscarPorId(id);
        repository.delete(existente);
    }
}
