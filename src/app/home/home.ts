import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Libro, LibroService } from '../libro-service';
import { TablaLibros } from '../tabla-libros/tabla-libros';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatCardModule, MatFormFieldModule, MatSelectModule, TablaLibros],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  librosEnPantalla: Libro[] = [];
  categoriaSeleccionada = 'Todas';

  constructor(private libroService: LibroService) {}

  ngOnInit(): void {
    this.librosEnPantalla = this.libroService.obtenerLibros();
  }

  filtrarPorCategoria(categoria: string): void {
    this.categoriaSeleccionada = categoria;
    this.librosEnPantalla = this.libroService.buscarPorCategoria(categoria);
  }
}
