import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalhesTopicoPageRoutingModule } from './detalhes-topico-routing.module';

import { DetalhesTopicoPage } from './detalhes-topico.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalhesTopicoPageRoutingModule
  ],
  declarations: [DetalhesTopicoPage]
})
export class DetalhesTopicoPageModule {}
