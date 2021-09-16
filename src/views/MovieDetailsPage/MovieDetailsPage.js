import { useState, useEffect, lazy, Suspense } from 'react';
import { useParams, NavLink, Route, useRouteMatch, useLocation, useHistory, Redirect } from 'react-router-dom';
import  PropTypes  from 'prop-types';
import getMovieAPI from '../../services/getMovies-api';
import notImage from '../../image/image-not-found.png';
import PendingView from '../PendingView/PendingView';

import s from './MovieDetailsPage.module.css';

const Cast = lazy(() => import('../Cast/Cast' /* webpackChunkName: "cast" */));
const Reviews = lazy(() => import('../Reviews/Reviews' /* webpackChunkName: "reviews" */));

export default function MovieDetailsPage() {
  const { movieId } = useParams();
  const { url, path } = useRouteMatch();
  const [film, setFilm] = useState(null);
  const [from, setFrom] = useState('');
  const location = useLocation();
  const history = useHistory();
  const srcBaseUrl = 'https://image.tmdb.org/t/p/w500';
    
  useEffect(() => {
    getMovieAPI.getFilmInfoById(movieId).then(setFilm);
  }, [movieId]);

  useEffect(() => {
    if (location?.state?.from === '/' || location?.state?.from === '/movies') {
     setFrom(location?.state?.from ?? '/');
    }
    return;
  }, [location?.state?.from]);

  function onGoBack() {
     history.push(from);
    // if (refLocation.current.state) {
    //   const { pathname, search } = refLocation.current.state.from;
    //   history.push(search ? pathname + search : pathname);
    // } else {
    //   const path = refLocation.current.pathname.includes('movies')
    //     ? '/movies'
    //     : '/';
    //   history.push(path);
    // }
  }
   
  return (
      <>

      {film && (
        <>
        <div className={s.backBtnWrap}>
        <button type="button" onClick={onGoBack} className={s.backBtn}>
              Go back
        </button>
        </div>
        <div className={s.filmWrap}>
        <div className={s.imageWrap}>
        <img
          src={film.poster_path ? `${srcBaseUrl}${film.poster_path}` : notImage}
          alt={film.title}
        />
        </div>

          <ul className={s.description}>
        <li className={s.descriptionItem}>
          <h2>
            {film.title} ({film.release_date.slice(0, 4)})
          </h2>
        </li>
        <li className={s.descriptionItem}>
          <p>IMDB rating : {film.vote_average}/10</p>
        </li>
        <li className={s.descriptionItem}>
          <h3>Overview :</h3>
              <p className={s.overview}>{film.overview}</p>
        </li>
        <li className={s.descriptionItem}>
          <h3>Genres :</h3>
          <ul className={s.genres}>
                { film.genres.map((genre, index) => (
                  <li key={index}>{genre.name}</li>
                  ))}
          </ul>
        </li>
        </ul>
        </div>
        </>
      )}
      
      <div className={s.detailsWrap}>
        <NavLink
          to={`${url}/cast`}
          className={s.link}
          activeClassName={s.activeLink}
        >
          Cast
        </NavLink>
        <NavLink
          to={`${url}/reviews`}
          className={s.link}
          activeClassName={s.activeLink}
        >
          Reviews
        </NavLink>
      </div>

      <Suspense fallback={<PendingView />}>
      <Route path={`${path}/cast`} exact>
        <Cast />
      </Route>

      <Route path={`${path}/reviews`} exact>
        <Reviews />
        </Route>

        <Redirect to="/" />
      </Suspense>
    </>
  );
};


MovieDetailsPage.propTypes = {
  film: PropTypes.shape({
    poster_path: PropTypes.string,
    title: PropTypes.string,
    vote_average: PropTypes.number,
    overview: PropTypes.string,
    genres: PropTypes.array,
  }),
};