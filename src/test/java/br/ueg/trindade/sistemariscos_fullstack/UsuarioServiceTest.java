package br.ueg.trindade.sistemariscos_fullstack;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import br.ueg.trindade.sistemariscos_fullstack.exception.EmailDuplicadoException;
import br.ueg.trindade.sistemariscos_fullstack.dto.CadastroUsuarioRequest;
import br.ueg.trindade.sistemariscos_fullstack.model.Usuario;
import br.ueg.trindade.sistemariscos_fullstack.repository.UsuarioRepository;
import br.ueg.trindade.sistemariscos_fullstack.service.UsuarioService;


class UsuarioServiceTest {

    private UsuarioRepository usuarioRepository;
    private UsuarioService usuarioService;

    @BeforeEach
    void configurar() {
        usuarioRepository = org.mockito.Mockito.mock(UsuarioRepository.class);
        usuarioService = new UsuarioService(usuarioRepository);
    }

    @Test
    void deveRecusarCadastroComEmailJaCadastrado() {

        Usuario usuarioExistente = new Usuario();
        usuarioExistente.setEmail("teste@email.com");

        when(usuarioRepository.findByEmail("teste@email.com"))
                .thenReturn(Optional.of(usuarioExistente));

        CadastroUsuarioRequest request = new CadastroUsuarioRequest();

        request.setNome("Usuario Teste");
        request.setEmail("teste@email.com");
        request.setSenha("123456");
        request.setPerfil("ANALISTA");

        assertThrows(
        EmailDuplicadoException.class,
        () -> usuarioService.cadastrar(request)
            );
        }

    @Test
void deveCriptografarSenhaAoCadastrarUsuario() {

    CadastroUsuarioRequest request = new CadastroUsuarioRequest();

    request.setNome("Usuario Teste");
    request.setEmail("novo@email.com");
    request.setSenha("123456");
    request.setPerfil("ANALISTA");

    when(usuarioRepository.findByEmail("novo@email.com"))
            .thenReturn(Optional.empty());

    Usuario usuarioSalvo = new Usuario();
    usuarioSalvo.setId(1L);
    usuarioSalvo.setNome("Usuario Teste");
    usuarioSalvo.setEmail("novo@email.com");
    usuarioSalvo.setPerfil("ANALISTA");
    usuarioSalvo.setStatus("ATIVO");

    when(usuarioRepository.save(org.mockito.ArgumentMatchers.any(Usuario.class)))
            .thenAnswer(invocacao -> {
                Usuario usuario = invocacao.getArgument(0);
                usuarioSalvo.setSenha(usuario.getSenha());
                return usuarioSalvo;
            });

    Usuario resultado = usuarioService.cadastrar(request);

    org.junit.jupiter.api.Assertions.assertNotEquals(
            "123456",
            resultado.getSenha()
    );

    org.junit.jupiter.api.Assertions.assertTrue(
            new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder()
                    .matches("123456", resultado.getSenha())
    );
}
@Test
void deveDefinirUsuarioComoAtivoEManterPerfilInformado() {

    CadastroUsuarioRequest request = new CadastroUsuarioRequest();

    request.setNome("Usuario Teste");
    request.setEmail("perfil@email.com");
    request.setSenha("123456");
    request.setPerfil("GESTOR");

    when(usuarioRepository.findByEmail("perfil@email.com"))
            .thenReturn(Optional.empty());

    when(usuarioRepository.save(
            org.mockito.ArgumentMatchers.any(Usuario.class)))
            .thenAnswer(invocacao -> invocacao.getArgument(0));

    Usuario resultado = usuarioService.cadastrar(request);

    org.junit.jupiter.api.Assertions.assertEquals(
            "ATIVO",
            resultado.getStatus()
    );

    org.junit.jupiter.api.Assertions.assertEquals(
            "GESTOR",
            resultado.getPerfil()
    );
}

}