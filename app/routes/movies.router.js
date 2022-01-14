const express = require('express');

const router = express.Router();
const controllers = require('../controllers/index');
const { authMiddleware } = require('../middlewares/auth.js');

router.get('/movies', [ authMiddleware ], controllers.moviesController.movies);
router.get('/movies/favorite', [ authMiddleware ], controllers.moviesController.movieList);
router.get('/movies/:title', [  ], controllers.moviesController.favoriteMovie);
router.post('/movies/favorite', [ authMiddleware ], controllers.moviesController.insert);

module.exports = {
  basePath: '/',
  router,
};
