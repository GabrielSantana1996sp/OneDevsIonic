import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SugestoesPageRoutingModule } from './sugestoes-routing.module';

import { SugestoesPage } from './sugestoes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SugestoesPageRoutingModule
  ],
  declarations: [SugestoesPage]
})
export class SugestoesPageModule {}
