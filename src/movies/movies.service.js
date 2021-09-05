const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties")

//critic details to be added to review
const addCritic = mapProperties({
    critic_id: "critic.critic_id",
    preferred_name: "critic.preferred_name",
    surname: "critic.surname",
    organization_name: "critic.organization_name",
})

//retrieves data to list movies
function list(){
    return knex("movies")
    .select("*")
}

//retrieves data for theaters showing specific movies
function listTheatersByMovie(movieId){
    return knex("movies as m")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .join("theaters as t", "t.theater_id", "mt.theater_id")
    .select("t.*", "mt.is_showing", "mt.movie_id")
    .where({"mt.movie_id": movieId})
}

//retrieves data for reviews for specific movie
function listReviews(movieId){
    return knex("reviews as r")
    .join("critics as c", "c.critic_id", "r.critic_id")
    .select("*")
    .where({"r.movie_id": movieId})
    .then((returnedReviews)=> {
        const reviewList= [];
        returnedReviews.forEach((review)=> {
            const appendCritic = addCritic(review);
            reviewList.push(appendCritic);
        })
        return reviewList;
    })

}

//retrieves data on movies that are currently showing
function isShowingList(){
    return knex("movies as m")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .distinct("m.*")
    .where({"mt.is_showing":true})
}

//retrieves data for specific movie
function read(movieId){
    return knex("movies")
    .select("*")
    .where({movie_id: movieId})
}


module.exports = {
    list,
    read,
    listReviews,
    listTheatersByMovie,
    isShowingList,
}