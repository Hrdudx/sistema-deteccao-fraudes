package br.ueg.trindade.sistemariscos_fullstack.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.ueg.trindade.sistemariscos_fullstack.dto.CadastroUsuarioRequest;
import br.ueg.trindade.sistemariscos_fullstack.dto.LoginResponse;
import br.ueg.trindade.sistemariscos_fullstack.model.Usuario;
import br.ueg.trindade.sistemariscos_fullstack.service.UsuarioService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping
    public ResponseEntity<LoginResponse> cadastrar(
            @Valid @RequestBody CadastroUsuarioRequest request) {

        Usuario usuario = usuarioService.cadastrar(request);

        LoginResponse resposta = new LoginResponse(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getPerfil()
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(resposta);
    }
}