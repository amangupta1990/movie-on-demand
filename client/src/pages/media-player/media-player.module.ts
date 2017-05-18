import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MediaPlayer } from './media-player';

@NgModule({
  declarations: [
    MediaPlayer,
  ],
  imports: [
    IonicPageModule.forChild(MediaPlayer),
  ],
  exports: [
    MediaPlayer
  ]
})
export class MediaPlayerModule {}
