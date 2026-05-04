import { Component } from '@angular/core';
import { AuthService } from "../../services/auth"
import { Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  styleUrls: ['./registrar.page.scss'],
  standalone: false,
})
export class RegistrarPage {

  nickname = ''; // Novo campo
  email = '';
  senha = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {}

  async cadastrar() {
    
    if (!this.nickname || !this.email || !this.senha) {
      this.presentToast('Preencha todos os campos corretamente', 'warning');
      return;
    }

    const loading = await this.loadingCtrl.create({ message: 'Criando conta...' });
    await loading.present();

    try {
      await this.authService.registrar(this.email, this.senha, this.nickname);

      await loading.dismiss();
      this.presentToast('Conta criada com sucesso!', 'success');
      this.router.navigate(['/tela-login']);

    } catch (error: any) {
      await loading.dismiss();
      let mensagem = 'Erro ao cadastrar';
      if (error.code === 'auth/email-already-in-use') mensagem = 'Este e-mail já está em uso';
      if (error.code === 'auth/weak-password') mensagem = 'A senha deve ter pelo menos 6 caracteres!';

      this.presentToast(mensagem, 'danger');
    }
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color
    });
    toast.present();
  }
}