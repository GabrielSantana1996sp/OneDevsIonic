import { Component } from '@angular/core';
import { Router } from '@angular/router'; // 1. Importar

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  // 2. Injetar no construtor
  constructor(private router: Router) {}

  // 3. Método para chamar a outra página
  irParaOutraPagina() {
    this.router.navigate(['./pages/tela-login/tela-login']);
  }
}