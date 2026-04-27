import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from './../../services/usuarios';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  standalone: false,
})
export class UsuariosPage implements OnInit {

  public formulario: FormGroup;
  public lista: any[] = []; 
  public eu: any = null;         
  public idEditando: string | null = null;

  constructor(private fb: FormBuilder, private service: UsuarioService) {

    this.formulario = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(8)]],
      perfil: ['usuario'] // Usuario padrão
    });
  }

  ngOnInit() {
    
    this.service.getUsuarioLogado().subscribe(dados => {
      this.eu = dados;
      
      // Se for perfil ADM para poder responder comentários.
      if (this.eu?.perfil === 'adm') {
        this.service.listarTodos().subscribe(todos => {
          this.lista = todos;
        });
      }
    });
  }

  async salvar() {
    if (this.idEditando) {
      await this.service.atualizar(this.idEditando, this.formulario.value);
      this.idEditando = null;
    } else {
      await this.service.cadastrar(this.formulario.value);
    }
    this.formulario.reset();
  }


  prepararEdicao(usuario: any) {
    this.idEditando = usuario.uid;
    this.formulario.patchValue(usuario);
  }

  // Função para desativar um usuário
  async desativar(uid: string) {
    await this.service.atualizar(uid, { status: 'desativado' });
  }
}