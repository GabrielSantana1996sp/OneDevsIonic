import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetalhesTopicoPage } from './detalhes-topico.page';

const routes: Routes = [
  {
    path: '',
    component: DetalhesTopicoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetalhesTopicoPageRoutingModule {}
