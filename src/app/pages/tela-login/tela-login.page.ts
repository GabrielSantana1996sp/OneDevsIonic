import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-tela-login',
  templateUrl: './tela-login.page.html',
  styleUrls: ['./tela-login.page.scss'],
  standalone: false,
})
export class TelaLoginPage {

  // ISSO SÃO TODOS OS CAMPOS E MOSTRANDO O ERRO EM UMA STRING
  email: string = '';
  senha: string = '';
  erro: string = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  async login() {
    if(!this.email || !this.senha) {
      this.erro = 'Preencha todos os campos';
      return;
    }

    try {
      await this.authService.login(this.email, this.senha);
      this.router.navigate(['/sugestoes']);
    } catch (e: any) {
      this.erro = 'Email ou senha inválidos!'
    }
  }

  irParaRegistrar(){
    this.router.navigate(['/registrar']);
  }

}