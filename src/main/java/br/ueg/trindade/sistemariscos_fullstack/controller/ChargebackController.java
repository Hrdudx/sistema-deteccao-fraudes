package br.ueg.trindade.sistemariscos_fullstack.controller;

import br.ueg.trindade.sistemariscos_fullstack.model.Chargeback;
import br.ueg.trindade.sistemariscos_fullstack.service.ChargebackService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chargebacks")
public class ChargebackController {

    private final ChargebackService service;

    public ChargebackController(ChargebackService service) {
        this.service = service;
    }

    @GetMapping
    public List<Chargeback> listarTodos() {
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public Chargeback buscarPorId(@PathVariable String id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    public ResponseEntity<Chargeback> criar(@Valid @RequestBody Chargeback objeto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.salvar(objeto));
    }

    @PutMapping("/{id}")
    public Chargeback atualizar(@PathVariable String id, @Valid @RequestBody Chargeback objeto) {
        return service.atualizar(id, objeto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable String id) {
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
