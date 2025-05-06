const express = require("express");
const cors = require("cors");
const app = express();

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

const initalizeDataBase = require("./db/db.connect");

app.use(express.json());

initalizeDataBase();

const Movie = require("./models/movies.models");

async function addMovieData(newMovie) {
  try {
    const movie = await Movie(newMovie);
    const saveMovie = await movie.save();
    return movie;
  } catch (error) {
    console.log(error);
  }
}

app.post("/movies", async (req, res) => {
  try {
    const saveMovieData = await addMovieData(req.body);
    res
      .status(201)
      .json({ message: "Movie added successfully.", movie: saveMovieData });
  } catch (error) {
    res.status(500).json({ error: "Failed to add movie." });
  }
});

async function getAllMovies() {
  try {
    const allMovies = await Movie.find();
    return allMovies;
  } catch (error) {
    console.log(error);
  }
}
app.get("/movies", async (req, res) => {
  try {
    const allMoviesData = await getAllMovies();
    if (allMoviesData.length != 0) {
      res.send(allMoviesData);
    } else {
      res.status(404).json({ error: "No Movie Found!" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch the movie" });
  }
});

async function getMovieByTitle(titleOfMovie) {
  try {
    const movieTitle = await Movie.findOne({ title: titleOfMovie });
    return movieTitle;
  } catch (err) {
    console.log(err);
  }
}
app.get("/movies/:title", async (req, res) => {
  try {
    const movieByTitle = await getMovieByTitle(req.params.title);
    if (movieByTitle) {
      res.json(movieByTitle);
    } else {
      res.status(400).json({ error: "Movie Not Found." });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch the world" });
  }
});

async function getMovieByDirectorName(directorName) {
  try {
    const movieByDirector = await Movie.find({ director: directorName });
    return movieByDirector;
  } catch (error) {
    console.log(err);
  }
}
app.get("/movies/director/:directorName", async (req, res) => {
  try {
    const movieDataByDirector = await getMovieByDirectorName(
      req.params.directorName
    );
    if (movieDataByDirector.length !== 0) {
      res.send(movieDataByDirector);
    } else {
      res.status(404).json({ error: "No Movie Found!" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch the movie." });
  }
});
async function getMovieBygenre(genreName) {
  try {
    const movies = await Movie.find({ genre: genreName });
    return movies;
  } catch (error) {
    console.log(err);
  }
}
app.get("/movies/genre/:genreName", async (req, res) => {
  try {
    const movieByGenre = await getMovieBygenre(req.params.genreName);
    if (movieByGenre.length != 0) {
      res.send(movieByGenre);
    } else {
      res.status(500).json({ error: "Failed to fetch the movie." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch the movie." });
  }
});

async function deleteMovieById(movieID) {
  try {
    const movieById = await Movie.findByIdAndDelete(movieID);
    return movieById;
  } catch (error) {
    console.log(error);
  }
}

app.delete("/movies/:movieId", async (req, res) => {
  try {
    const deleteMovie = await deleteMovieById(req.params.movieId);
    if (deleteMovie) {
      res.status(200).json({ message: "Movie Deleted successfully." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch the movie" });
  }
});

async function updateMovie(movieId, dataToUpdate) {
  try {
    const movieUpdateData = await Movie.findByIdAndUpdate(
      movieId,
      dataToUpdate,
      {
        new: true,
      }
    );
    return movieUpdateData;
  } catch (error) {
    console.log("Error to updating Movie", error);
  }
}

app.post("/movies/:movidId", async (req, res) => {
  try {
    const updatedMovieData = await updateMovie(req.params.movidId, req.body);
    if (updatedMovieData) {
      res
        .status(200)
        .json({ message: "Movie updated successfully", updatedMovieData });
    } else {
      res.status(404).json({ error: "Movie not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch the movie" });
  }
});
app.listen(3000, () => {
  console.log("Server is Running");
});
