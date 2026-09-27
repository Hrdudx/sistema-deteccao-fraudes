import { Component, Input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ContagemSla } from '../../models/indicadores-home.model';

const RAIO = 80;
const MEIA_VOLTA = Math.PI * RAIO;
const VAO = 3;

// Medidor semicircular do SLA geral (RF10/RF11): percentual dentro do prazo no
// centro e três faixas proporcionais — dentro do prazo, atenção e vencidos —
// repetidas em cartões com número e percentual logo abaixo.
@Component({
  selector: 'app-medidor-sla',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './medidor-sla.component.html',
  styleUrl: './medidor-sla.component.css',
})
export class MedidorSlaComponent {
  @Input({ required: true }) sla!: ContagemSla;

  readonly faixas = [
    { chave: 'dentroPrazo', rotulo: 'Dentro do prazo', cor: 'var(--sla-dentro)' },
    { chave: 'atencao', rotulo: 'Atenção', cor: 'var(--sla-atencao)' },
    { chave: 'vencidas', rotulo: 'Vencidos', cor: 'var(--sla-vencido)' },
  ] as const;

  get total(): number {
    return this.sla.dentroPrazo + this.sla.atencao + this.sla.vencidas;
  }

  percentual(valor: number): number {
    return this.total ? Math.round((valor / this.total) * 100) : 0;
  }

  get arcos() {
    let acumulado = 0;
    const visiveis = this.faixas.filter((f) => this.sla[f.chave] > 0).length;
    return this.faixas.map((f) => {
      const comprimento = this.total ? (this.sla[f.chave] / this.total) * MEIA_VOLTA : 0;
      const arco = {
        ...f,
        traco: `${Math.max(0, comprimento - (visiveis > 1 ? VAO : 0))} ${2 * MEIA_VOLTA}`,
        deslocamento: -acumulado,
        visivel: comprimento > 0,
      };
      acumulado += comprimento;
      return arco;
    });
  }
}
