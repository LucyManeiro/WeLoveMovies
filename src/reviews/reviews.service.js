const knex=require("../db/connection");


//retrives data from critics table for specific critic
function criticList(critic_id){
    return knex("critics")
    .select("*")
    .where({critic_id})
    .first()
}

//reads specific review and appends critic 
function readAndAppend(reviewId){
    return knex("reviews as r")
    .join("critics as c", "c.critic_id", "r.critic_id")
    .select("*")
    .where({review_id: reviewId})
    .first()
    .then(addCritic)
}

//retrieves data for specified review
function read(reviewId){
    return knex("reviews")
    .select("*")
    .where({review_id: reviewId})
    .first();
}

//updates review
function update(updatedReview){
    return knex("reviews")
    .select("*")
    .where({review_id: updatedReview.review_id})
    .update(updatedReview, "*")
    .then((updatedReviews)=> updatedReviews[0])
}


//deletes specified review from database
function destroy(reviewId){
    return knex("reviews").where(
        {review_id: reviewId}
    ).del();
}

module.exports = {
    read, 
    update,
    criticList,
    readAndAppend,
    destroy,
}