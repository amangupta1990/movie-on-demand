import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {MediaPlayer} from "../media-player/media-player";
import {DataService} from "../../providers/data-service";
@Component({
  selector: 'page-list',
  templateUrl: 'history.html'
})
export class HistoryPage {
  selectedItem: any;
  icons: string[];
  items: Array<{title: string, note: string, icon: string}>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private service:DataService) {
  
    

  }

  ngOnInit(){
      this.service.getHistory()
        .subscribe((movies:any)=>{
          this.items = movies.data;
  
          })
        }
  

  itemTapped(video) {
    // That's right, we're pushing to ourselves!
    this.navCtrl.push(MediaPlayer,{data:video});
  }
}
