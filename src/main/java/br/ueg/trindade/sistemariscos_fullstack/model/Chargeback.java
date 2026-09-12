package br.ueg.trindade.sistemariscos_fullstack.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "fato_chargeback")
public class Chargeback {

    @Id
    @Column(name = "id_chargeback", nullable = false)
    private String idChargeback;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "id_cliente", nullable = false)
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "id_transacao", nullable = false)
    private Transacao transacao;

    @NotNull
    @Column(name = "modalidade", nullable = false)
    private String modalidade;

    @NotNull
    @Column(name = "data_transacao", nullable = false)
    private LocalDateTime dataTransacao;

    @NotNull
    @Column(name = "data_contestacao", nullable = false)
    private LocalDate dataContestacao;

    @NotNull
    @Column(name = "valor_transacao", nullable = false)
    private BigDecimal valorTransacao;

    @NotNull
    @Column(name = "valor_contestado", nullable = false)
    private BigDecimal valorContestado;

    @NotNull
    @Column(name = "motivo_chargeback", nullable = false)
    private String motivoChargeback;

    @NotNull
    @Column(name = "canal_origem", nullable = false)
    private String canalOrigem;

    @NotNull
    @Column(name = "contraparte", nullable = false)
    private String contraparte;

    @NotNull
    @Column(name = "status_chargeback", nullable = false)
    private String statusChargeback;

    @NotNull
    @Column(name = "fraude_declarada", nullable = false)
    private Boolean fraudeDeclarada;

    @NotNull
    @Column(name = "resultado_investigacao", nullable = false)
    private String resultadoInvestigacao;

    @NotNull
    @Column(name = "valor_recuperado", nullable = false)
    private BigDecimal valorRecuperado;

    @NotNull
    @Column(name = "perda_financeira", nullable = false)
    private BigDecimal perdaFinanceira;

    @Column(name = "data_resolucao", nullable = true)
    private LocalDate dataResolucao;

    public Chargeback() {}

    public String getIdChargeback() {
        return idChargeback;
    }

    public void setIdChargeback(String idChargeback) {
        this.idChargeback = idChargeback;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public Transacao getTransacao() {
        return transacao;
    }

    public void setTransacao(Transacao transacao) {
        this.transacao = transacao;
    }

    public String getModalidade() {
        return modalidade;
    }

    public void setModalidade(String modalidade) {
        this.modalidade = modalidade;
    }

    public LocalDateTime getDataTransacao() {
        return dataTransacao;
    }

    public void setDataTransacao(LocalDateTime dataTransacao) {
        this.dataTransacao = dataTransacao;
    }

    public LocalDate getDataContestacao() {
        return dataContestacao;
    }

    public void setDataContestacao(LocalDate dataContestacao) {
        this.dataContestacao = dataContestacao;
    }

    public BigDecimal getValorTransacao() {
        return valorTransacao;
    }

    public void setValorTransacao(BigDecimal valorTransacao) {
        this.valorTransacao = valorTransacao;
    }

    public BigDecimal getValorContestado() {
        return valorContestado;
    }

    public void setValorContestado(BigDecimal valorContestado) {
        this.valorContestado = valorContestado;
    }

    public String getMotivoChargeback() {
        return motivoChargeback;
    }

    public void setMotivoChargeback(String motivoChargeback) {
        this.motivoChargeback = motivoChargeback;
    }

    public String getCanalOrigem() {
        return canalOrigem;
    }

    public void setCanalOrigem(String canalOrigem) {
        this.canalOrigem = canalOrigem;
    }

    public String getContraparte() {
        return contraparte;
    }

    public void setContraparte(String contraparte) {
        this.contraparte = contraparte;
    }

    public String getStatusChargeback() {
        return statusChargeback;
    }

    public void setStatusChargeback(String statusChargeback) {
        this.statusChargeback = statusChargeback;
    }

    public Boolean getFraudeDeclarada() {
        return fraudeDeclarada;
    }

    public void setFraudeDeclarada(Boolean fraudeDeclarada) {
        this.fraudeDeclarada = fraudeDeclarada;
    }

    public String getResultadoInvestigacao() {
        return resultadoInvestigacao;
    }

    public void setResultadoInvestigacao(String resultadoInvestigacao) {
        this.resultadoInvestigacao = resultadoInvestigacao;
    }

    public BigDecimal getValorRecuperado() {
        return valorRecuperado;
    }

    public void setValorRecuperado(BigDecimal valorRecuperado) {
        this.valorRecuperado = valorRecuperado;
    }

    public BigDecimal getPerdaFinanceira() {
        return perdaFinanceira;
    }

    public void setPerdaFinanceira(BigDecimal perdaFinanceira) {
        this.perdaFinanceira = perdaFinanceira;
    }

    public LocalDate getDataResolucao() {
        return dataResolucao;
    }

    public void setDataResolucao(LocalDate dataResolucao) {
        this.dataResolucao = dataResolucao;
    }

}