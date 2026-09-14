package br.ueg.trindade.sistemariscos_fullstack.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.ueg.trindade.sistemariscos_fullstack.dto.LoginRequest;
import br.ueg.trindade.sistemariscos_fullstack.dto.LoginResponse;
import br.ueg.trindade.sistemariscos_fullstack.model.Usuario;
import br.ueg.trindade.sistemariscos_fullstack.service.ControleAutenticacao;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final ControleAutenticacao controleAutenticacao;

    public AuthController(ControleAutenticacao controleAutenticacao) {
        this.controleAutenticacao = controleAutenticacao;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request) {

        Usuario usuario = controleAutenticacao.autenticar(
                request.getEmail(),
                request.getSenha()
        );

        LoginResponse resposta = new LoginResponse(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getPerfil()
        );

        return ResponseEntity.ok(resposta);
    }
}