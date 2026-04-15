import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SugestoesPage } from './sugestoes.page';

const routes: Routes = [
  {
    path: '',
    component: SugestoesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SugestoesPageRoutingModule {}
