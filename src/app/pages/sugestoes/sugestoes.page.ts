import { Component, OnInit } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, query, orderBy, where, doc, updateDoc, arrayUnion, arrayRemove, increment } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth'; // Importe o Auth
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sugestoes',
  templateUrl: './sugestoes.page.html',
  styleUrls: ['./sugestoes.page.scss'],
  standalone: false,
})
export class SugestoesPage implements OnInit {
  novaSugestao: string = '';
  sugestoes$!: Observable<any[]>;
  filtroAtual: string = 'recentes';
  userId: string | undefined;

  constructor(
    private firestore: Firestore,
    private auth: Auth // Injetado para identificar o usuário
  ) {
    this.userId = this.auth.currentUser?.uid;
  }

  ngOnInit() {
    this.carregarSugestoes();
  }

  carregarSugestoes() {
    const sugestoesRef = collection(this.firestore, 'sugestoes');
    let q;

    // Se o filtro for populares, ordena por curtidas. Se não, por data.
    if (this.filtroAtual === 'populares') {
      q = query(sugestoesRef, orderBy('curtidas', 'desc'));
    } else {
      q = query(sugestoesRef, orderBy('data', 'desc'));
    }

    this.sugestoes$ = collectionData(q, { idField: 'id' });
  }

  async enviarSugestao() {
    if (this.novaSugestao.trim().length < 5) return;

    const sugestoesRef = collection(this.firestore, 'sugestoes');
    await addDoc(sugestoesRef, {
      usuarioNome: this.auth.currentUser?.displayName || 'Usuário OneDevs',
      usuarioId: this.userId,
      texto: this.novaSugestao,
      data: new Date(),
      curtidas: 0,
      usuariosCurtiram: [],
      status: 'pendente'
    });
    this.novaSugestao = '';
  }

  async toggleCurtida(sugestao: any) {
    if (!this.userId) return; // Só curte se estiver logado

    const docRef = doc(this.firestore, `sugestoes/${sugestao.id}`);

    if (sugestao.usuariosCurtiram?.includes(this.userId)) {
      await updateDoc(docRef, {
        curtidas: increment(-1),
        usuariosCurtiram: arrayRemove(this.userId)
      });
    } else {
      await updateDoc(docRef, {
        curtidas: increment(1),
        usuariosCurtiram: arrayUnion(this.userId)
      });
    }
  }

  filtrarStatus(event: any) {
    const status = event.detail.value;
    const sugestoesRef = collection(this.firestore, 'sugestoes');
    let q;

    if (status === 'todos') {
      this.carregarSugestoes(); // Volta para a listagem padrão
      return;
    } else {
      // Nota: Isso pode exigir a criação de um índice no Console do Firebase
      q = query(sugestoesRef, where('status', '==', status), orderBy('data', 'desc'));
    }
    this.sugestoes$ = collectionData(q, { idField: 'id' });
  }
}
