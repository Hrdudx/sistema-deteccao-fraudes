package br.ueg.trindade.sistemariscos_fullstack.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "dim_regra_risco")
public class RegraRisco {

    @Id
    @Column(name = "id_regra", nullable = false)
    private String idRegra;

    @NotNull
    @Column(name = "categoria", nullable = false)
    private String categoria;

    @NotNull
    @Column(name = "nome_regra", nullable = false)
    private String nomeRegra;

    @NotNull
    @Column(name = "descricao", nullable = false)
    private String descricao;

    @NotNull
    @Column(name = "nivel_severidade", nullable = false)
    private String nivelSeveridade;

    @NotNull
    @Column(name = "peso_score", nullable = false)
    private Integer pesoScore;

    @NotNull
    @Column(name = "status_regra", nullable = false)
    private String statusRegra;

    public RegraRisco() {}

    public String getIdRegra() {
        return idRegra;
    }

    public void setIdRegra(String idRegra) {
        this.idRegra = idRegra;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public String getNomeRegra() {
        return nomeRegra;
    }

    public void setNomeRegra(String nomeRegra) {
        this.nomeRegra = nomeRegra;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getNivelSeveridade() {
        return nivelSeveridade;
    }

    public void setNivelSeveridade(String nivelSeveridade) {
        this.nivelSeveridade = nivelSeveridade;
    }

    public Integer getPesoScore() {
        return pesoScore;
    }

    public void setPesoScore(Integer pesoScore) {
        this.pesoScore = pesoScore;
    }

    public String getStatusRegra() {
        return statusRegra;
    }

    public void setStatusRegra(String statusRegra) {
        this.statusRegra = statusRegra;
    }

}