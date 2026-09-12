package br.ueg.trindade.sistemariscos_fullstack.controller;

import br.ueg.trindade.sistemariscos_fullstack.model.Kyc;
import br.ueg.trindade.sistemariscos_fullstack.service.KycService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/kycs")
public class KycController {

    private final KycService service;

    public KycController(KycService service) {
        this.service = service;
    }

    @GetMapping
    public List<Kyc> listarTodos() {
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public Kyc buscarPorId(@PathVariable String id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    public ResponseEntity<Kyc> criar(@Valid @RequestBody Kyc objeto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.salvar(objeto));
    }

    @PutMapping("/{id}")
    public Kyc atualizar(@PathVariable String id, @Valid @RequestBody Kyc objeto) {
        return service.atualizar(id, objeto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable String id) {
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
