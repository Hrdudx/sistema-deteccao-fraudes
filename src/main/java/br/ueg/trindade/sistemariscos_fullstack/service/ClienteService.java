package br.ueg.trindade.sistemariscos_fullstack.service;

import br.ueg.trindade.sistemariscos_fullstack.exception.RecursoNaoEncontradoException;
import br.ueg.trindade.sistemariscos_fullstack.model.Cliente;
import br.ueg.trindade.sistemariscos_fullstack.repository.ClienteRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClienteService {

    private final ClienteRepository repository;

    public ClienteService(ClienteRepository repository) {
        this.repository = repository;
    }

    public List<Cliente> listarTodos() {
        return repository.findAll();
    }

    public Cliente buscarPorId(String id) {
        return repository.findById(id).orElseThrow(() -> new RecursoNaoEncontradoException("Cliente não encontrado: " + id));
    }

    public Cliente salvar(Cliente objeto) {
        return repository.save(objeto);
    }

    public Cliente atualizar(String id, Cliente objeto) {
        buscarPorId(id);
        objeto.setIdCliente(id);
        return repository.save(objeto);
    }

    public void excluir(String id) {
        Cliente existente = buscarPorId(id);
        repository.delete(existente);
    }
}
