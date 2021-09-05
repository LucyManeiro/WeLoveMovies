const service = require("./reviews.service.js");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//middleware to determine that requested review exists
async function reviewExists(req, res, next){
    const {reviewId} = req.params;
    const review = await service.read(reviewId);
    if(review){
        res.locals.review = review;
        return next();
    }
    return next({
        status: 404,
        message: `Review cannot be found`
    });
}

//returns data for requested review and associated critic 
async function readAndAppend(req, res){
    const review = await service.readAndAppend(req.params.reviewId)
    review.critic.critic_id = review.critic_id
    res.json({data:review})
}

//updates review
async function update(req, res){
    const {data} = req.body
    const {review} = res.locals
    const updatedReview = {
        ...review,
        ...data
    }
    await service.update(updatedReview);
    updatedReview.critic= await service.criticList(updatedReview.critic_id)
    res.json({data: updatedReview})
}

//returns reviews fors specified movie
async function listReviews(req, res){
    let reviews = await service.reviewInfo(req.params.movieId);
    res.json({data:reviews})
}

//deletes specified review
async function destroy(req, res){
    const review_id = req.params.reviewId
    await service.destroy(review_id);
    res.sendStatus(204);
}

module.exports = {
    list: asyncErrorBoundary(listReviews),
    readAndAppend: [asyncErrorBoundary(reviewExists), readAndAppend],
    update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(update)],
    delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)]
}