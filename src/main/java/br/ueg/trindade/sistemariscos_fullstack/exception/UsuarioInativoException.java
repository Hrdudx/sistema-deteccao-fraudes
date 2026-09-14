package br.ueg.trindade.sistemariscos_fullstack.exception;

public class UsuarioInativoException extends RuntimeException {

    public UsuarioInativoException(String mensagem) {
        super(mensagem);
    }
}