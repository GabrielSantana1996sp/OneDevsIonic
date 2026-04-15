import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';

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
    private auth: Auth // Injeção necessária para o Firebase funcionar
  ) {}

  async login() {

    if (!this.email || !this.senha) {
      // obrigatório se não colocar nada
      this.erro = 'Preencha todos os campos!';
      return;
    }

    this.erro = ''; // Limpa o erro antes de tentar o login real

    try {
      // NOVA FUNÇÃO: Logado com sucesso via Firebase
      const res = await signInWithEmailAndPassword(this.auth, this.email, this.senha);

      console.log('Logado com sucesso:', res.user);

      // redireciona para a tela de sugestões (ou a home '/')
      this.router.navigate(['/sugestoes']);

    } catch (e: any) {
      // se a senha ou email estiverem errados ou houver erro de rede
      console.error(e);
      this.erro = 'Email ou senha inválidos!';
    }
  }
}
