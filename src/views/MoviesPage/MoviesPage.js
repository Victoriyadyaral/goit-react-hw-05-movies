import { useState, useEffect } from 'react';
import {  NavLink, useRouteMatch, useLocation } from 'react-router-dom';
import { toast } from "react-toastify";
import PropTypes from 'prop-types';
import getMovieAPI from '../../services/getMovies-api';
import { FaSearch } from 'react-icons/fa';

import notImage from '../../image/image-not-found.png';

import PendingView from '../PendingView/PendingView';
import ErrorView from '../ErrorView/ErrorView';
import Button from '../../components/Button/Button';
import s from './MoviesPage.module.css';

const Status = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

function SearchMoviesView() {

    const [films, setFilms] = useState([]);
    const [query, setQuery] = useState('');
    const [request, setRequest] = useState('');
    const [page, setPage] = useState(1);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState(Status.IDLE);
    const { url } = useRouteMatch();
    const location = useLocation();
    
    const srcBaseUrl = 'https://image.tmdb.org/t/p/w500';
    
    const reset = () => {
        setQuery('');
    };

    
    const findFilms = (request, page, films) => {
         
        getMovieAPI.getFilmByRequest(request, page)
            .then(response => {
                 if (response.total_results > 0 && page === 1) {
        toast.info('Your films found. Have a nice viewing!')
      } else
      if (response.total_results === 0) {
        setStatus(Status.IDLE);
        toast.error('No film has been found. Please enter your request again!');  
      }
                setFilms([...films, ...response.results]);
                setStatus(Status.RESOLVED);
            })
            .catch(error => {
            setError(error);
            setStatus(Status.REJECTED);
      })
        //     //   .then(response => {
        //     //     if (response.total_results > 0 && page === 1) {
        //     //     toast.info('Your images found. Have a nice viewing!')
        //     //   } else
        //     //   if (response.total_results === 0) {
        //     //     setStatus(Status.IDLE);
        //     //     toast.error('No image has been found. Please enter your request again!');  
        //     //   }
        //     //     setFilms([...films,...response.results]);
        //     //     setStatus(Status.RESOLVED);
        //     //   }
        //     //   )
        //     //   .catch(error => {
        //     //     setError(error);
        //     //     setStatus(Status.REJECTED);
        //     //   })
    }
    
    const handleChange = event => {
        setQuery(event.currentTarget.value.toLowerCase());
    };

    const handleSubmit = event => {
        event.preventDefault();

        if (query.trim() === '') {
            toast.error('Sorry, that search term has no results. Please try an alternate search term.');
            return;
        }

        setRequest(query);
        reset();
          setStatus(Status.PENDING);
          findFilms(query, 1, []);
          setPage(2);
    };
    
    const changePage = () => {
        setPage(p => p + 1);
        setStatus(Status.PENDING);
        findFilms(request, page, films);
    };

    // //   useEffect(() => {
    // //     findFilms(request, page);
    // //   }, [request]);
    
    // useEffect(() => {
    //     if (!request) {
    //         return;
    //     };
    //     setStatus(Status.PENDING);
    //     findFilms(query, 1, films);
    //     setPage(2);
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [request]);
    
    if (status === 'idle') {
        return (<div>
            <h2>What films are you looking for?</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    autoComplete="off"
                    autoFocus
                    placeholder="Search movies here"
                    value={query}
                    onChange={handleChange}
                />
                <button type="submit">
                    <span>
                        Search
                        <FaSearch
                            style={{ marginRight: 8 }}
                            color="rgb(90, 64, 90)"
                            size="30px"
                            aria-label="Search images" />
                    </span>
                </button>
            </form>
        </div>
        );
    }

    if (status === 'pending') {
        return <PendingView />;
    }

    if (status === 'rejected') {
        return <ErrorView message={error.message} />;
    }

    if (status === 'resolved') {

        return (
            <>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        autoComplete="off"
                        autoFocus
                        placeholder="Search movies here"
                        value={query}
                        onChange={handleChange}
                    />
                    <button type="submit">
                        <span>
                            Search
                            <FaSearch
                                style={{ marginRight: 8 }}
                                color="rgb(90, 64, 90)"
                                size="30px"
                                aria-label="Search images" />
                        </span>
                    </button>
                </form>
                {films && (
                    <>
                        <ul className={s.filmsList}>
                            {films.map(({ poster_path, title, id }) => (
                                <li key={id}>
                                    <NavLink
                                        to={{
                                            pathname: `${url}/${id}`,
                                            state: {
                                                from: location.pathname,
                                            },
                                        }}
                                    >
                
                                        <img src={poster_path ? `${srcBaseUrl}${poster_path}` : notImage} alt={title} />
                                        <h3 className={s.title}>{title}</h3>
                
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                        {films.length > 19 && (
                            <Button onClick={changePage} />
                        )}
                    </>
                )}
            </>
        )
    }
}

SearchMoviesView.propTypes = {
    request: PropTypes.string,
    page: PropTypes.number,
    films: PropTypes.array,
  };

export default SearchMoviesView;