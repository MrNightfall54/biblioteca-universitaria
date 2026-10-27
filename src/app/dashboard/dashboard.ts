import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Chart, registerables } from 'chart.js';
import { LibroService } from '../libro-service';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})

export class Dashboard implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('graficoBarras') graficoBarras!: ElementRef<HTMLCanvasElement>;
  @ViewChild('graficoDona') graficoDona!: ElementRef<HTMLCanvasElement>;

  private barras?: Chart;
  private dona?: Chart;

  totalLibros = 0;
  totalEjemplares = 0;
  stockCritico = 0;
  stockSaludable = 0;

  constructor(private libroService: LibroService) { }

  ngOnInit(): void {
    const libros = this.libroService.obtenerLibros();

    this.totalLibros = libros.length;

    this.totalEjemplares = libros.reduce(
      (suma, libro) => suma + libro.disponibles,
      0
    );

    this.stockCritico = libros.filter(
      libro => libro.disponibles < 10
    ).length;

    this.stockSaludable = libros.filter(
      libro => libro.disponibles >= 10
    ).length;
  }

  ngAfterViewInit(): void {
    const libros = this.libroService.obtenerLibros(); // Extract
    const categorias = ['Programación', 'Bases de Datos', 'Redes', 'Ciencias Básicas'];

    const cantidades = categorias.map(categoria =>
      libros.filter(libro => libro.categoria === categoria)
        .reduce((suma, libro) => suma + libro.disponibles, 0)
    );

    // load
    this.barras = new Chart(this.graficoBarras.nativeElement, {
      type: 'bar',
      data: {
        labels: categorias,
        datasets: [{
          label: 'Unidades disponibles',
          data: cantidades,
          backgroundColor: ['#2563eb', '#0d9488', '#8b5cf6', '#f59e0b'],
          borderRadius: 7,
          maxBarThickness: 72
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: true } },
        scales: { y: { beginAtZero: true, ticks: { precision: 0 }, title: { display: true, text: 'Unidades disponibles' } } }
      }
    });

    this.dona = new Chart(this.graficoDona.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Stock Crítico (< 10)', 'Stock Saludable (≥ 10)'],
        datasets: [{ data: [this.stockCritico, this.stockSaludable], backgroundColor: ['#ef4444', '#22c55e'], borderWidth: 3, borderColor: '#fff' }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: { legend: { position: 'bottom' } }
      }
    });
  }

  ngOnDestroy(): void {
    this.barras?.destroy();
    this.dona?.destroy();
  }
}
