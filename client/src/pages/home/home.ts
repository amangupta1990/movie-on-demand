import { Component, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import {MediaPlayer} from '../media-player/media-player';
import {DataService} from '../../providers/data-service';
declare var window:any;
declare var dragscroll:any;


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})

export class HomePage {
  private moviesList: any[];
  private containerWidth = '';
  private selector:number = 0 ;
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
        
                
  
        })
  }

  ngAfterViewInit(){
           if(!dragscroll)
                window.onload = ()=>{ dragscroll.reset(); }
                else
                setTimeout(()=>{
                   dragscroll.reset();
                }, 100);

                // add event left and right arrows event listeners for checkig
                window.addEventListener('keydown',(e)=>{
                   e = e || window.event;

 // if the enter key is pressed , play the movie 

 if(e.keyCode == '13'){
   this.openVideo(this.moviesList[this.selector]);
   
 }

     if (e.keyCode == '37') {
       if(this.selector > 0)
     this.selector--;
   
              
    }
    else if (e.keyCode == '39') {
          if(this.selector < this.moviesList.length)
         this.selector ++;
    }

      document.querySelector(".horizontal-scroll").querySelectorAll('ion-card')[this.selector].scrollIntoView()
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
  return  text!=null?`${text.split(' ').slice(0,15).join(' ')}...`:'';
}

}
