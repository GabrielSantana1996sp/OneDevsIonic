import { Injectable } from '@angular/core';
import {
  Firestore, collection, addDoc, collectionData, query,
  orderBy, doc, docData, updateDoc, deleteDoc, arrayUnion, arrayRemove, Timestamp, increment
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SugestoesService {
  constructor(private firestore: Firestore) { }

  async importarDadosIniciais(listaTopicos: any[]) {
  for (let topico of listaTopicos) {
    // Cria o documento do Tópico
    const docRef = await addDoc(collection(this.firestore, 'sugestoes'), {
      titulo: topico.titulo,
      texto: topico.texto,
      autor_nome: topico.autor_nome,
      autor_foto: topico.autor_foto || null,
      data: Timestamp.fromDate(new Date(topico.data)), // Converte a data do JSON
      votos: topico.votos,
      total_comentarios: topico.total_comentarios
    });
    
    // Cria os comentários dentro da subcoleção do tópico criado
    for (let c of topico.comentarios) {
      await addDoc(collection(this.firestore, `sugestoes/${docRef.id}/comentarios`), {
        texto: c.texto,
        autor_nome: c.autor_nome,
        autor_foto: null, // Como não temos foto nos comentários do JSON, colocamos nulo
        data: Timestamp.now()
      });
    }
  }
  console.log("Importação concluída com sucesso!");
}

  adicionarSugestao(texto: string, usuario: any) {
    const sugestaoRef = collection(this.firestore, 'sugestoes');
    return addDoc(sugestaoRef, {
      texto: texto,
      autor_nome: usuario.displayName || 'Dev Anônimo',
      autor_id: usuario.uid,
      autor_foto: usuario.photoURL || null,
      data: Timestamp.now(),
      votos: 0,
      quem_votou: [],
      total_comentarios: 0
    });
  }

  buscarSugestoes(filtro: string): Observable<any[]> {
    const sugestaoRef = collection(this.firestore, 'sugestoes');
    let q;
    if (filtro === 'recentes') q = query(sugestaoRef, orderBy('data', 'desc'));
    else if (filtro === 'populares') q = query(sugestaoRef, orderBy('votos', 'desc'));
    else q = query(sugestaoRef, orderBy('data', 'asc'));

    return collectionData(q, { idField: 'id' }) as Observable<any[]>;
  }

  buscarTopicoPorId(id: string): Observable<any> {
    return docData(doc(this.firestore, `sugestoes/${id}`), { idField: 'id' });
  }

  async adicionarComentario(topicoId: string, texto: string, usuario: any) {
    const comentariosRef = collection(this.firestore, `sugestoes/${topicoId}/comentarios`);
    await addDoc(comentariosRef, {
      texto: texto,
      autor_nome: usuario.displayName || 'Dev Anônimo',
      autor_id: usuario.uid,
      autor_foto: usuario.photoURL || null,
      data: Timestamp.now()
    });
    return updateDoc(doc(this.firestore, `sugestoes/${topicoId}`), {
      total_comentarios: increment(1)
    });
  }

  buscarComentarios(topicoId: string): Observable<any[]> {
    const q = query(collection(this.firestore, `sugestoes/${topicoId}/comentarios`), orderBy('data', 'asc'));
    return collectionData(q, { idField: 'id' }) as Observable<any[]>;
  }

  votar(sugestaoId: string, userId: string, jaVotou: boolean) {
    return updateDoc(doc(this.firestore, `sugestoes/${sugestaoId}`), {
      quem_votou: jaVotou ? arrayRemove(userId) : arrayUnion(userId),
      votos: increment(jaVotou ? -1 : 1)
    });
  }

  excluirSugestao(id: string) { return deleteDoc(doc(this.firestore, `sugestoes/${id}`)); }
  editarSugestao(id: string, novoTexto: string) { return updateDoc(doc(this.firestore, `sugestoes/${id}`), { texto: novoTexto }); }
}