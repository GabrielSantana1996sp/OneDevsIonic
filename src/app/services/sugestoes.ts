import { Injectable } from '@angular/core';
import { 
  Firestore, collection, addDoc, collectionData, query, 
  orderBy, doc, updateDoc, deleteDoc, arrayUnion, arrayRemove, Timestamp, increment 
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SugestoesService {

  constructor(private firestore: Firestore) { }

  adicionarSugestao(texto: string, usuario: any) {
    const sugestaoRef = collection(this.firestore, 'sugestoes');
    return addDoc(sugestaoRef, {
      texto: texto,
      autor_nome: usuario.displayName || 'Dev Anônimo',
      autor_id: usuario.uid,
      data: Timestamp.now(), 
      votos: 0,
      quem_votou: [] 
    });
  }

  buscarSugestoes(filtro: string): Observable<any[]> {
    const sugestaoRef = collection(this.firestore, 'sugestoes');
    let q;

    if (filtro === 'recentes') {
      q = query(sugestaoRef, orderBy('data', 'desc'));
    } else if (filtro === 'populares') {
      q = query(sugestaoRef, orderBy('votos', 'desc'));
    } else {
      q = query(sugestaoRef, orderBy('data', 'asc'));
    }

    return collectionData(q, { idField: 'id' }) as Observable<any[]>;
  }

  votar(sugestaoId: string, userId: string, jaVotou: boolean) {
    const docRef = doc(this.firestore, `sugestoes/${sugestaoId}`);

    if (jaVotou) {
      return updateDoc(docRef, {
        quem_votou: arrayRemove(userId),
        votos: increment(-1) // Remove 1 voto de forma atômica
      });
    } else {
      return updateDoc(docRef, {
        quem_votou: arrayUnion(userId),
        votos: increment(1) // Adiciona 1 voto de forma atômica
      });
    }
  }

  excluirSugestao(id: string) {
  const docRef = doc(this.firestore, `sugestoes/${id}`);
  return deleteDoc(docRef);
}

  editarSugestao(id: string, novoTexto: string) {
  const docRef = doc(this.firestore, `sugestoes/${id}`);
  return updateDoc(docRef, { texto: novoTexto });
}
}