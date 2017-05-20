import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
declare var document:any;
/**
 * Generated class for the MediaPlayer page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-media-player',
  templateUrl: 'media-player.html',
})
export class MediaPlayer {
  @ViewChild('player') screen:ElementRef;
  private video:any;
  private title:string;
  private src:string;
  private playbackEle:any;
  private screenWidth:number;
  private screenHeight:number;
  private screenContext:any;
  private volume:number;
  private timeElapsed:string;
  private duration:string;
  private currentTime:number;
  private totalTime:number;
  private seeker;
  private isFullScreen:boolean;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  this.isFullScreen=false;
   this.video = navParams.get("data");
   this.title = this.video.title;
   this.src = this.video.contents[0].url;
  }

  ngAfterViewInit(){
   // set up the fullscreen change event
    document.addEventListener('webkitfullscreenchange', this.exitHandler, false);
    document.addEventListener('mozfullscreenchange', this.exitHandler, false);
    document.addEventListener('fullscreenchange', this.exitHandler, false);
    document.addEventListener('MSFullscreenChange',this. exitHandler, false);
   
   this.screenContext =this.screen.nativeElement.getContext('2d');
   this.screenWidth =Math.floor(this.screen.nativeElement.clientWidth);
   this.screenHeight = this.screenWidth /2.031;
   this.screen.nativeElement.width   = this.screenWidth;
   this.screen.nativeElement.height = this.screenHeight;
   // set up the video Element

   // create the vide element
   this.playbackEle = document.createElement('video');
   this.playbackEle.src = this.src;
   this.playbackEle.preload = "auto";
  
   // handle window resize:
   window.addEventListener('resize',()=>{
     this.screenWidth =Math.floor(this.screen.nativeElement.clientWidth);
   this.screenHeight = this.screenWidth /2.031;
   this.screen.nativeElement.width   = this.screenWidth;
   this.screen.nativeElement.height = this.screenHeight-60;
   })

   this.playbackEle.addEventListener('play',()=>{
     this.renderVideo(this.screenContext,this.playbackEle)
   })

     setTimeout(()=>{

      //adjust control width
      document.querySelector(".controls").setAttribute('style',`width:${this.screenWidth}px`);

      this.seeker =  document.querySelector(".seek");
    this.seeker.querySelector(".range-knob-handle")
    .addEventListener("mouseup",()=>{ 
    
       this.playbackEle.play()});

   this.playbackEle.addEventListener('play',()=>{
     this.renderVideo(this.screenContext,this.playbackEle)
   })
   }, 100);

    this.playbackEle.play();
    let startVol = this.playbackEle.volume*100;
    this.volume = startVol;
    this.duration = this.toHHMMSS(this.playbackEle.duration.toString());
    
  }

  renderVideo(screen,video){
    if(video.paused || video.ended) return false;
    screen.drawImage(video,0,0,this.screenWidth,this.screenHeight);
    this.timeElapsed = this.toHHMMSS(Math.round(this.playbackEle.currentTime).toString());
    this.currentTime = Math.round(this.playbackEle.currentTime);
    this.totalTime = Math.round(this.playbackEle.duration);
    setTimeout(()=>{this.renderVideo(screen,video)},20);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MediaPlayer');
  }

  ngOnDestroy(){
    this.playbackEle.pause();
    delete this.playbackEle;
  }

  adjustVolume(volume){
    this.playbackEle.volume = volume.value*0.01;
  }

  seek(event){
    if(event.isFocus()){
    this.playbackEle.pause();
    let seekValue = event.value;
    this.playbackEle.currentTime = seekValue;
    this.timeElapsed = this.toHHMMSS(seekValue);
  }

  }

  toHHMMSS = function (secs) {
    if(!NaN) return "00:00:00";
    let sec_num = parseInt(secs, 10); // don't forget the second param
    let hours:any   = Math.floor(sec_num / 3600);
    let minutes:any = Math.floor((sec_num - (hours * 3600)) / 60);
    let seconds:any = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;
}

  toggleFullScreen() {
  if (!this.isFullScreen) {
    let ele = document.querySelector("#videoContent");
     ele.requestFullscreen =
      ele.webkitRequestFullscreen || ele.requestFullscreen || ele.mozRequestFullscreen;
      ele.requestFullscreen();
     this.isFullScreen=true;

  } else {


     document.cancelFullscreen =
      document.webkitExitFullscreen || document.exitExitFullscreen || document.mozExitFullscreen;
      document.cancelFullscreen();
       this.isFullScreen=false;
    
  }
}

 exitHandler()
{
   this.isFullScreen  =document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement;
    
       
   }
}


