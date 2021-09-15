import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import  PropTypes  from 'prop-types';

import getMovieAPI from '../../services/getMovies-api';

import s from './Reviews.module.css';

export default function Reviews() {
    const [reviews, setReviews] = useState([]);
    const { movieId } = useParams();
    //const srcBaseUrl = 'https://image.tmdb.org/t/p/w300';

    useEffect(() => {
        getMovieAPI.getMovieReviews(movieId).then(responce => setReviews(responce.results));
    }, [movieId]);
    
    return (
        <> 
            {reviews.length ?
                (<div className={s.reviews}>
                    <h3 className={s.reviewsDesc}>This film has {reviews.length} reviews</h3>
                    <ul> 
                    {reviews.map(review => (
                        <li key={review.id} className={s.review} >
                            <h3 className={s.author}>Author: {review.author}</h3>
                            <p className={s.reviewContent}>
                                {review.content}
                            </p>
                        </li>
                    ))
                    }
                    </ul>
                </div>
                )
                :
                (
                    <p className={s.noInfo}>There are no reviews about this movie.</p>
                )
            }
        </>
    )
};

Reviews.propTypes = {
  reviews: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      author: PropTypes.string,
      content: PropTypes.string,
    }),
  ),
};