import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { UsuarioService } from './../../services/usuarios';

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
    private auth: Auth,
    private usuarioService: UsuarioService 
  ) {}

  async login() {

    if (!this.email || !this.senha) {
      // obrigatório se não colocar nada
      this.erro = 'Preencha todos os campos!';
      return;
    }

    this.erro = ''; // Limpa o erro antes de tentar o login real

    try {
      // Função: Logar no Firebase
      const res = await signInWithEmailAndPassword(this.auth, this.email, this.senha);

      console.log('Logado com sucesso:', res.user);

      // --- PARTE NOVA: VERIFICAR QUEM É O USUÁRIO ---
      this.usuarioService.getUsuarioLogado().subscribe((dados: any) => {
        
        if (dados.status === 'desativado') {
          this.erro = 'Sua conta está desativada!';
          return;
        }

        // Se for ADM, vai para a tela de gerenciar usuários
        if (dados.perfil === 'adm') {
          this.router.navigate(['/usuarios']);
        } else {
          // redireciona para a tela de sugestões (usuário comum)
          this.router.navigate(['/sugestoes']);
        }
      });
      // ----------------------------------------------

    } catch (e: any) {
      // se a senha ou email estiverem errados
      console.error(e);
      this.erro = 'Email ou senha inválidos!';
    }
  }
}