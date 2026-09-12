package br.ueg.trindade.sistemariscos_fullstack.controller;

import br.ueg.trindade.sistemariscos_fullstack.model.RiscoCliente;
import br.ueg.trindade.sistemariscos_fullstack.service.RiscoClienteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/riscos-clientes")
public class RiscoClienteController {

    private final RiscoClienteService service;

    public RiscoClienteController(RiscoClienteService service) {
        this.service = service;
    }

    @GetMapping
    public List<RiscoCliente> listarTodos() {
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public RiscoCliente buscarPorId(@PathVariable String id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    public ResponseEntity<RiscoCliente> criar(@Valid @RequestBody RiscoCliente objeto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.salvar(objeto));
    }

    @PutMapping("/{id}")
    public RiscoCliente atualizar(@PathVariable String id, @Valid @RequestBody RiscoCliente objeto) {
        return service.atualizar(id, objeto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable String id) {
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
