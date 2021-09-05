const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//middleware function to determine if movie exists
async function movieExists(req, res, next){
    const movieList = await service.read(req.params.movieId);
    const movie = movieList[0];
    if(movie){
        res.locals.movie = movie;
        return next();
    }
    return next({
        status: 404, 
        message: `Movie cannot be found`
    })
}

//lists all movies currently showing
async function list(req, res){
    const isShowing = req.query.is_showing;
    const data = isShowing ? await service.isShowingList() :
    await service.list();
    res.json({data})
}

//lists theaters that specific movie is playing in
async function listTheatersByMovie(req, res, next){
    const {movieId} = req.params;
    const data = await service.listTheatersByMovie(movieId)
    res.json({data})
}

//lists reviews for specific movie
async function listReviews(req, res, next){
    const {movieId} = req.params;
    const reviews = await service.listReviews(movieId)
    res.json({data: reviews});
}

//returns information for specific movie
async function read(req, res){
    const {movie} = res.locals;
    res.json({data: movie});
}


module.exports = {
    list: asyncErrorBoundary(list),
    read: [asyncErrorBoundary(movieExists), asyncErrorBoundary(read)],
    listTheaters: [asyncErrorBoundary(movieExists), asyncErrorBoundary(listTheatersByMovie)],
    listReviews: [asyncErrorBoundary(movieExists), asyncErrorBoundary(listReviews)],
}