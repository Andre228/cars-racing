import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TrackComponent } from './track/track.component';
import { ScoreComponent } from './score/score.component';
import { ModalComponent } from './widgets/modal/modal.component';

@NgModule({
  declarations: [
    AppComponent,
    TrackComponent,
    ScoreComponent,
    ModalComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
