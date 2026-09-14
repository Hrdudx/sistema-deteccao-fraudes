package br.ueg.trindade.sistemariscos_fullstack.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import br.ueg.trindade.sistemariscos_fullstack.exception.EmailDuplicadoException;
import br.ueg.trindade.sistemariscos_fullstack.dto.CadastroUsuarioRequest;
import br.ueg.trindade.sistemariscos_fullstack.model.Usuario;
import br.ueg.trindade.sistemariscos_fullstack.repository.UsuarioRepository;


@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public Usuario cadastrar(CadastroUsuarioRequest request) {

        if (usuarioRepository.findByEmail(request.getEmail()).isPresent()) {
        throw new EmailDuplicadoException("E-mail já cadastrado");
        }

        Usuario usuario = new Usuario();

        usuario.setNome(request.getNome());
        usuario.setEmail(request.getEmail());
        usuario.setSenha(passwordEncoder.encode(request.getSenha()));
        usuario.setStatus("ATIVO");
        usuario.setPerfil(request.getPerfil());

        return usuarioRepository.save(usuario);
    }
}