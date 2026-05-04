import { Injectable } from '@angular/core';
import { 
  Auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut, 
  updateProfile 
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth) { }

  // Realiza o login
  login(email: string, senha: string) {
    return signInWithEmailAndPassword(this.auth, email, senha);
  }

  async registrar(email: string, senha: string, nickname: string) {
   const credencial = await createUserWithEmailAndPassword(this.auth, email, senha);
   
   return updateProfile(credencial.user, {
      displayName: nickname,
      photoURL: ''
    });
  }


  logout() {
    return signOut(this.auth);
  }

  // Retorna os dados do usuário atual
  getUsuarioAtual() {
    return this.auth.currentUser;
  }
}