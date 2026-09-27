import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import {
  PERFIS_USUARIO,
  UsuarioSistema,
  UsuariosService,
  endpointIndisponivel,
  mensagemDeErro,
} from '../../services/usuarios.service';
import { CabecalhoPaginaComponent } from '../../components/cabecalho-pagina/cabecalho-pagina.component';
import { EstadoListaComponent } from '../../components/estado-lista/estado-lista.component';
import { semAcento } from '../../utils/formatacao';

interface Formulario {
  id: number | null;
  nome: string;
  email: string;
  senha: string;
  perfil: string;
}

// TEL13 — Usuários e Acessos (DRE): listar/pesquisar, novo usuário, editar,
// perfil e situação ativo/inativo. A senha nunca é exibida e a inativação não
// remove o usuário (histórico de tratativas continua identificável — RF68).
@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, CabecalhoPaginaComponent, EstadoListaComponent],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css',
})
export class UsuariosComponent implements OnInit {
  readonly perfis = PERFIS_USUARIO;

  usuarios: UsuarioSistema[] = [];
  carregando = true;
  erro: string | null = null;
  demonstracao = false;

  busca = '';
  filtroPerfil = '';
  filtroStatus = '';

  formulario: Formulario | null = null;
  mostrarSenha = false;
  salvando = false;
  erroFormulario: string | null = null;
  mensagem: { texto: string; tipo: 'sucesso' | 'aviso' } | null = null;

  constructor(private service: UsuariosService) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando = true;
    this.erro = null;
    this.service.listar().subscribe({
      next: (r) => {
        this.usuarios = r.dados;
        this.demonstracao = r.demonstracao;
        this.carregando = false;
      },
      error: () => {
        this.erro = 'Não foi possível carregar os usuários.';
        this.carregando = false;
      },
    });
  }

  get filtrados(): UsuarioSistema[] {
    const termo = semAcento(this.busca.trim()).toLowerCase();
    return this.usuarios
      .filter((u) => !this.filtroPerfil || u.perfil === this.filtroPerfil)
      .filter((u) => !this.filtroStatus || u.status === this.filtroStatus)
      .filter((u) => !termo || semAcento(`${u.nome} ${u.email}`).toLowerCase().includes(termo))
      .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
  }

  get totalAtivos(): number {
    return this.usuarios.filter((u) => u.status === 'ATIVO').length;
  }

  rotuloPerfil(perfil: string): string {
    return this.perfis.find((p) => p.valor === perfil)?.rotulo ?? perfil;
  }

  novo(): void {
    this.formulario = { id: null, nome: '', email: '', senha: '', perfil: '' };
    this.abrirFormulario();
  }

  editar(u: UsuarioSistema): void {
    this.formulario = { id: u.id, nome: u.nome, email: u.email, senha: '', perfil: u.perfil };
    this.abrirFormulario();
  }

  cancelar(): void {
    this.formulario = null;
    this.erroFormulario = null;
  }

  salvar(form: NgForm): void {
    if (!this.formulario || this.salvando) return;
    this.erroFormulario = null;
    if (form.invalid) {
      form.control.markAllAsTouched();
      this.erroFormulario = 'Preencha os campos obrigatórios destacados.';
      return;
    }
    const f = this.formulario;
    const emailEmUso = this.usuarios.some((u) => u.email.toLowerCase() === f.email.trim().toLowerCase() && u.id !== f.id);
    if (emailEmUso) {
      this.erroFormulario = 'E-mail já cadastrado.';
      return;
    }

    this.salvando = true;
    const dados = { nome: f.nome.trim(), email: f.email.trim(), perfil: f.perfil };
    const requisicao =
      f.id === null ? this.service.cadastrar({ ...dados, senha: f.senha }) : this.service.atualizar(f.id, dados);

    requisicao.subscribe({
      next: (salvo) => {
        this.aplicarLocal({ ...salvo, status: salvo.status ?? 'ATIVO' });
        this.concluir(f.id === null ? 'Usuário cadastrado com sucesso.' : 'Usuário atualizado com sucesso.', 'sucesso');
      },
      error: (erro: HttpErrorResponse) => {
        this.salvando = false;
        if (this.semBackend(erro)) {
          // Sem endpoint no backend: aplica só nesta tela e avisa
          const existente = this.usuarios.find((u) => u.id === f.id);
          this.aplicarLocal({ id: f.id ?? this.proximoId(), ...dados, status: existente?.status ?? 'ATIVO' });
          this.concluir(
            (f.id === null ? 'Usuário incluído' : 'Alteração aplicada') +
              ' apenas nesta tela (demonstração) — o endpoint do backend ainda não está disponível.',
            'aviso',
          );
        } else {
          this.erroFormulario = mensagemDeErro(erro);
        }
      },
    });
  }

  alternarStatus(u: UsuarioSistema): void {
    const novoStatus = u.status === 'ATIVO' ? 'INATIVO' : 'ATIVO';
    const acao = novoStatus === 'INATIVO' ? 'inativar' : 'reativar';
    if (!confirm(`Deseja ${acao} o acesso de ${u.nome}?${novoStatus === 'INATIVO' ? ' O histórico do usuário será mantido.' : ''}`)) return;

    this.service.alterarStatus(u.id, novoStatus).subscribe({
      next: () => {
        u.status = novoStatus;
        this.mensagem = { texto: `Acesso de ${u.nome} ${novoStatus === 'ATIVO' ? 'reativado' : 'inativado'}.`, tipo: 'sucesso' };
      },
      error: (erro: HttpErrorResponse) => {
        if (this.semBackend(erro)) {
          u.status = novoStatus;
          this.mensagem = {
            texto: `Situação de ${u.nome} alterada apenas nesta tela (demonstração) — o endpoint do backend ainda não está disponível.`,
            tipo: 'aviso',
          };
        } else {
          this.mensagem = { texto: mensagemDeErro(erro), tipo: 'aviso' };
        }
      },
    });
  }

  // Endpoint inexistente, ou backend fora do ar (em modo demonstração o proxy
  // de desenvolvimento responde 500). Erros de validação/regra seguem para a tela.
  private semBackend(erro: HttpErrorResponse): boolean {
    return endpointIndisponivel(erro) || (this.demonstracao && ![400, 403, 409].includes(erro.status));
  }

  private abrirFormulario(): void {
    this.mostrarSenha = false;
    this.erroFormulario = null;
    this.mensagem = null;
    setTimeout(() => document.getElementById('nome-usuario')?.focus());
  }

  private aplicarLocal(u: UsuarioSistema): void {
    const indice = this.usuarios.findIndex((x) => x.id === u.id);
    if (indice >= 0) this.usuarios[indice] = u;
    else this.usuarios = [...this.usuarios, u];
  }

  private concluir(texto: string, tipo: 'sucesso' | 'aviso'): void {
    this.salvando = false;
    this.formulario = null;
    this.mensagem = { texto, tipo };
  }

  private proximoId(): number {
    return Math.max(0, ...this.usuarios.map((u) => u.id)) + 1;
  }
}
