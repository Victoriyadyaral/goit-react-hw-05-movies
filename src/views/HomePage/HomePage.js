import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { toast } from "react-toastify";

import getMovieAPI from '../../services/getMovies-api';

import s from './HomePage.module.css';


function HomeView () {

  const [popularFilms, setPopularFilms] = useState([]);
  const location = useLocation();
  const srcBaseUrl = 'https://image.tmdb.org/t/p/w500';


  const findPopularFilms = () => {
    
    getMovieAPI
      .getPopularMovies()
      .then(response => {
        setPopularFilms(response.results);
      })
      .catch(error => {
        toast.error(`No response from server! ${error.message}`);
      })
  };

  useEffect(() => {
    findPopularFilms();
  }, []);

  return (
      <>
        <h1>The most popular today</h1>
         <ul className={s.filmsList}>
        {popularFilms.map(({ poster_path, title, id }) => (
          <li key={id} className={s.filmsListItem}>
            <Link
              to={{
                pathname: `/movies/${id}`,
                state: {
                  from: location.pathname,
                },
              }}
            >
              <img src={`${srcBaseUrl}${poster_path}`} alt="" />
              <h3 className={s.title}>{title}</h3>
            </Link>
          </li>
        ))}
      </ul>
        </>
      )
};

export default HomeView;