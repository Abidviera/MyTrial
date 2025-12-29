import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingPageRoutingModule } from './landing-page-routing.module';
import { ScrollthreedComponent } from './scrollthreed/scrollthreed.component';
import { MediaComponent } from './media/media.component';
import { FormsModule } from '@angular/forms';
import { Media2Component } from './media2/media2.component';
import { ScrollinggalleryComponent } from './scrollinggallery/scrollinggallery.component';


@NgModule({
  declarations: [
    ScrollthreedComponent,
    MediaComponent,
    Media2Component,
    ScrollinggalleryComponent
  ],
  imports: [
    CommonModule,
    LandingPageRoutingModule,
    FormsModule
  ]
})
export class LandingPageModule { }
