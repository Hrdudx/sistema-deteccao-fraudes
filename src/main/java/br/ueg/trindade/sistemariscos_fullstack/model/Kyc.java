package br.ueg.trindade.sistemariscos_fullstack.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

@Entity
@Table(name = "fato_kyc")
public class Kyc {

    @Id
    @Column(name = "id_kyc", nullable = false)
    private String idKyc;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "id_cliente", nullable = false)
    private Cliente cliente;

    @NotNull
    @Column(name = "data_analise", nullable = false)
    private LocalDate dataAnalise;

    @NotNull
    @Column(name = "documento_validado", nullable = false)
    private Boolean documentoValidado;

    @NotNull
    @Column(name = "biometria_validada", nullable = false)
    private Boolean biometriaValidada;

    @NotNull
    @Column(name = "endereco_validado", nullable = false)
    private Boolean enderecoValidado;

    @NotNull
    @Column(name = "telefone_validado", nullable = false)
    private Boolean telefoneValidado;

    @NotNull
    @Column(name = "email_validado", nullable = false)
    private Boolean emailValidado;

    @NotNull
    @Column(name = "pep", nullable = false)
    private Boolean pep;

    @NotNull
    @Column(name = "lista_restritiva", nullable = false)
    private Boolean listaRestritiva;

    @NotNull
    @Column(name = "midia_adversa", nullable = false)
    private Boolean midiaAdversa;

    @NotNull
    @Column(name = "beneficiario_final_identificado", nullable = false)
    private Boolean beneficiarioFinalIdentificado;

    @NotNull
    @Column(name = "score_kyc", nullable = false)
    private Integer scoreKyc;

    @NotNull
    @Column(name = "nivel_risco_kyc", nullable = false)
    private String nivelRiscoKyc;

    @NotNull
    @Column(name = "status_kyc", nullable = false)
    private String statusKyc;

    @Column(name = "motivo_decisao", nullable = true)
    private String motivoDecisao;

    public Kyc() {}

    public String getIdKyc() {
        return idKyc;
    }

    public void setIdKyc(String idKyc) {
        this.idKyc = idKyc;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public LocalDate getDataAnalise() {
        return dataAnalise;
    }

    public void setDataAnalise(LocalDate dataAnalise) {
        this.dataAnalise = dataAnalise;
    }

    public Boolean getDocumentoValidado() {
        return documentoValidado;
    }

    public void setDocumentoValidado(Boolean documentoValidado) {
        this.documentoValidado = documentoValidado;
    }

    public Boolean getBiometriaValidada() {
        return biometriaValidada;
    }

    public void setBiometriaValidada(Boolean biometriaValidada) {
        this.biometriaValidada = biometriaValidada;
    }

    public Boolean getEnderecoValidado() {
        return enderecoValidado;
    }

    public void setEnderecoValidado(Boolean enderecoValidado) {
        this.enderecoValidado = enderecoValidado;
    }

    public Boolean getTelefoneValidado() {
        return telefoneValidado;
    }

    public void setTelefoneValidado(Boolean telefoneValidado) {
        this.telefoneValidado = telefoneValidado;
    }

    public Boolean getEmailValidado() {
        return emailValidado;
    }

    public void setEmailValidado(Boolean emailValidado) {
        this.emailValidado = emailValidado;
    }

    public Boolean getPep() {
        return pep;
    }

    public void setPep(Boolean pep) {
        this.pep = pep;
    }

    public Boolean getListaRestritiva() {
        return listaRestritiva;
    }

    public void setListaRestritiva(Boolean listaRestritiva) {
        this.listaRestritiva = listaRestritiva;
    }

    public Boolean getMidiaAdversa() {
        return midiaAdversa;
    }

    public void setMidiaAdversa(Boolean midiaAdversa) {
        this.midiaAdversa = midiaAdversa;
    }

    public Boolean getBeneficiarioFinalIdentificado() {
        return beneficiarioFinalIdentificado;
    }

    public void setBeneficiarioFinalIdentificado(Boolean beneficiarioFinalIdentificado) {
        this.beneficiarioFinalIdentificado = beneficiarioFinalIdentificado;
    }

    public Integer getScoreKyc() {
        return scoreKyc;
    }

    public void setScoreKyc(Integer scoreKyc) {
        this.scoreKyc = scoreKyc;
    }

    public String getNivelRiscoKyc() {
        return nivelRiscoKyc;
    }

    public void setNivelRiscoKyc(String nivelRiscoKyc) {
        this.nivelRiscoKyc = nivelRiscoKyc;
    }

    public String getStatusKyc() {
        return statusKyc;
    }

    public void setStatusKyc(String statusKyc) {
        this.statusKyc = statusKyc;
    }

    public String getMotivoDecisao() {
        return motivoDecisao;
    }

    public void setMotivoDecisao(String motivoDecisao) {
        this.motivoDecisao = motivoDecisao;
    }

}