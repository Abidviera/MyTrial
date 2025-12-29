import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScrollthreedComponent } from './scrollthreed/scrollthreed.component';
import { MediaComponent } from './media/media.component';

const routes: Routes = [
  { path: 'm', component: ScrollthreedComponent },
  { path: '', component: MediaComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LandingPageRoutingModule {}
