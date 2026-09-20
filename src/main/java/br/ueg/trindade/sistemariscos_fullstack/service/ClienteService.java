package br.ueg.trindade.sistemariscos_fullstack.service;

import br.ueg.trindade.sistemariscos_fullstack.dto.ClienteHistoricoDTO;
import br.ueg.trindade.sistemariscos_fullstack.exception.RecursoNaoEncontradoException;
import br.ueg.trindade.sistemariscos_fullstack.model.*;
import br.ueg.trindade.sistemariscos_fullstack.repository.*;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;
    private final ContaRepository contaRepository;
    private final TransacaoRepository transacaoRepository;
    private final KycRepository kycRepository;
    private final AlertaFraudeRepository alertaFraudeRepository;
    private final AlertaPldRepository alertaPldRepository;
    private final ChargebackRepository chargebackRepository;
    private final RiscoClienteRepository riscoClienteRepository;

    public ClienteService(
            ClienteRepository clienteRepository,
            ContaRepository contaRepository,
            TransacaoRepository transacaoRepository,
            KycRepository kycRepository,
            AlertaFraudeRepository alertaFraudeRepository,
            AlertaPldRepository alertaPldRepository,
            ChargebackRepository chargebackRepository,
            RiscoClienteRepository riscoClienteRepository) {

        this.clienteRepository = clienteRepository;
        this.contaRepository = contaRepository;
        this.transacaoRepository = transacaoRepository;
        this.kycRepository = kycRepository;
        this.alertaFraudeRepository = alertaFraudeRepository;
        this.alertaPldRepository = alertaPldRepository;
        this.chargebackRepository = chargebackRepository;
        this.riscoClienteRepository = riscoClienteRepository;
    }

    public List<Cliente> listarTodos() {
        return clienteRepository.findAll();
    }

    public Cliente buscarPorId(String id) {
        return clienteRepository.findById(id)
                .orElseThrow(() ->
                        new RecursoNaoEncontradoException(
                                "Cliente não encontrado: " + id
                        )
                );
    }

    public Cliente salvar(Cliente objeto) {
        return clienteRepository.save(objeto);
    }

    public Cliente atualizar(String id, Cliente objeto) {
        buscarPorId(id);
        objeto.setIdCliente(id);
        return clienteRepository.save(objeto);
    }

    public void excluir(String id) {
        Cliente existente = buscarPorId(id);
        clienteRepository.delete(existente);
    }

    public ClienteHistoricoDTO buscarHistorico(String idCliente) {

        Cliente cliente = buscarPorId(idCliente);

        List<Conta> contas =
                contaRepository.findByCliente_IdCliente(idCliente);

        List<Transacao> transacoes =
                transacaoRepository
                        .findByClienteOrigem_IdClienteOrClienteDestino_IdCliente(
                                idCliente,
                                idCliente
                        );

        List<Kyc> kycs =
                kycRepository.findByCliente_IdCliente(idCliente);

        List<AlertaFraude> alertasFraude =
                alertaFraudeRepository
                        .findByClienteOrigem_IdClienteOrClienteDestino_IdClienteOrClienteVitima_IdClienteOrClienteSuspeito_IdCliente(
                                idCliente,
                                idCliente,
                                idCliente,
                                idCliente
                        );

        List<AlertaPld> alertasPld =
                alertaPldRepository
                        .findByClienteAnalisado_IdCliente(idCliente);

        List<Chargeback> chargebacks =
                chargebackRepository
                        .findByCliente_IdCliente(idCliente);

        RiscoCliente riscoCliente =
                riscoClienteRepository.findById(idCliente)
                        .orElse(null);

        return new ClienteHistoricoDTO(
                cliente,
                contas,
                transacoes,
                kycs,
                alertasFraude,
                alertasPld,
                chargebacks,
                riscoCliente
        );
    }
}