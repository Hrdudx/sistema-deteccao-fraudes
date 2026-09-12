package br.ueg.trindade.sistemariscos_fullstack.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "fato_transacao")
public class Transacao {

    @Id
    @Column(name = "id_transacao", nullable = false)
    private String idTransacao;

    @NotNull
    @Column(name = "data_hora_transacao", nullable = false)
    private LocalDateTime dataHoraTransacao;

    @NotNull
    @Column(name = "tipo_transacao", nullable = false)
    private String tipoTransacao;

    @NotNull
    @Column(name = "valor", nullable = false)
    private BigDecimal valor;

    @NotNull
    @Column(name = "moeda", nullable = false)
    private String moeda;

    @NotNull
    @Column(name = "canal", nullable = false)
    private String canal;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "id_cliente_origem", nullable = false)
    private Cliente clienteOrigem;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "id_conta_origem", nullable = false)
    private Conta contaOrigem;

    @ManyToOne(fetch = FetchType.EAGER, optional = true)
    @JoinColumn(name = "id_cliente_destino", nullable = true)
    private Cliente clienteDestino;

    @ManyToOne(fetch = FetchType.EAGER, optional = true)
    @JoinColumn(name = "id_conta_destino", nullable = true)
    private Conta contaDestino;

    @NotNull
    @Column(name = "nome_contraparte", nullable = false)
    private String nomeContraparte;

    @NotNull
    @Column(name = "documento_contraparte_ficticio", nullable = false)
    private String documentoContraparteFicticio;

    @NotNull
    @Column(name = "banco_contraparte", nullable = false)
    private String bancoContraparte;

    @NotNull
    @Column(name = "uf_ip", nullable = false)
    private String ufIp;

    @NotNull
    @Column(name = "id_dispositivo", nullable = false)
    private String idDispositivo;

    @NotNull
    @Column(name = "reputacao_dispositivo", nullable = false)
    private String reputacaoDispositivo;

    @NotNull
    @Column(name = "horario_atipico", nullable = false)
    private Boolean horarioAtipico;

    @NotNull
    @Column(name = "novo_favorecido", nullable = false)
    private Boolean novoFavorecido;

    @NotNull
    @Column(name = "fora_perfil", nullable = false)
    private Boolean foraPerfil;

    @NotNull
    @Column(name = "score_transacao", nullable = false)
    private Integer scoreTransacao;

    @NotNull
    @Column(name = "status_transacao", nullable = false)
    private String statusTransacao;

    public Transacao() {}

    public String getIdTransacao() {
        return idTransacao;
    }

    public void setIdTransacao(String idTransacao) {
        this.idTransacao = idTransacao;
    }

    public LocalDateTime getDataHoraTransacao() {
        return dataHoraTransacao;
    }

    public void setDataHoraTransacao(LocalDateTime dataHoraTransacao) {
        this.dataHoraTransacao = dataHoraTransacao;
    }

    public String getTipoTransacao() {
        return tipoTransacao;
    }

    public void setTipoTransacao(String tipoTransacao) {
        this.tipoTransacao = tipoTransacao;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    public String getMoeda() {
        return moeda;
    }

    public void setMoeda(String moeda) {
        this.moeda = moeda;
    }

    public String getCanal() {
        return canal;
    }

    public void setCanal(String canal) {
        this.canal = canal;
    }

    public Cliente getClienteOrigem() {
        return clienteOrigem;
    }

    public void setClienteOrigem(Cliente clienteOrigem) {
        this.clienteOrigem = clienteOrigem;
    }

    public Conta getContaOrigem() {
        return contaOrigem;
    }

    public void setContaOrigem(Conta contaOrigem) {
        this.contaOrigem = contaOrigem;
    }

    public Cliente getClienteDestino() {
        return clienteDestino;
    }

    public void setClienteDestino(Cliente clienteDestino) {
        this.clienteDestino = clienteDestino;
    }

    public Conta getContaDestino() {
        return contaDestino;
    }

    public void setContaDestino(Conta contaDestino) {
        this.contaDestino = contaDestino;
    }

    public String getNomeContraparte() {
        return nomeContraparte;
    }

    public void setNomeContraparte(String nomeContraparte) {
        this.nomeContraparte = nomeContraparte;
    }

    public String getDocumentoContraparteFicticio() {
        return documentoContraparteFicticio;
    }

    public void setDocumentoContraparteFicticio(String documentoContraparteFicticio) {
        this.documentoContraparteFicticio = documentoContraparteFicticio;
    }

    public String getBancoContraparte() {
        return bancoContraparte;
    }

    public void setBancoContraparte(String bancoContraparte) {
        this.bancoContraparte = bancoContraparte;
    }

    public String getUfIp() {
        return ufIp;
    }

    public void setUfIp(String ufIp) {
        this.ufIp = ufIp;
    }

    public String getIdDispositivo() {
        return idDispositivo;
    }

    public void setIdDispositivo(String idDispositivo) {
        this.idDispositivo = idDispositivo;
    }

    public String getReputacaoDispositivo() {
        return reputacaoDispositivo;
    }

    public void setReputacaoDispositivo(String reputacaoDispositivo) {
        this.reputacaoDispositivo = reputacaoDispositivo;
    }

    public Boolean getHorarioAtipico() {
        return horarioAtipico;
    }

    public void setHorarioAtipico(Boolean horarioAtipico) {
        this.horarioAtipico = horarioAtipico;
    }

    public Boolean getNovoFavorecido() {
        return novoFavorecido;
    }

    public void setNovoFavorecido(Boolean novoFavorecido) {
        this.novoFavorecido = novoFavorecido;
    }

    public Boolean getForaPerfil() {
        return foraPerfil;
    }

    public void setForaPerfil(Boolean foraPerfil) {
        this.foraPerfil = foraPerfil;
    }

    public Integer getScoreTransacao() {
        return scoreTransacao;
    }

    public void setScoreTransacao(Integer scoreTransacao) {
        this.scoreTransacao = scoreTransacao;
    }

    public String getStatusTransacao() {
        return statusTransacao;
    }

    public void setStatusTransacao(String statusTransacao) {
        this.statusTransacao = statusTransacao;
    }

}