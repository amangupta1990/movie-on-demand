import { Component , HostListener} from '@angular/core';
import { NavController } from 'ionic-angular';
import { MediaPlayer } from '../media-player/media-player';
import { DataService } from '../../providers/data-service';
declare var window: any;
declare var dragscroll: any;


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})

export class HomePage {
    /**
   * 
   * @param e 
   * bind to the window's keydow event . handles arrow keys for movie selection and enter to play the movie
   */
  @HostListener('window:keydown', ['$event'])
    checkKey(e) {
    {
      e = e || window.event;

      // if the enter key is pressed , play the movie 

      if (e.keyCode == '13') {
        this.openVideo(this.moviesList[this.selector]);

      }

      if (e.keyCode == '37') {
        if (this.selector > 0)
          this.selector--;


      }
      else if (e.keyCode == '39') {
        if (this.selector < this.moviesList.length)
          this.selector++;
      }

     
    }
  }
  /**
   * stores the list of movies 
   */
  private moviesList: any[];
  /**
   * the width to which the list container should adjust to
   */
  private containerWidth = '';
  /**
   * stores the currently selected movie's index 
   */
  private selector: number = 0;
  constructor(public navCtrl: NavController,
    public service: DataService) {

  }

  ngOnInit() {
    this.service.getData()
      .subscribe((movies: any) => {
        this.moviesList = movies.data;

        // calcualte the widith of the scroll container based on the width of the elements
        this.containerWidth = movies.data.length * (317 + 20) + "px";
        //hide the splashScreen
       


      })
  }

  ngAfterViewInit() {
    if (!dragscroll)
      window.onload = () => { dragscroll.reset(); }
    else
      setTimeout(() => {
        dragscroll.reset();
      }, 100);
      /**
       * hide the splash screen after the app has loaded and the list of movies have been fetched 
       */
       document.querySelector(".splashscreen").classList.add("hidden");
  




  }



/**
 * 
 * @param video 
 * launches the video player by passing the selected video item to the media player.
 * also calles the server to update the user's history.
 */
  openVideo(video) {
    this.navCtrl.push(MediaPlayer, { data: video });
    // also , update the the user's watched time 
    this.service.updateLastWatched({
      movieId: video.id
    }).subscribe(data => console.log(data.data.message), err => console.log(err.data.message))
  }

  /**
   * 
   * @param text 
   * truncates the video's description to 15 words .
   */
  truncate(text) {
    return text != null ? `${text.split(' ').slice(0, 15).join(' ')}...` : '';
  }



}
