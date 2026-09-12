package br.ueg.trindade.sistemariscos_fullstack.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "fato_alerta_pld")
public class AlertaPld {

    @Id
    @Column(name = "id_alerta_pld", nullable = false)
    private String idAlertaPld;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "id_cliente_analisado", nullable = false)
    private Cliente clienteAnalisado;

    @ManyToOne(fetch = FetchType.EAGER, optional = true)
    @JoinColumn(name = "id_transacao_referencia", nullable = true)
    private Transacao transacaoReferencia;

    @NotNull
    @Column(name = "data_alerta", nullable = false)
    private LocalDateTime dataAlerta;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "id_regra", nullable = false)
    private RegraRisco regra;

    @NotNull
    @Column(name = "tipo_alerta", nullable = false)
    private String tipoAlerta;

    @Column(name = "contraparte_relacionada", nullable = true)
    private String contraparteRelacionada;

    @NotNull
    @Column(name = "valor_relacionado", nullable = false)
    private BigDecimal valorRelacionado;

    @NotNull
    @Column(name = "score_pld", nullable = false)
    private Integer scorePld;

    @NotNull
    @Column(name = "severidade", nullable = false)
    private String severidade;

    @NotNull
    @Column(name = "status_analise", nullable = false)
    private String statusAnalise;

    @NotNull
    @Column(name = "resultado", nullable = false)
    private String resultado;

    @NotNull
    @Column(name = "necessita_escalonamento", nullable = false)
    private Boolean necessitaEscalonamento;

    @NotNull
    @Column(name = "analista_responsavel", nullable = false)
    private String analistaResponsavel;

    @Column(name = "data_encerramento", nullable = true)
    private LocalDate dataEncerramento;

    @Column(name = "observacao", nullable = true)
    private String observacao;

    public AlertaPld() {}

    public String getIdAlertaPld() {
        return idAlertaPld;
    }

    public void setIdAlertaPld(String idAlertaPld) {
        this.idAlertaPld = idAlertaPld;
    }

    public Cliente getClienteAnalisado() {
        return clienteAnalisado;
    }

    public void setClienteAnalisado(Cliente clienteAnalisado) {
        this.clienteAnalisado = clienteAnalisado;
    }

    public Transacao getTransacaoReferencia() {
        return transacaoReferencia;
    }

    public void setTransacaoReferencia(Transacao transacaoReferencia) {
        this.transacaoReferencia = transacaoReferencia;
    }

    public LocalDateTime getDataAlerta() {
        return dataAlerta;
    }

    public void setDataAlerta(LocalDateTime dataAlerta) {
        this.dataAlerta = dataAlerta;
    }

    public RegraRisco getRegra() {
        return regra;
    }

    public void setRegra(RegraRisco regra) {
        this.regra = regra;
    }

    public String getTipoAlerta() {
        return tipoAlerta;
    }

    public void setTipoAlerta(String tipoAlerta) {
        this.tipoAlerta = tipoAlerta;
    }

    public String getContraparteRelacionada() {
        return contraparteRelacionada;
    }

    public void setContraparteRelacionada(String contraparteRelacionada) {
        this.contraparteRelacionada = contraparteRelacionada;
    }

    public BigDecimal getValorRelacionado() {
        return valorRelacionado;
    }

    public void setValorRelacionado(BigDecimal valorRelacionado) {
        this.valorRelacionado = valorRelacionado;
    }

    public Integer getScorePld() {
        return scorePld;
    }

    public void setScorePld(Integer scorePld) {
        this.scorePld = scorePld;
    }

    public String getSeveridade() {
        return severidade;
    }

    public void setSeveridade(String severidade) {
        this.severidade = severidade;
    }

    public String getStatusAnalise() {
        return statusAnalise;
    }

    public void setStatusAnalise(String statusAnalise) {
        this.statusAnalise = statusAnalise;
    }

    public String getResultado() {
        return resultado;
    }

    public void setResultado(String resultado) {
        this.resultado = resultado;
    }

    public Boolean getNecessitaEscalonamento() {
        return necessitaEscalonamento;
    }

    public void setNecessitaEscalonamento(Boolean necessitaEscalonamento) {
        this.necessitaEscalonamento = necessitaEscalonamento;
    }

    public String getAnalistaResponsavel() {
        return analistaResponsavel;
    }

    public void setAnalistaResponsavel(String analistaResponsavel) {
        this.analistaResponsavel = analistaResponsavel;
    }

    public LocalDate getDataEncerramento() {
        return dataEncerramento;
    }

    public void setDataEncerramento(LocalDate dataEncerramento) {
        this.dataEncerramento = dataEncerramento;
    }

    public String getObservacao() {
        return observacao;
    }

    public void setObservacao(String observacao) {
        this.observacao = observacao;
    }

}