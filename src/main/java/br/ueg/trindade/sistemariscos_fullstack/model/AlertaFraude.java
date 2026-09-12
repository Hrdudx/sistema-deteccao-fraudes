package br.ueg.trindade.sistemariscos_fullstack.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "fato_alerta_fraude")
public class AlertaFraude {

    @Id
    @Column(name = "id_alerta_fraude", nullable = false)
    private String idAlertaFraude;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "id_transacao", nullable = false)
    private Transacao transacao;

    @NotNull
    @Column(name = "data_alerta", nullable = false)
    private LocalDateTime dataAlerta;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "id_cliente_origem", nullable = false)
    private Cliente clienteOrigem;

    @ManyToOne(fetch = FetchType.EAGER, optional = true)
    @JoinColumn(name = "id_cliente_destino", nullable = true)
    private Cliente clienteDestino;

    @ManyToOne(fetch = FetchType.EAGER, optional = true)
    @JoinColumn(name = "id_cliente_vitima", nullable = true)
    private Cliente clienteVitima;

    @ManyToOne(fetch = FetchType.EAGER, optional = true)
    @JoinColumn(name = "id_cliente_suspeito", nullable = true)
    private Cliente clienteSuspeito;

    @Column(name = "nome_suspeito_externo", nullable = true)
    private String nomeSuspeitoExterno;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "id_regra", nullable = false)
    private RegraRisco regra;

    @NotNull
    @Column(name = "tipo_fraude", nullable = false)
    private String tipoFraude;

    @NotNull
    @Column(name = "score_fraude", nullable = false)
    private Integer scoreFraude;

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
    @Column(name = "valor_exposto", nullable = false)
    private BigDecimal valorExposto;

    @NotNull
    @Column(name = "valor_perda", nullable = false)
    private BigDecimal valorPerda;

    @NotNull
    @Column(name = "analista_responsavel", nullable = false)
    private String analistaResponsavel;

    @Column(name = "data_encerramento", nullable = true)
    private LocalDate dataEncerramento;

    @Column(name = "observacao", nullable = true)
    private String observacao;

    public AlertaFraude() {}

    public String getIdAlertaFraude() {
        return idAlertaFraude;
    }

    public void setIdAlertaFraude(String idAlertaFraude) {
        this.idAlertaFraude = idAlertaFraude;
    }

    public Transacao getTransacao() {
        return transacao;
    }

    public void setTransacao(Transacao transacao) {
        this.transacao = transacao;
    }

    public LocalDateTime getDataAlerta() {
        return dataAlerta;
    }

    public void setDataAlerta(LocalDateTime dataAlerta) {
        this.dataAlerta = dataAlerta;
    }

    public Cliente getClienteOrigem() {
        return clienteOrigem;
    }

    public void setClienteOrigem(Cliente clienteOrigem) {
        this.clienteOrigem = clienteOrigem;
    }

    public Cliente getClienteDestino() {
        return clienteDestino;
    }

    public void setClienteDestino(Cliente clienteDestino) {
        this.clienteDestino = clienteDestino;
    }

    public Cliente getClienteVitima() {
        return clienteVitima;
    }

    public void setClienteVitima(Cliente clienteVitima) {
        this.clienteVitima = clienteVitima;
    }

    public Cliente getClienteSuspeito() {
        return clienteSuspeito;
    }

    public void setClienteSuspeito(Cliente clienteSuspeito) {
        this.clienteSuspeito = clienteSuspeito;
    }

    public String getNomeSuspeitoExterno() {
        return nomeSuspeitoExterno;
    }

    public void setNomeSuspeitoExterno(String nomeSuspeitoExterno) {
        this.nomeSuspeitoExterno = nomeSuspeitoExterno;
    }

    public RegraRisco getRegra() {
        return regra;
    }

    public void setRegra(RegraRisco regra) {
        this.regra = regra;
    }

    public String getTipoFraude() {
        return tipoFraude;
    }

    public void setTipoFraude(String tipoFraude) {
        this.tipoFraude = tipoFraude;
    }

    public Integer getScoreFraude() {
        return scoreFraude;
    }

    public void setScoreFraude(Integer scoreFraude) {
        this.scoreFraude = scoreFraude;
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

    public BigDecimal getValorExposto() {
        return valorExposto;
    }

    public void setValorExposto(BigDecimal valorExposto) {
        this.valorExposto = valorExposto;
    }

    public BigDecimal getValorPerda() {
        return valorPerda;
    }

    public void setValorPerda(BigDecimal valorPerda) {
        this.valorPerda = valorPerda;
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