package br.ueg.trindade.sistemariscos_fullstack.controller;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import br.ueg.trindade.sistemariscos_fullstack.exception.AutenticacaoException;
import br.ueg.trindade.sistemariscos_fullstack.model.Usuario;
import br.ueg.trindade.sistemariscos_fullstack.service.ControleAutenticacao;
import br.ueg.trindade.sistemariscos_fullstack.exception.TratamentoExcecao;
import br.ueg.trindade.sistemariscos_fullstack.exception.UsuarioInativoException;


class AuthControllerTest {

    private MockMvc mockMvc;
    private ControleAutenticacao controleAutenticacao;

    @BeforeEach
    void configurar() {

        controleAutenticacao =
                org.mockito.Mockito.mock(ControleAutenticacao.class);

        AuthController authController =
                new AuthController(controleAutenticacao);

        mockMvc = MockMvcBuilders
        .standaloneSetup(authController)
        .setControllerAdvice(new TratamentoExcecao())
        .build();
    }

    @Test
    void deveRealizarLoginComCredenciaisValidas() throws Exception {

        Usuario usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNome("Usuario Teste");
        usuario.setEmail("teste@email.com");
        usuario.setSenha("senha-criptografada");
        usuario.setStatus("ATIVO");
        usuario.setPerfil("ANALISTA");

        when(controleAutenticacao.autenticar(
                "teste@email.com",
                "123456"
        )).thenReturn(usuario);

        String json = """
                {
                    "email": "teste@email.com",
                    "senha": "123456"
                }
                """;

        mockMvc.perform(
                post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json)
        )
        .andExpect(status().isOk())
        .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
        .andExpect(jsonPath("$.id").value(1))
        .andExpect(jsonPath("$.nome").value("Usuario Teste"))
        .andExpect(jsonPath("$.email").value("teste@email.com"))
        .andExpect(jsonPath("$.perfil").value("ANALISTA"))
        .andExpect(jsonPath("$.senha").doesNotExist());
    }

    @Test
    void deveRecusarLoginComSenhaIncorreta() throws Exception {
    when(controleAutenticacao.autenticar(
            "teste@email.com", "senha-errada"))
            .thenThrow(new AutenticacaoException("Credenciais inválidas"));

    String json = """
            {
                "email": "teste@email.com",
                "senha": "senha-errada"
            }
            """;

    mockMvc.perform(
            post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json)
    )
    .andExpect(status().isUnauthorized());
}

@Test
void deveRecusarLoginComUsuarioInexistente() throws Exception {
    when(controleAutenticacao.autenticar(
            "inexistente@email.com", "123456"))
            .thenThrow(new AutenticacaoException("Credenciais inválidas"));

    String json = """
            {
                "email": "inexistente@email.com",
                "senha": "123456"
            }
            """;

    mockMvc.perform(
            post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json)
    )
    .andExpect(status().isUnauthorized());
}

@Test
void deveRecusarLoginComUsuarioInativo() throws Exception {
    when(controleAutenticacao.autenticar(
            "inativo@email.com", "123456"))
            .thenThrow(new UsuarioInativoException("Usuário inativo"));

    String json = """
            {
                "email": "inativo@email.com",
                "senha": "123456"
            }
            """;

    mockMvc.perform(
            post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json)
    )
    .andExpect(status().isForbidden());
}
@Test
void deveRecusarLoginSemSenha() throws Exception {
    String json = """
            {
                "email": "teste@email.com"
            }
            """;

    mockMvc.perform(
            post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json)
    )
    .andExpect(status().isBadRequest());
}
@Test
void deveRecusarLoginSemEmail() throws Exception {
    String json = """
            {
                "senha": "123456"
            }
            """;

    mockMvc.perform(
            post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json)
    )
    .andExpect(status().isBadRequest());
}

}