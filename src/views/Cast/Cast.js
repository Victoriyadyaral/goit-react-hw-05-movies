import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import  PropTypes  from 'prop-types';

import getMovieAPI from '../../services/getMovies-api';

import s from './Cast.module.css'

export default function Cast() {
    const [cast, setCast] = useState([]);
    const { movieId } = useParams();
    const srcBaseUrl = 'https://image.tmdb.org/t/p/w300';

    useEffect(() => {
        getMovieAPI.getMovieCast(movieId).then(responce => {
            const filtredCast = responce.cast.filter(actor => actor.popularity > 6);
            setCast(filtredCast)
        });
  }, [movieId]);
  
    return (
      <div className={s.castWrap}>
           {cast.length > 1 ? (
          <div className={s.cast}>
            {cast.map(actor => (
              <div key={actor.id} className={s.actor}>
                <img
                  src={`${srcBaseUrl}${actor.profile_path}`}
                  alt={actor.name}
                  className={s.castImage}
                />
              <p>{actor.name}</p>
            </div>
          ))}
        </div>
      ) : (
            <p className={s.noInfo}>Sorry. There is no information about the cast</p>
      )}
        </div>
    )
};

Cast.propTypes = {
  cast: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string,
      profile_path: PropTypes.string,
    }),
  ),
};