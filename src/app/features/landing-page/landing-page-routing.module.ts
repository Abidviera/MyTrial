import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScrollthreedComponent } from './scrollthreed/scrollthreed.component';

const routes: Routes = [
   {path: '', component:ScrollthreedComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingPageRoutingModule { }
