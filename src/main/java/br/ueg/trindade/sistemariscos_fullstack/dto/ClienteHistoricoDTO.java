package br.ueg.trindade.sistemariscos_fullstack.dto;

import br.ueg.trindade.sistemariscos_fullstack.model.AlertaFraude;
import br.ueg.trindade.sistemariscos_fullstack.model.AlertaPld;
import br.ueg.trindade.sistemariscos_fullstack.model.Chargeback;
import br.ueg.trindade.sistemariscos_fullstack.model.Cliente;
import br.ueg.trindade.sistemariscos_fullstack.model.Conta;
import br.ueg.trindade.sistemariscos_fullstack.model.Kyc;
import br.ueg.trindade.sistemariscos_fullstack.model.RiscoCliente;
import br.ueg.trindade.sistemariscos_fullstack.model.Transacao;

import java.util.List;

public class ClienteHistoricoDTO {

    private Cliente cliente;
    private List<Conta> contas;
    private List<Transacao> transacoes;
    private List<Kyc> kycs;
    private List<AlertaFraude> alertasFraude;
    private List<AlertaPld> alertasPld;
    private List<Chargeback> chargebacks;
    private RiscoCliente riscoCliente;

    public ClienteHistoricoDTO() {
    }

    public ClienteHistoricoDTO(
            Cliente cliente,
            List<Conta> contas,
            List<Transacao> transacoes,
            List<Kyc> kycs,
            List<AlertaFraude> alertasFraude,
            List<AlertaPld> alertasPld,
            List<Chargeback> chargebacks,
            RiscoCliente riscoCliente) {

        this.cliente = cliente;
        this.contas = contas;
        this.transacoes = transacoes;
        this.kycs = kycs;
        this.alertasFraude = alertasFraude;
        this.alertasPld = alertasPld;
        this.chargebacks = chargebacks;
        this.riscoCliente = riscoCliente;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public List<Conta> getContas() {
        return contas;
    }

    public void setContas(List<Conta> contas) {
        this.contas = contas;
    }

    public List<Transacao> getTransacoes() {
        return transacoes;
    }

    public void setTransacoes(List<Transacao> transacoes) {
        this.transacoes = transacoes;
    }

    public List<Kyc> getKycs() {
        return kycs;
    }

    public void setKycs(List<Kyc> kycs) {
        this.kycs = kycs;
    }

    public List<AlertaFraude> getAlertasFraude() {
        return alertasFraude;
    }

    public void setAlertasFraude(List<AlertaFraude> alertasFraude) {
        this.alertasFraude = alertasFraude;
    }

    public List<AlertaPld> getAlertasPld() {
        return alertasPld;
    }

    public void setAlertasPld(List<AlertaPld> alertasPld) {
        this.alertasPld = alertasPld;
    }

    public List<Chargeback> getChargebacks() {
        return chargebacks;
    }

    public void setChargebacks(List<Chargeback> chargebacks) {
        this.chargebacks = chargebacks;
    }

    public RiscoCliente getRiscoCliente() {
        return riscoCliente;
    }

    public void setRiscoCliente(RiscoCliente riscoCliente) {
        this.riscoCliente = riscoCliente;
    }
}