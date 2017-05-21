import { Component, ViewChild, ElementRef, HostListener } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
declare var document: any;
@Component({
  selector: 'page-media-player',
  templateUrl: 'media-player.html',
})
export class MediaPlayer {
  @ViewChild('player') screen: ElementRef;
  /**
   * 
   * @param e 
   * bind's the component function to the window's keydown event .
   * this is needed for detecting the escape key and the sapcebar for play pause
   */
  @HostListener('window:keydown', ['$event'])
  checkKey(e) {
    e = e || window.event;

    //exit fullscreen:
    if (e.keyCode == '13')
      this.isFullScreen = false;

    // toggle play pause
    if (e.keyCode == '32') {
      this.playbackEle.paused ? this.playbackEle.play() : this.playbackEle.pause();
    }

  }
  private video: any;
  private title: string;
  private src: string;
  private playbackEle: any;
  private screenWidth: number;
  private screenHeight: number;
  private screenContext: any;
  private volume: number;
  private timeElapsed: string;
  private duration: string;
  private currentTime: number;
  private totalTime: number;
  private seeker;
  private isFullScreen: boolean;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.isFullScreen = false;
    this.video = navParams.get("data");
    this.title = this.video.title;
    this.src = this.video.contents[0].url;
  }

  ngAfterViewInit() {

    /**
     * get the canvas context and initialize it fit the current screen's aspect ratio
     */
    this.screenContext = this.screen.nativeElement.getContext('2d');
    this.screenWidth = Math.floor(this.screen.nativeElement.clientWidth);
    this.screenHeight = this.screenWidth / 2.031;
    this.screen.nativeElement.width = this.screenWidth;
    this.screen.nativeElement.height = this.screenHeight;
    // set up the video Element

    /**
     * create a new video lement and set the source to the current selected video
     */
    this.playbackEle = document.createElement('video');
    this.playbackEle.src = this.src;
    this.playbackEle.preload = "auto";

    /**
     * handler for adjusting the the video and controls to fit on window resize
     */
    window.addEventListener('resize', () => {
      this.screenWidth = Math.floor(this.screen.nativeElement.clientWidth);
      this.screenHeight = this.screenWidth / 2.031;
      this.screen.nativeElement.width = this.screenWidth;
      this.screen.nativeElement.height = this.screenHeight - 60;
      document.querySelector(".controls").setAttribute('style', `width:${this.screenWidth}px`);
    })

    this.playbackEle.addEventListener('play', () => {
      this.renderVideo(this.screenContext, this.playbackEle)
    })

    /**
     *  once the mdia player has loaded , set up the control to respond to certain mouse events 
     */
    setTimeout(() => {

      //adjust control width
      document.querySelector(".controls").setAttribute('style', `width:${this.screenWidth}px`);

      this.seeker = document.querySelector(".seek");
      this.seeker.querySelector(".range-knob-handle")
        .addEventListener("mouseup", () => {

          this.playbackEle.play()
        });

      this.playbackEle.addEventListener('play', () => {
        this.renderVideo(this.screenContext, this.playbackEle)
      })
    }, 100);

    this.playbackEle.play();
    let startVol = this.playbackEle.volume * 100;
    this.volume = startVol;
    this.duration = this.toHHMMSS(this.playbackEle.duration.toString());

  }

 /**
  * 
  * @param screen 
  * @param video 
  called when the video is being played . it renders the video element into the canvas.
  it also update the elapsed time of the video
  */
  renderVideo(screen, video) {
    if (video.paused || video.ended) return false;
    screen.drawImage(video, 0, 0, this.screenWidth, this.screenHeight);
    this.timeElapsed = this.toHHMMSS(Math.round(this.playbackEle.currentTime).toString());
    this.currentTime = Math.round(this.playbackEle.currentTime);
    this.totalTime = Math.round(this.playbackEle.duration);
    setTimeout(() => { this.renderVideo(screen, video) }, 20);
  }


  /**
   *  when the user exists the video player, stop the video and destroy it .
   */
  ngOnDestroy() {
    this.playbackEle.pause();
    delete this.playbackEle;
  }

  adjustVolume(volume) {
    this.playbackEle.volume = volume.value * 0.01;
  }

  seek(event) {
    if (event.isFocus()) {
      this.playbackEle.pause();
      let seekValue = event.value;
      this.playbackEle.currentTime = seekValue;
      this.timeElapsed = this.toHHMMSS(seekValue);
    }

  }

  /**
   * takes a duration value in seconds and converts it into hh:mm:ss
   */
  toHHMMSS = function (secs) {
    if (!NaN) return "00:00:00";
    let sec_num = parseInt(secs, 10); // don't forget the second param
    let hours: any = Math.floor(sec_num / 3600);
    let minutes: any = Math.floor((sec_num - (hours * 3600)) / 60);
    let seconds: any = sec_num - (hours * 3600) - (minutes * 60);

    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    return hours + ':' + minutes + ':' + seconds;
  }

  
  toggleFullScreen() {
    if (!this.isFullScreen) {
      let ele = document.querySelector("#videoContent");
      ele.requestFullscreen =
        ele.webkitRequestFullscreen || ele.requestFullscreen || ele.mozRequestFullscreen;
      ele.requestFullscreen();
      this.isFullScreen = true;

    } else {


      document.cancelFullscreen =
        document.webkitExitFullscreen || document.exitExitFullscreen || document.mozExitFullscreen;
      document.cancelFullscreen();
      this.isFullScreen = false;

    }
  }


}


