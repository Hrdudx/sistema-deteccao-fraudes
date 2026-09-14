package br.ueg.trindade.sistemariscos_fullstack.service;
 
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import br.ueg.trindade.sistemariscos_fullstack.exception.AutenticacaoException;
import br.ueg.trindade.sistemariscos_fullstack.model.Usuario;
import br.ueg.trindade.sistemariscos_fullstack.repository.UsuarioRepository;
import br.ueg.trindade.sistemariscos_fullstack.exception.UsuarioInativoException;


@Service
public class ControleAutenticacao {

    private final UsuarioRepository usuarioRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public ControleAutenticacao(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public Usuario autenticar(String email, String senha) {

        Usuario usuario = usuarioRepository.findByEmail(email)
            .orElseThrow(() -> new AutenticacaoException("Credenciais inválidas"));

        if (!"ATIVO".equalsIgnoreCase(usuario.getStatus())) {
        throw new UsuarioInativoException("Usuário inativo");
        }

        if (!passwordEncoder.matches(senha, usuario.getSenha())) {
            throw new AutenticacaoException("Credenciais inválidas");
        }

        return usuario;
    }
}