package br.ueg.trindade.sistemariscos_fullstack.exception;

public class EmailDuplicadoException extends RuntimeException {

    public EmailDuplicadoException(String mensagem) {
        super(mensagem);
    }
}