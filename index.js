const express = require('express');
const cookieParser = require('cookie-parser');
const http = require('http');
const uuid = require("uuid");
const fs = require('fs');
const bodyParser = require("body-parser");
const Datastore = require('nedb');

/**delete the database */
try {
    fs.unlinkSync(__dirname+"/db/db");
}
catch (e) {
    console.info("DB does not exit");
}

/**
 * create a new db and import the movies into it
 */
const db = new Datastore({ filename: './db/db', autoload: true });
let mockData = require("./data/movies.json").entries.map(item => { item.dataType = "movie"; return item; });
db.insert(mockData);
console.log("Database ready");
const app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * define simple routes 
 * 
 */

/**
 * get the list of movies 
 */

app.get('/movies', (req, res) => {
    db.find({ dataType: "movie" }).exec((err, movies) => {
        if (!err) {
            res.status(200).json({ message: "", data: movies });
        }
        else {
            res.status(500).json({ message: "Error getting movies", data: null });
        }
    })
});

/**
 * get the user's history
 */

app.get("/history", (req, res) => {
    const userID = req.cookies.movie_app_user;
    db.find({ userId: userID, dataType: "history" }).sort({ lastWatched: -1 }).exec( (err, results)=> {
        if (!err) {
            // filter movies based on these results 
            Promise.all(results.map(item => {
                return _findMovie(item.movieId);
            })
            ).then(movies => {
                // map the lastwatched field into the movies and send it back
                results.map((r,i,a)=>{ movies[i].lastWatched = r.lastWatched; })
                res.status(200).json({ message: "", data: movies });
            })
                .catch(err => {
                    res.status(500).json({ message: "Error getting history", data: null });
                })



        }
        else {
            res.status(500).json({ message: "Error getting history", data: null });
        }
    });

});

/**
 * update a selected movie into the user's history 
 */

app.post("/history", (req, res) => {
    let userID = req.cookies.movie_app_user;
    let lastWatched = Date.now();
    let movieId = req.body.data.movieId;

    // find the movie and update 

    db.findOne({ "userId": userID, movieId: movieId }).exec((err, exists) => {
        if (!err && exists) {
            // update the last watched time .
            db.update({ _id: exists._id}, { $set:{lastWatched: Date.now()} },{}, (err, success) => {
                if (!err && success) {
                    res.status(200).json({ data: "", message: "history updated successfully" })
                }
                else {
                    res.status(500).json({ data: "", message: "Error updating history" })
                }
            })
        }
        else {
            // create a new history
            let history = {
                dataType: "history",
                userId: userID,
                movieId: movieId,
                lastWatched: Date.now()
            };

            db.insert(history, (err, success) => {
                if (!err && success) {
                    
                    res.status(200).json({ data: "", message: "history created successfully" })
                }
                else {
                    res.status(500).json({ data: "", message: "Error creating  history" });
                }
            })
        }

    })
});

app.get("/", (req, res) => {

    // set cookie for a new user 
    if (!req.cookies.movie_app_user) {

        // create a user history document:
        res.cookie('movie_app_user', uuid());
    }
    res.sendfile("index.html", { root: "./client/www" });
});
app.use(express.static('./client/www/'));

http.createServer(app).listen(process.env.PORT || 8080);




function _findMovie(id) {
    return new Promise((resolve, reject) => {
        db.findOne({ id: id , dataType:"movie"}).exec((err, success)=> {
            if (!err)
                resolve(success);
            else
                reject(err);
        })
    })
}

