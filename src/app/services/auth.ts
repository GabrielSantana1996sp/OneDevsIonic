import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  authState,
  GithubAuthProvider
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth) { }


  async login(email: string, senha: string) {
    try {
      const credencial = await signInWithEmailAndPassword(this.auth, email, senha);
      return credencial;
    } catch (error) {
      console.error("Erro no login email e senha", error);
      throw error;
    }
  }

  async registrar(email: string, senha: string, nickname: string) {
    const credencial = await createUserWithEmailAndPassword(this.auth, email, senha);

    return updateProfile(credencial.user, {
      displayName: nickname,
      photoURL: ''
    });
  }

  //LOGIN COM O GOOGLE
  async loginGoogle() {
    const provider = new GoogleAuthProvider();
    const credencial = await signInWithPopup(this.auth, provider);
    console.log('Foto do Google', credencial.user.photoURL);

    return credencial;
  }

  //LOGIN COM GITHUB
    async loginGithub() {
    const provider = new GithubAuthProvider();
    const credencial = await signInWithPopup(this.auth, provider);
    return credencial;
  }



  logout() {
    return signOut(this.auth);
  }

  getUsuarioObservable(): Observable<any> {
    return authState(this.auth);
  }
  // Retorna os dados do usuário atual
  getUsuarioAtual() {
    return this.auth.currentUser;
  }
}
