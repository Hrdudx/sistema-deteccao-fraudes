package br.ueg.trindade.sistemariscos_fullstack.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "fato_risco_cliente")
public class RiscoCliente {

    @Id
    @Column(name = "id_cliente", nullable = false)
    private String idCliente;

    @NotNull
    @Column(name = "score_kyc", nullable = false)
    private Integer scoreKyc;

    @NotNull
    @Column(name = "score_fraude", nullable = false)
    private Integer scoreFraude;

    @NotNull
    @Column(name = "score_pld", nullable = false)
    private Integer scorePld;

    @NotNull
    @Column(name = "score_chargeback", nullable = false)
    private Integer scoreChargeback;

    @NotNull
    @Column(name = "score_risco_geral", nullable = false)
    private Integer scoreRiscoGeral;

    @NotNull
    @Column(name = "nivel_risco", nullable = false)
    private String nivelRisco;

    @NotNull
    @Column(name = "qtd_alertas_fraude", nullable = false)
    private Integer qtdAlertasFraude;

    @NotNull
    @Column(name = "qtd_alertas_pld", nullable = false)
    private Integer qtdAlertasPld;

    @NotNull
    @Column(name = "qtd_chargebacks", nullable = false)
    private Integer qtdChargebacks;

    @NotNull
    @Column(name = "qtd_fraudes_confirmadas", nullable = false)
    private Integer qtdFraudesConfirmadas;

    @NotNull
    @Column(name = "valor_perdas", nullable = false)
    private BigDecimal valorPerdas;

    @NotNull
    @Column(name = "data_ultima_avaliacao", nullable = false)
    private LocalDate dataUltimaAvaliacao;

    public RiscoCliente() {}

    public String getIdCliente() {
        return idCliente;
    }

    public void setIdCliente(String idCliente) {
        this.idCliente = idCliente;
    }

    public Integer getScoreKyc() {
        return scoreKyc;
    }

    public void setScoreKyc(Integer scoreKyc) {
        this.scoreKyc = scoreKyc;
    }

    public Integer getScoreFraude() {
        return scoreFraude;
    }

    public void setScoreFraude(Integer scoreFraude) {
        this.scoreFraude = scoreFraude;
    }

    public Integer getScorePld() {
        return scorePld;
    }

    public void setScorePld(Integer scorePld) {
        this.scorePld = scorePld;
    }

    public Integer getScoreChargeback() {
        return scoreChargeback;
    }

    public void setScoreChargeback(Integer scoreChargeback) {
        this.scoreChargeback = scoreChargeback;
    }

    public Integer getScoreRiscoGeral() {
        return scoreRiscoGeral;
    }

    public void setScoreRiscoGeral(Integer scoreRiscoGeral) {
        this.scoreRiscoGeral = scoreRiscoGeral;
    }

    public String getNivelRisco() {
        return nivelRisco;
    }

    public void setNivelRisco(String nivelRisco) {
        this.nivelRisco = nivelRisco;
    }

    public Integer getQtdAlertasFraude() {
        return qtdAlertasFraude;
    }

    public void setQtdAlertasFraude(Integer qtdAlertasFraude) {
        this.qtdAlertasFraude = qtdAlertasFraude;
    }

    public Integer getQtdAlertasPld() {
        return qtdAlertasPld;
    }

    public void setQtdAlertasPld(Integer qtdAlertasPld) {
        this.qtdAlertasPld = qtdAlertasPld;
    }

    public Integer getQtdChargebacks() {
        return qtdChargebacks;
    }

    public void setQtdChargebacks(Integer qtdChargebacks) {
        this.qtdChargebacks = qtdChargebacks;
    }

    public Integer getQtdFraudesConfirmadas() {
        return qtdFraudesConfirmadas;
    }

    public void setQtdFraudesConfirmadas(Integer qtdFraudesConfirmadas) {
        this.qtdFraudesConfirmadas = qtdFraudesConfirmadas;
    }

    public BigDecimal getValorPerdas() {
        return valorPerdas;
    }

    public void setValorPerdas(BigDecimal valorPerdas) {
        this.valorPerdas = valorPerdas;
    }

    public LocalDate getDataUltimaAvaliacao() {
        return dataUltimaAvaliacao;
    }

    public void setDataUltimaAvaliacao(LocalDate dataUltimaAvaliacao) {
        this.dataUltimaAvaliacao = dataUltimaAvaliacao;
    }

}