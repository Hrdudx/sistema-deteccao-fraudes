package br.ueg.trindade.sistemariscos_fullstack;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import br.ueg.trindade.sistemariscos_fullstack.model.Usuario;
import br.ueg.trindade.sistemariscos_fullstack.repository.UsuarioRepository;
import br.ueg.trindade.sistemariscos_fullstack.service.ControleAutenticacao;

class ControleAutenticacaoTest {

    private UsuarioRepository usuarioRepository;
    private ControleAutenticacao controleAutenticacao;
    private BCryptPasswordEncoder passwordEncoder;

    @BeforeEach
    void configurar() {
        usuarioRepository = org.mockito.Mockito.mock(UsuarioRepository.class);
        controleAutenticacao = new ControleAutenticacao(usuarioRepository);
        passwordEncoder = new BCryptPasswordEncoder();
    }

    @Test
    void deveAutenticarUsuarioComCredenciaisValidas() {

        Usuario usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNome("Usuário Teste");
        usuario.setEmail("teste@email.com");
        usuario.setSenha(passwordEncoder.encode("123456"));
        usuario.setStatus("ATIVO");
        usuario.setPerfil("ANALISTA");

        org.mockito.Mockito.when(usuarioRepository.findByEmail("teste@email.com"))
                .thenReturn(Optional.of(usuario));

        Usuario resultado = controleAutenticacao.autenticar(
                "teste@email.com",
                "123456"
        );

        assertEquals("teste@email.com", resultado.getEmail());
        assertEquals("ANALISTA", resultado.getPerfil());
    }

    @Test
    void deveRejeitarSenhaInvalida() {

        Usuario usuario = new Usuario();
        usuario.setEmail("teste@email.com");
        usuario.setSenha(passwordEncoder.encode("123456"));
        usuario.setStatus("ATIVO");
        usuario.setPerfil("ANALISTA");

        org.mockito.Mockito.when(usuarioRepository.findByEmail("teste@email.com"))
                .thenReturn(Optional.of(usuario));

        assertThrows(
                RuntimeException.class,
                () -> controleAutenticacao.autenticar(
                        "teste@email.com",
                        "senhaerrada"
                )
        );
    }

    @Test
    void deveRejeitarUsuarioInexistente() {

        org.mockito.Mockito.when(usuarioRepository.findByEmail("naoexiste@email.com"))
                .thenReturn(Optional.empty());

        assertThrows(
                RuntimeException.class,
                () -> controleAutenticacao.autenticar(
                        "naoexiste@email.com",
                        "123456"
                )
        );
    }

    @Test
    void deveRejeitarUsuarioInativo() {

        Usuario usuario = new Usuario();
        usuario.setEmail("teste@email.com");
        usuario.setSenha(passwordEncoder.encode("123456"));
        usuario.setStatus("INATIVO");
        usuario.setPerfil("ANALISTA");

        org.mockito.Mockito.when(usuarioRepository.findByEmail("teste@email.com"))
                .thenReturn(Optional.of(usuario));

        assertThrows(
                RuntimeException.class,
                () -> controleAutenticacao.autenticar(
                        "teste@email.com",
                        "123456"
                )
        );
    }
}