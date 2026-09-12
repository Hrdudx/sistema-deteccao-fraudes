package br.ueg.trindade.sistemariscos_fullstack.controller;

import br.ueg.trindade.sistemariscos_fullstack.model.AlertaFraude;
import br.ueg.trindade.sistemariscos_fullstack.service.AlertaFraudeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alertas-fraude")
public class AlertaFraudeController {

    private final AlertaFraudeService service;

    public AlertaFraudeController(AlertaFraudeService service) {
        this.service = service;
    }

    @GetMapping
    public List<AlertaFraude> listarTodos() {
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public AlertaFraude buscarPorId(@PathVariable String id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    public ResponseEntity<AlertaFraude> criar(@Valid @RequestBody AlertaFraude objeto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.salvar(objeto));
    }

    @PutMapping("/{id}")
    public AlertaFraude atualizar(@PathVariable String id, @Valid @RequestBody AlertaFraude objeto) {
        return service.atualizar(id, objeto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable String id) {
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
