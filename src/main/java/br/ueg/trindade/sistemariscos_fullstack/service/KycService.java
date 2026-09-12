package br.ueg.trindade.sistemariscos_fullstack.service;

import br.ueg.trindade.sistemariscos_fullstack.exception.RecursoNaoEncontradoException;
import br.ueg.trindade.sistemariscos_fullstack.model.Kyc;
import br.ueg.trindade.sistemariscos_fullstack.repository.KycRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KycService {

    private final KycRepository repository;

    public KycService(KycRepository repository) {
        this.repository = repository;
    }

    public List<Kyc> listarTodos() {
        return repository.findAll();
    }

    public Kyc buscarPorId(String id) {
        return repository.findById(id).orElseThrow(() -> new RecursoNaoEncontradoException("Kyc não encontrado: " + id));
    }

    public Kyc salvar(Kyc objeto) {
        return repository.save(objeto);
    }

    public Kyc atualizar(String id, Kyc objeto) {
        buscarPorId(id);
        objeto.setIdKyc(id);
        return repository.save(objeto);
    }

    public void excluir(String id) {
        Kyc existente = buscarPorId(id);
        repository.delete(existente);
    }
}
