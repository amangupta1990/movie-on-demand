import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import {MediaPlayer} from '../media-player/media-player';
import {Http} from '@angular/Http';
import {DataService} from '../../providers/data-service';
import {Observable} from 'rxjs';
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
        .subscribe((movies:any)=>{
          this.moviesList = movies.data;
          
          // calcualte the widith of the scroll container based on the width of the elements
          this.containerWidth = movies.data.length*(317+20)+"px";
          Observable.range(0).delay(500).subscribe(()=>{
            dragScroll.reset();
          })
        })
  }

openVideo(video){
  this.navCtrl.push(MediaPlayer,{data:video});
  // also , update the the user's watched time 
  this.service.updateLastWatched({
    movieId:video.id
  }).subscribe(data=> console.log(data.data.message),err=>console.log(err.data.message))
}

truncate(text){
  return  text!=null?`${text.split(' ').slice(0,50).join(' ')}...`:'';
}

}
