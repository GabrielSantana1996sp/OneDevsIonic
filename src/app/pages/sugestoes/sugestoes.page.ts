import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth';
import { SugestoesService } from '../../services/sugestoes';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-sugestoes',
  templateUrl: './sugestoes.page.html',
  styleUrls: ['./sugestoes.page.scss'],
  standalone: false
})
export class SugestoesPage implements OnInit {
  filtro: string = 'recentes';
  listaSugestoes: any[] = [];
  user: any;

  constructor(
    private authService: AuthService,
    private sugestoesService: SugestoesService,
    private router: Router,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    
    this.authService.getUsuarioObservable().subscribe(user => {
      this.user = user;
      if (this.user) {
        this.carregarDados();
      } else {
        
        this.router.navigate(['/login']);
      }
    });
  }

  carregarDados() {
    this.sugestoesService.buscarSugestoes(this.filtro).subscribe(res => {
      this.listaSugestoes = res;
    });
  }

  aplicarFiltro() {
    this.carregarDados();
  }

async novaSugestao() {
 
  if (!this.user) {
    this.presentToast('Aguarde o carregamento do perfil...', 'warning');
    return;
  }

  const alert = await this.alertCtrl.create({
    header: 'Nova Sugestão',
    inputs: [
      { 
        name: 'comentario', 
        type: 'textarea', 
        placeholder: 'Sua ideia para o OneDevs...' 
      }
    ],
    buttons: [
      { text: 'Cancelar', role: 'cancel' },
      { 
        text: 'Enviar', 
        handler: (data) => { 
          
          if (data.comentario && data.comentario.trim() !== '') {
            this.enviarDados(data.comentario); 
          } else {
            this.presentToast('O comentário não pode estar vazio.', 'warning');
          }
        } 
      }
    ]
  });
  await alert.present();
}

async enviarDados(texto: string) {
  try {
    
    await this.sugestoesService.adicionarSugestao(texto, this.user);
    
    this.presentToast('Sugestão enviada com sucesso!', 'success');
    
    
    this.carregarDados(); 
    
  } catch (error: any) {
    console.error('Erro ao gravar no Firebase:', error);
    
   
    if (error.code === 'permission-denied') {
      this.presentToast('Erro de permissão no Firestore. Verifique as Regras!', 'danger');
    } else {
      this.presentToast('Erro ao enviar. Tente novamente.', 'danger');
    }
  }
}

  async prepararEdicao(sugestao: any) {
    const alert = await this.alertCtrl.create({
      header: 'Editar Sugestão',
      inputs: [{ name: 'novoTexto', type: 'textarea', value: sugestao.texto }],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Salvar',
          handler: (data) => {
            this.sugestoesService.editarSugestao(sugestao.id, data.novoTexto);
            this.presentToast('Atualizado!', 'success');
          }
        }
      ]
    });
    await alert.present();
  }


  async confirmarExclusao(id: string) {
    const alert = await this.alertCtrl.create({
      header: 'Excluir Sugestão',
      message: 'Tem certeza que deseja apagar?',
      buttons: [
        { text: 'Não', role: 'cancel' },
        {
          text: 'Sim',
          handler: () => {
            this.sugestoesService.excluirSugestao(id);
            this.presentToast('Excluído!', 'medium');
          }
        }
      ]
    });
    await alert.present();
  }

  async votar(sugestao: any) {
    const jaCurtiu = this.jaVotou(sugestao);
    await this.sugestoesService.votar(sugestao.id, this.user.uid, jaCurtiu);
  }

  jaVotou(sugestao: any): boolean {
    return sugestao.quem_votou?.includes(this.user?.uid);
  }

  async confirmarLogout() {
    const alert = await this.alertCtrl.create({
      header: 'Sair',
      message: 'Deseja desconectar?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Sair',
          handler: async () => {
            await this.authService.logout();
            this.router.navigate(['/home']);
          }
        }
      ]
    });
    await alert.present();
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000, color });
    toast.present();
  }
}