const models = require('../models');
const response = require('../functions/serviceUtil.js');
const auth = require('../middlewares/auth.js');
const CustomError = require('../functions/CustomError');
const axios = require("axios"); 

module.exports = {
  name: 'moviesController',

  insert: async (req, res, next) => {
    try {
      // Start Transaction
      const result = await models.sequelize.transaction(async (transaction) => {
        // Filter valid movie atributs
        if (!req.body.title) throw new CustomError('Please fill movie title and user_id', 412);
        if (!req.body.user_id) throw new CustomError('Please fill movie "title" and "user_id"', 412);

        // Insert movie data to database
        const movie = await models.favorite_movie.create(req.body);

        // Return output api
        return {
          title: movie.title,
          user_id: movie.user_id,
        };
      });
      // Transaction complete!
      res.status(200).send(response.getResponseCustom(200, result));
      res.end();
    } catch (error) {
      // Transaction Failed!
      next(error);
    }
  },

  movies: async (req, res, next) => {
    try {
      // Start Transaction
      const result = await models.sequelize.transaction(async (transaction) => {
        return {
          message: "Forbidden"
        };
      });
      // Transaction complete!
      res.status(403).send(response.getResponseCustom(403, result));
      res.end();
    } catch (error) {
      // Transaction Failed!
      next(error);
    }
  },

  movieList: async (req, res, next) => {
    try {
      // Start Transaction
      const result = await models.sequelize.transaction(async (transaction) => {
        // Get user_id from session cookies
        const user_id = await req.cookies['user_id']

        // Get movie data from user_id
        const movies = await models.favorite_movie.findAll({ 
          attributes: ['title'],
          where: {
            user_id: user_id
          }
        })

        // Get all title of movie in to array
        let title = movies.map(x => x.title)

        // Function to get poster url using axios
        let getPoster = async title => {
          const url = "https://www.omdbapi.com/?s=" + title + "&apikey=thewdb"
          let movieData = await axios.get(url)
          let posterUrl = await movieData.data.Search[0].Poster
          return posterUrl
        }

        // Get all off movie poster url in to array
        let moviePoster = await Promise.all(title.map(getPoster))

        // Return to make all api movie poster url data
        return {
          moviePoster
        }
      });
      // Transaction complete!
      res.status(200).send(response.getResponseCustom(200, result));
      res.end();
    } catch (error) {
      // Transaction Failed!
      next(error);
    }
  },

  favoriteMovie: async (req, res, next) => {
    try {
      // Start Transaction
      const result = await models.sequelize.transaction(async (transaction) => {
        // Get movie title from params
        let title = [ req.params.title ]

        // Function to get poster url using axios
        let getPoster = async title => {
          const url = "https://www.omdbapi.com/?s=" + title + "&apikey=thewdb"
          let movieData = await axios.get(url)
          let posterUrl = await movieData.data.Search[0].Poster
          return posterUrl
        }

        // get movie poster url
        let moviePoster = await Promise.all(title.map(getPoster))

        // return to make url poster api by title in params
        return {
          moviePoster
        }
      });
      // Transaction complete!
      res.status(200).send(response.getResponseCustom(200, result));
      res.end();
    } catch (error) {
      // Transaction Failed!
      next(error);
    }
  },
};
