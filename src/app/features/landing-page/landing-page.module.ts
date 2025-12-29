import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingPageRoutingModule } from './landing-page-routing.module';
import { ScrollthreedComponent } from './scrollthreed/scrollthreed.component';


@NgModule({
  declarations: [
    ScrollthreedComponent
  ],
  imports: [
    CommonModule,
    LandingPageRoutingModule
  ]
})
export class LandingPageModule { }
