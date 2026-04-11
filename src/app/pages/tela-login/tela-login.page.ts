import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tela-login',
  templateUrl: './tela-login.page.html',
  styleUrls: ['./tela-login.page.scss'],
  standalone: false
})
export class TelaLoginPage {

  // ISSO SÃO TODOS OS CAMPOS E MOSTRANDO O ERRO EM UMA STRING
  email: string = '';
  senha: string = '';
  erro: string = '';

  constructor(private router: Router) {}

  login() {

    if (!this.email || !this.senha) {

      // obrigatório se não colocar nada
      this.erro = 'Preencha todos os campos!';
      return;
    }

    // exemplo fake de login
    if (this.email === 'admin@email.com' && this.senha === '1234') {

      // se caso der algum erro
      this.erro = '';

      // redireciona para a tela inicial
      this.router.navigate(['/']);
    } else {
      
      // se a senha ou email estiverem errados
      this.erro = 'Email ou senha inválidos!';
    }
  }

}
