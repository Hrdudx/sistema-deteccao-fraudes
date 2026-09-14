package br.ueg.trindade.sistemariscos_fullstack.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class TratamentoExcecao {

    @ExceptionHandler(AutenticacaoException.class)
    public ResponseEntity<String> tratarAutenticacao(
            AutenticacaoException excecao) {

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(excecao.getMessage());
    }
    @ExceptionHandler(UsuarioInativoException.class)
    public ResponseEntity<String> tratarUsuarioInativo(
        UsuarioInativoException excecao) {

    return ResponseEntity
            .status(HttpStatus.FORBIDDEN)
            .body(excecao.getMessage());
}
@ExceptionHandler(EmailDuplicadoException.class)
public ResponseEntity<String> tratarEmailDuplicado(
        EmailDuplicadoException excecao) {
    return ResponseEntity
            .status(HttpStatus.CONFLICT)
            .body(excecao.getMessage());
}

}
