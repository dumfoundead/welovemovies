const service = require("./movies.service.js");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function movieExists(req, res, next) {
  const movie = await service.read(req.params.movieId);
  if (movie) {
    res.locals.movie = movie;
    return next();
  }
  next({ status: 404, message: `Movie cannot be found.` });
}

function read(req, res) {
  const { movie } = res.locals;
  res.json({ data: movie });
}

async function list(req, res) {
  const data = await service.list();
  res.json({ data });
}

async function listShowing(req, res) {
  const { is_showing } = req.query;
  if (is_showing) {
    res.json({ data: await service.listShowing() });
  } else {
    res.json({ data: await service.list() });
  }
}

async function listTheaters(req, res, next) {
  const { movieId } = req.params;
  res.json({ data: await service.listTheaters(movieId) });
}

async function listReviews(req, res, next) {
  const { movieId } = req.params;
  let reviews = await service.listReviews(movieId);
  res.json({ data: reviews });
}

module.exports = {
  read: [asyncErrorBoundary(movieExists), read],
  list: asyncErrorBoundary(list),
  listShowing: asyncErrorBoundary(listShowing),
  listTheaters: asyncErrorBoundary(listTheaters),
  listReviews: asyncErrorBoundary(listReviews),
};
