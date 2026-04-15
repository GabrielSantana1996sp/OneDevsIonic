import { Component, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false
})
export class HomePage {

  @ViewChild(IonContent, { static: false }) content!: IonContent;

  constructor(private router: Router) {}

  ano = new Date().getFullYear();

  index = 0;

  ferramentas = [
    { nome: 'VPN', imagem: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPuSVpDkSWHQH68eOnBAhzT0fs4iEbThTW0A&s' },
    { nome: 'NodeJS', imagem: 'https://cdn-icons-png.flaticon.com/512/919/919825.png' },
    { nome: 'WireShark', imagem: 'https://miro.medium.com/1*sOhbhWnnmBx7TxHddLPW0Q.png' },
    { nome: 'Pentest', imagem: 'https://resh.com.br/wp-content/uploads/2022/08/imagem_pentest_post_resh-01-1-scaled-1.jpg' }
  ];

  paraQuem = [
    { titulo: 'Profissionais de TI', desc: 'Ambiente profissional', icon: 'cafe-outline' },
    { titulo: 'Entusiastas Linux', desc: 'Ferramentas avançadas', icon: 'code-slash-outline' },
    { titulo: 'Pentesters', desc: 'Ferramentas de segurança', icon: 'shield-outline' },
    { titulo: 'Empresas', desc: 'Ambiente confiável', icon: 'business-outline' },
  ];

  porque = [
    { titulo: 'Segurança Máxima', icon: 'lock-closed-outline' },
    { titulo: 'Disponibilidade', icon: 'time-outline' },
    { titulo: 'Performance', icon: 'flash-outline' },
    { titulo: 'Ferramentas', icon: 'construct-outline' }
  ];

  // CARROSSEL
  atras() {
    this.index = (this.index - 1 + this.ferramentas.length) % this.ferramentas.length;
  }

  frente() {
    this.index = (this.index + 1) % this.ferramentas.length;
  }

  // SCROLL ENTRE SEÇÕES
  scrollTo(id: string) {
    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  //  NAVEGAÇÃO PARA LOGIN
  irParaLogin() {
    this.router.navigate(['/tela-login']);
  }

}
