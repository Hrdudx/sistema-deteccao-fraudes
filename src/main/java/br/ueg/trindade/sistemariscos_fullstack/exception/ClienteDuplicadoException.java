package br.ueg.trindade.sistemariscos_fullstack.exception;

public class ClienteDuplicadoException extends RuntimeException {

    public ClienteDuplicadoException(String mensagem) {
        super(mensagem);
    }
}