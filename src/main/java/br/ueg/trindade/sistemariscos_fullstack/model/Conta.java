package br.ueg.trindade.sistemariscos_fullstack.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "dim_conta")
public class Conta {

    @Id
    @Column(name = "id_conta", nullable = false)
    private String idConta;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "id_cliente", nullable = false)
    private Cliente cliente;

    @NotNull
    @Column(name = "tipo_conta", nullable = false)
    private String tipoConta;

    @NotNull
    @Column(name = "data_abertura", nullable = false)
    private LocalDate dataAbertura;

    @NotNull
    @Column(name = "status_conta", nullable = false)
    private String statusConta;

    @NotNull
    @Column(name = "limite_transacional_diario", nullable = false)
    private BigDecimal limiteTransacionalDiario;

    @NotNull
    @Column(name = "saldo_medio_30d", nullable = false)
    private BigDecimal saldoMedio30d;

    public Conta() {}

    public String getIdConta() {
        return idConta;
    }

    public void setIdConta(String idConta) {
        this.idConta = idConta;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public String getTipoConta() {
        return tipoConta;
    }

    public void setTipoConta(String tipoConta) {
        this.tipoConta = tipoConta;
    }

    public LocalDate getDataAbertura() {
        return dataAbertura;
    }

    public void setDataAbertura(LocalDate dataAbertura) {
        this.dataAbertura = dataAbertura;
    }

    public String getStatusConta() {
        return statusConta;
    }

    public void setStatusConta(String statusConta) {
        this.statusConta = statusConta;
    }

    public BigDecimal getLimiteTransacionalDiario() {
        return limiteTransacionalDiario;
    }

    public void setLimiteTransacionalDiario(BigDecimal limiteTransacionalDiario) {
        this.limiteTransacionalDiario = limiteTransacionalDiario;
    }

    public BigDecimal getSaldoMedio30d() {
        return saldoMedio30d;
    }

    public void setSaldoMedio30d(BigDecimal saldoMedio30d) {
        this.saldoMedio30d = saldoMedio30d;
    }

}