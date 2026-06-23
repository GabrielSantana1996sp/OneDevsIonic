import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; 
import { SugestoesService } from './../../services/sugestoes';
import { Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-detalhes-topico',
  templateUrl: './detalhes-topico.page.html',
  styleUrls: ['./detalhes-topico.page.scss'],
  standalone: false,
})
export class DetalhesTopicoPage {
  // 1. Declarar as variáveis necessárias
  topicoId: string = '';
  topico: Observable<any> | undefined;
  comentarios: Observable<any[]> | undefined;
  novoComentario: string = '';

  constructor(
    private route: ActivatedRoute, 
    private service: SugestoesService,
    private auth: Auth
  ) {
  
    this.topicoId = this.route.snapshot.paramMap.get('id')!;
    
    
    this.carregarDados();
  }

  carregarDados() {
    if (this.topicoId) {
      this.topico = this.service.buscarTopicoPorId(this.topicoId);
      this.comentarios = this.service.buscarComentarios(this.topicoId);
    }
  }

  async enviarComentario() {
    if (!this.novoComentario.trim()) return;

    const user = this.auth.currentUser;
    if (user) {
      await this.service.adicionarComentario(this.topicoId, this.novoComentario, user);
      this.novoComentario = ''; 
    }
  }
}