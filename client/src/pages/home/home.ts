import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import {MediaPlayer} from '../media-player/media-player';
import {Http} from '@angular/Http';
import {DataService} from '../../providers/data-service';
import {Observable} from 'rxjs';
import dragscroll from 'dragscroll';
declare var dragScroll:any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})

export class HomePage {
  @ViewChild("container") container:ElementRef;
  private moviesList: any[];
  private containerWidth = '';
  constructor(public navCtrl: NavController,
  public service:DataService,
  private ele:ElementRef) {

  }

  ngOnInit(){
    this.service.getData()
        .subscribe((data:any)=>{
          this.moviesList = data.entries;
          
          // calcualte the widith of the scroll container based on the width of the elements
          this.containerWidth = data.entries.length*(317+20)+"px";
          Observable.range(0,1).delay(500).subscribe(()=>{
            dragScroll.reset();
          })
        })
  }

openVideo(video){
  this.navCtrl.push(MediaPlayer,{data:video});
}

truncate(text){
  return  text!=null?`${text.split('').slice(0,150).join('')}...`:'';
}

}
