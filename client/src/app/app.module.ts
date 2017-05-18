import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import {HttpModule, JsonpModule} from "@angular/http";
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { HistoryPage } from '../pages/history/history';
import {MediaPlayer} from '../pages/media-player/media-player';
import {DataService} from '../providers/data-service';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    HistoryPage,
    MediaPlayer
  ],
  imports: [
    HttpModule,
    JsonpModule,
    BrowserModule,
    IonicModule.forRoot(MyApp)
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    HistoryPage,
    MediaPlayer
  ],
  providers: [
    DataService,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
  ]
})
export class AppModule {}
