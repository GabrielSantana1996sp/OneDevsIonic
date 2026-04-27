import { Component, OnInit } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, query, orderBy, where, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { UsuarioService } from './../../services/usuarios';

@Component({
  selector: 'app-sugestoes',
  templateUrl: './sugestoes.page.html',
  styleUrls: ['./sugestoes.page.scss'],
  standalone: false,
})
export class SugestoesPage implements OnInit {
  novaSugestao: string = '';
  sugestoes$!: Observable<any[]>;
  filtroAtual: string = 'relevantes'; // Começamos pelos melhores
  userId: string | undefined;
  
  // AGORA USAMOS OS DADOS REAIS DO FIREBASE
  usuarioLogado: any = null;

  constructor(
    private firestore: Firestore,
    private auth: Auth,
    private alertController: AlertController,
    private usuarioService: UsuarioService // Serviço injetado
  ) {
    this.userId = this.auth.currentUser?.uid;
  }

  ngOnInit() {
    // Carregamos os dados de quem está logado para saber se é ADM
    this.usuarioService.getUsuarioLogado().subscribe(dados => {
      this.usuarioLogado = dados;
    });

    this.carregarSugestoes();
  }

  carregarSugestoes() {
    const sugestoesRef = collection(this.firestore, 'sugestoes');
    let q;

    // Lógica de Filtros que você pediu
    if (this.filtroAtual === 'relevantes') {
      q = query(sugestoesRef, orderBy('mediaEstrelas', 'desc')); // Maior nota primeiro
    } else if (this.filtroAtual === 'menor') {
      q = query(sugestoesRef, orderBy('mediaEstrelas', 'asc')); // Menor nota primeiro
    } else {
      q = query(sugestoesRef, orderBy('data', 'desc')); // Mais recentes
    }

    this.sugestoes$ = collectionData(q, { idField: 'id' });
  }

  async enviarSugestao() {
    if (this.novaSugestao.trim().length < 5) return;
    const sugestoesRef = collection(this.firestore, 'sugestoes');
    
    await addDoc(sugestoesRef, {
      usuarioNome: this.usuarioLogado?.nome || 'Usuário', // Usa o nome do banco
      usuarioId: this.userId,
      texto: this.novaSugestao,
      data: new Date(),
      mediaEstrelas: 0, // Começa com zero estrelas
      totalVotos: 0,
      status: 'pendente',
      respostaAdm: ''
    });
    this.novaSugestao = '';
  }

  // --- CRUD: EDITAR (Apenas o dono ou ADM pode) ---
  async abrirEditar(sugestao: any) {
    // Regra: Só edita se for o dono OU se for ADM
    if (sugestao.usuarioId !== this.userId && this.usuarioLogado?.perfil !== 'adm') {
      return; 
    }

    const alert = await this.alertController.create({
      header: 'Editar Sugestão',
      inputs: [{ name: 'novoTexto', type: 'textarea', value: sugestao.texto }],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Salvar',
          handler: async (data) => {
            const docRef = doc(this.firestore, `sugestoes/${sugestao.id}`);
            await updateDoc(docRef, { texto: data.novoTexto });
          }
        }
      ]
    });
    await alert.present();
  }

  // --- CRUD: RESPONDER (SÓ ADM VÊ ESSE BOTÃO NO HTML) ---
  async responderSugestao(sugestao: any) {
    const alert = await this.alertController.create({
      header: 'Responder como ADM',
      inputs: [{ name: 'resposta', type: 'textarea', placeholder: 'Sua resposta...' }],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Responder',
          handler: async (data) => {
            const docRef = doc(this.firestore, `sugestoes/${sugestao.id}`);
            await updateDoc(docRef, { 
              respostaAdm: data.resposta,
              status: 'respondida'
            });
          }
        }
      ]
    });
    await alert.present();
  }

  // --- CRUD: Excluir ---
  async excluirSugestao(id: string) {
    const docRef = doc(this.firestore, `sugestoes/${id}`);
    await deleteDoc(docRef);
  }

  // --- Sistema de Estrelas ---
  async avaliar(sugestao: any, nota: number) {
    const docRef = doc(this.firestore, `sugestoes/${sugestao.id}`);
    
    // Cálculo da média
    let novoTotalVotos = (sugestao.totalVotos || 0) + 1;
    let novaMedia = ((sugestao.mediaEstrelas * sugestao.totalVotos) + nota) / novoTotalVotos;

    await updateDoc(docRef, {
      mediaEstrelas: novaMedia,
      totalVotos: novoTotalVotos
    });
  }

  // Muda ordem dos comentários
  mudarFiltro(event: any) {
    this.filtroAtual = event.detail.value;
    this.carregarSugestoes();
  }
}