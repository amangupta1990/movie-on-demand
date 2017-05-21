# Movie on demand app

# DEMO:
https://movie-on-demand.herokuapp.com/

A simple movie player app built on :
 - Express js 
 -  Angular 2 ionic 
 - NEDB


# Features

   - navigation with mouse drag and arrow keys for movie selection
   - press enter to play slected movie or click on the play button
  - anonymous user session with playlist history
  - Media player with full screen , keyboard controls for start/pause
  - mobile responsive ( till some extent )

# Installation and running the server 


  - clone the repo.
  - cd into the repo and run npm install
  - run npm start
  - access the application at localhost 8080.
  
# Extra info:

The app is built using the ionic framework (angular2) . To develop the app:

- install ionic cli `npm install -g ionic`
- cd into the client directory and run `npm install`
- run `ionic serve`. This will launch the a new browser session. You can close this as it will not be required.
The commnads starts the ionic-app-scripts in watch mode to build the scource code as it is saved.
- NOTE: The express server must also be running in order for the app the run correctly during development.
- 
## building the app for production
Run `npm run build:www` . This commands build the AOT version of the app which lightweight .
