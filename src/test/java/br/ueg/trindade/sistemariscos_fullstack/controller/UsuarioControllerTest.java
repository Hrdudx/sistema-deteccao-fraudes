package br.ueg.trindade.sistemariscos_fullstack.controller;

import static org.mockito.ArgumentMatchers.any;
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

import br.ueg.trindade.sistemariscos_fullstack.exception.TratamentoExcecao;
import br.ueg.trindade.sistemariscos_fullstack.model.Usuario;
import br.ueg.trindade.sistemariscos_fullstack.service.UsuarioService;


class UsuarioControllerTest {

    private MockMvc mockMvc;
    private UsuarioService usuarioService;

    @BeforeEach
    void configurar() {

        usuarioService = org.mockito.Mockito.mock(UsuarioService.class);

        UsuarioController usuarioController =
                new UsuarioController(usuarioService);

        mockMvc = MockMvcBuilders
                .standaloneSetup(usuarioController)
                .setControllerAdvice(new TratamentoExcecao())
                .build();
    }

    @Test
    void deveCadastrarUsuarioComDadosValidos() throws Exception {

        Usuario usuario = new Usuario();

        usuario.setId(1L);
        usuario.setNome("Usuario Teste");
        usuario.setEmail("teste@email.com");
        usuario.setSenha("senha-criptografada");
        usuario.setStatus("ATIVO");
        usuario.setPerfil("ANALISTA");

        when(usuarioService.cadastrar(any()))
                .thenReturn(usuario);

        String json = """
                {
                    "nome": "Usuario Teste",
                    "email": "teste@email.com",
                    "senha": "123456",
                    "perfil": "ANALISTA"
                }
                """;

        mockMvc.perform(
                post("/api/usuarios")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json)
        )
        .andExpect(status().isCreated())
        .andExpect(content()
                .contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
        .andExpect(jsonPath("$.id").value(1))
        .andExpect(jsonPath("$.nome").value("Usuario Teste"))
        .andExpect(jsonPath("$.email").value("teste@email.com"))
        .andExpect(jsonPath("$.perfil").value("ANALISTA"))
        .andExpect(jsonPath("$.senha").doesNotExist());
    }

    @Test
void deveRecusarCadastroSemSenha() throws Exception {

    String json = """
            {
                "nome": "Usuario Teste",
                "email": "teste@email.com",
                "perfil": "ANALISTA"
            }
            """;

    mockMvc.perform(
            post("/api/usuarios")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json)
    )
    .andExpect(status().isBadRequest());
}
@Test
void deveRecusarCadastroSemEmail() throws Exception {

    String json = """
            {
                "nome": "Usuario Teste",
                "senha": "123456",
                "perfil": "ANALISTA"
            }
            """;

    mockMvc.perform(
            post("/api/usuarios")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json)
    )
    .andExpect(status().isBadRequest());
}
@Test
void deveRecusarCadastroComEmailInvalido() throws Exception {

    String json = """
            {
                "nome": "Usuario Teste",
                "email": "email-invalido",
                "senha": "123456",
                "perfil": "ANALISTA"
            }
            """;

    mockMvc.perform(
            post("/api/usuarios")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json)
    )
    .andExpect(status().isBadRequest());
}

}