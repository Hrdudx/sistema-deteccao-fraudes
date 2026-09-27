import { Component, Input } from '@angular/core';
import { DecimalPipe } from '@angular/common';

export interface FatiaGrafico {
  rotulo: string;
  valor: number;
  cor: string;
}

interface ArcoDesenhado extends FatiaGrafico {
  percentual: number;
  traco: string;
  deslocamento: number;
}

const RAIO = 46;
const CIRCUNFERENCIA = 2 * Math.PI * RAIO;
// Espaço de ~2px entre as fatias (vão da cor da superfície)
const VAO = 2;

// Gráfico de rosca em SVG puro (sem biblioteca), com total no centro e legenda
// com valor e percentual — a cor nunca é a única forma de identificar a fatia.
// Ao passar o mouse (ou focar) uma fatia/linha da legenda, o centro mostra o valor dela.
@Component({
  selector: 'app-grafico-rosca',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './grafico-rosca.component.html',
  styleUrl: './grafico-rosca.component.css',
})
export class GraficoRoscaComponent {
  @Input({ required: true }) fatias: FatiaGrafico[] = [];
  @Input() rotuloTotal = 'Total';
  @Input() descricao = '';

  destacada: string | null = null;

  get total(): number {
    return this.fatias.reduce((soma, f) => soma + f.valor, 0);
  }

  get arcos(): ArcoDesenhado[] {
    const total = this.total;
    if (!total) return [];
    const visiveis = this.fatias.filter((f) => f.valor > 0);
    const vao = visiveis.length > 1 ? VAO : 0;
    let acumulado = 0;
    return this.fatias.map((f) => {
      const comprimento = (f.valor / total) * CIRCUNFERENCIA;
      const arco: ArcoDesenhado = {
        ...f,
        percentual: (f.valor / total) * 100,
        traco: `${Math.max(0, comprimento - vao)} ${CIRCUNFERENCIA}`,
        deslocamento: -acumulado,
      };
      acumulado += comprimento;
      return arco;
    });
  }

  get centro(): { valor: number; rotulo: string } {
    const f = this.fatias.find((x) => x.rotulo === this.destacada);
    return f ? { valor: f.valor, rotulo: f.rotulo } : { valor: this.total, rotulo: this.rotuloTotal };
  }

  get resumoAcessivel(): string {
    const partes = this.fatias.map((f) => `${f.rotulo}: ${f.valor}`).join('; ');
    return `${this.descricao ? this.descricao + '. ' : ''}${this.rotuloTotal}: ${this.total}. ${partes}.`;
  }

  percentual(valor: number): number {
    return this.total ? Math.round((valor / this.total) * 100) : 0;
  }
}
