const db = require("../database/models");
const sequelize = db.sequelize;

//Otra forma de llamar a los modelos
const Movies = db.Movie;

const moviesController = {
  list: (req, res) => {
    db.Movie.findAll().then((movies) => {
      res.render("moviesList.ejs", { movies });
    });
  },
  detail: (req, res) => {
    db.Movie.findByPk(req.params.id).then((movie) => {
      res.render("moviesDetail.ejs", { movie });
    });
  },
  new: (req, res) => {
    db.Movie.findAll({
      order: [["release_date", "DESC"]],
      limit: 5,
    }).then((movies) => {
      res.render("newestMovies", { movies });
    });
  },
  recomended: (req, res) => {
    db.Movie.findAll({
      where: {
        rating: { [db.Sequelize.Op.gte]: 8 },
      },
      order: [["rating", "DESC"]],
    }).then((movies) => {
      res.render("recommendedMovies.ejs", { movies });
    });
  }, //Aqui debemos modificar y completar lo necesario para trabajar con el CRUD
  add: function (req, res) {
    db.Genre.findAll({
      order: ["name"],
    }).then((genres) => res.render("moviesAdd", { genres }));
  },
  create: function (req, res) {
    const { title, release_date, awards, length, rating, genre } = req.body;
    db.Movie.create({
      title: title.trim(),
      release_date,
      awards,
      length,
      rating,
      genre,
    }).then((movie) => {
      console.log(movie);
      return res.redirect("/movies");
    });
  },
  edit: function (req, res) {
    db.Movie.findByPk(req.params.id)
    .then(movie => {
      res.render('moviesEdit',{movie})
    }).catch(error=> console.log(error))


  },
  update: function (req, res) {
    const {title,release_date,length,awards,rating,genre} = req.body
    db.Movie.update(
    {
      title,
      genre_id : genre,
      release_date,
      length,
      awards,
      rating
    },
    {
    where : {
      id : req.params.id
    }
    }
    ).then(()=> {
      res.redirect('/movies')
    }).catch(error=>console.log(error))
  },
  delete: function (req, res) {
    db.Movie.findByPk(req.params.id)
    .then(movie => {
      res.render('moviesDelete',{movie} )
    }).catch(error=>console.log(error))
  },
  destroy: function (req, res) {
    db.Movie.destroy(
      {
        where : {
          id : req.params.id
        }
      }
    )
    res.redirect('/movies')
    }
};

module.exports = moviesController;
