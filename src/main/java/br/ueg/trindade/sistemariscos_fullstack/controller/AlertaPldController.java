package br.ueg.trindade.sistemariscos_fullstack.controller;

import br.ueg.trindade.sistemariscos_fullstack.model.AlertaPld;
import br.ueg.trindade.sistemariscos_fullstack.service.AlertaPldService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alertas-pld")
public class AlertaPldController {

    private final AlertaPldService service;

    public AlertaPldController(AlertaPldService service) {
        this.service = service;
    }

    @GetMapping
    public List<AlertaPld> listarTodos() {
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public AlertaPld buscarPorId(@PathVariable String id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    public ResponseEntity<AlertaPld> criar(@Valid @RequestBody AlertaPld objeto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.salvar(objeto));
    }

    @PutMapping("/{id}")
    public AlertaPld atualizar(@PathVariable String id, @Valid @RequestBody AlertaPld objeto) {
        return service.atualizar(id, objeto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable String id) {
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
