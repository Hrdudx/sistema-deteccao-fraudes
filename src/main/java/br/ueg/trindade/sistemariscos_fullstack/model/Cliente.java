package br.ueg.trindade.sistemariscos_fullstack.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "dim_cliente")
public class Cliente {

    @Id
    @Column(name = "id_cliente", nullable = false)
    private String idCliente;

    @NotNull
    @Column(name = "tipo_pessoa", nullable = false)
    private String tipoPessoa;

    @NotNull
    @Column(name = "nome_razao_social", nullable = false)
    private String nomeRazaoSocial;

    @NotNull
    @Column(name = "documento_ficticio", nullable = false)
    private String documentoFicticio;

    @NotNull
    @Column(name = "data_nascimento_abertura", nullable = false)
    private LocalDate dataNascimentoAbertura;

    @NotNull
    @Column(name = "cidade", nullable = false)
    private String cidade;

    @NotNull
    @Column(name = "uf", nullable = false)
    private String uf;

    @NotNull
    @Column(name = "data_cadastro", nullable = false)
    private LocalDate dataCadastro;

    @NotNull
    @Column(name = "status_cliente", nullable = false)
    private String statusCliente;

    @NotNull
    @Column(name = "segmento", nullable = false)
    private String segmento;

    @NotNull
    @Column(name = "renda_faturamento_mensal", nullable = false)
    private BigDecimal rendaFaturamentoMensal;

    @NotNull
    @Column(name = "profissao_atividade", nullable = false)
    private String profissaoAtividade;

    @NotNull
    @Column(name = "origem_cadastro", nullable = false)
    private String origemCadastro;

    public Cliente() {}

    public String getIdCliente() {
        return idCliente;
    }

    public void setIdCliente(String idCliente) {
        this.idCliente = idCliente;
    }

    public String getTipoPessoa() {
        return tipoPessoa;
    }

    public void setTipoPessoa(String tipoPessoa) {
        this.tipoPessoa = tipoPessoa;
    }

    public String getNomeRazaoSocial() {
        return nomeRazaoSocial;
    }

    public void setNomeRazaoSocial(String nomeRazaoSocial) {
        this.nomeRazaoSocial = nomeRazaoSocial;
    }

    public String getDocumentoFicticio() {
        return documentoFicticio;
    }

    public void setDocumentoFicticio(String documentoFicticio) {
        this.documentoFicticio = documentoFicticio;
    }

    public LocalDate getDataNascimentoAbertura() {
        return dataNascimentoAbertura;
    }

    public void setDataNascimentoAbertura(LocalDate dataNascimentoAbertura) {
        this.dataNascimentoAbertura = dataNascimentoAbertura;
    }

    public String getCidade() {
        return cidade;
    }

    public void setCidade(String cidade) {
        this.cidade = cidade;
    }

    public String getUf() {
        return uf;
    }

    public void setUf(String uf) {
        this.uf = uf;
    }

    public LocalDate getDataCadastro() {
        return dataCadastro;
    }

    public void setDataCadastro(LocalDate dataCadastro) {
        this.dataCadastro = dataCadastro;
    }

    public String getStatusCliente() {
        return statusCliente;
    }

    public void setStatusCliente(String statusCliente) {
        this.statusCliente = statusCliente;
    }

    public String getSegmento() {
        return segmento;
    }

    public void setSegmento(String segmento) {
        this.segmento = segmento;
    }

    public BigDecimal getRendaFaturamentoMensal() {
        return rendaFaturamentoMensal;
    }

    public void setRendaFaturamentoMensal(BigDecimal rendaFaturamentoMensal) {
        this.rendaFaturamentoMensal = rendaFaturamentoMensal;
    }

    public String getProfissaoAtividade() {
        return profissaoAtividade;
    }

    public void setProfissaoAtividade(String profissaoAtividade) {
        this.profissaoAtividade = profissaoAtividade;
    }

    public String getOrigemCadastro() {
        return origemCadastro;
    }

    public void setOrigemCadastro(String origemCadastro) {
        this.origemCadastro = origemCadastro;
    }

}