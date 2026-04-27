import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, updateDoc, collection, collectionData, docData, deleteDoc } from '@angular/fire/firestore';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  constructor(private firestore: Firestore, private auth: Auth) {}

  // 1. Criar a conta e salvar se é ADM ou não
  async cadastrar(dados: any) {
    const credencial = await createUserWithEmailAndPassword(this.auth, dados.email, dados.senha);
    const uid = credencial.user.uid;
    
    // Salva na ficha do banco
    return setDoc(doc(this.firestore, `usuarios/${uid}`), {
      nome: dados.nome,
      email: dados.email,
      perfil: dados.perfil, // 'adm' ou 'usuario'
      status: 'ativo'
    });
  }

  // 2. Pegar os dados de QUEM está logado agora
  getUsuarioLogado() {
    const uid = this.auth.currentUser?.uid;
    return docData(doc(this.firestore, `usuarios/${uid}`));
  }

  // 3. Listar todos (Só para o ADM ver)
  listarTodos() {
    return collectionData(collection(this.firestore, 'usuarios'), { idField: 'uid' });
  }

  // 4. Editar ou Desativar
  atualizar(uid: string, novosDados: any) {
    return updateDoc(doc(this.firestore, `usuarios/${uid}`), novosDados);
  }
}