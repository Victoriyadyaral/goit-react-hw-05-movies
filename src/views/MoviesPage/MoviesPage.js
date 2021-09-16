import { useState, useEffect } from 'react';
import {  NavLink, useRouteMatch, useLocation, useHistory } from 'react-router-dom';
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
    const history = useHistory();
    const srcBaseUrl = 'https://image.tmdb.org/t/p/w500';
    
    const reset = () => {
        setQuery('');
    };

    useEffect(() => {
    if (location.search === '') {
      return;
    }

    const currentQueryUrl = new URLSearchParams(location.search).get('query') ?? '';
        const currentPageUrl = Number(new URLSearchParams(location.search).get('page') ?? 1);
        
        setPage(currentPageUrl);
        setRequest(currentQueryUrl)
        // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

    const setHistory = (query, value = 1) => {
        history.push({ ...location, search: `query=${query}&page=${value}` });
    };
    
    const findFilms = (request, page, films) => {
   
        getMovieAPI.getFilmByRequest(request, page)
            .then(response => {
                if (response.total_results > 0 && page === 1) {
                    toast.info('Your films found. Have a nice viewing!')
                } else
                    if (response.total_results === 0) {
                        setStatus(Status.IDLE);
                        toast.error('Any films has been found. Please enter your request again!');
                    }
                setFilms([...films, ...response.results]);
                setStatus(Status.RESOLVED);
            })
            .catch(error => {
                setError(error);
                setStatus(Status.REJECTED);
            })
    };
    
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
        setPage(1);
        setFilms([]);
        reset();
        setStatus(Status.PENDING);
        setHistory(query, 1);
    };
    
    const changePage = () => {
        setPage(p => p + 1);
    };
    
    useEffect(() => {
    if (!request) {
      return;
    };
     
        findFilms(request, page, films);
        setHistory(request, page);
   // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, request]);
    
    if (status === 'idle') {
        return (<div>
            <h2>What films are you looking for?</h2>
            <form className={s.searchForm} onSubmit={handleSubmit}>
                <input
                    className={s.searchFormInput}
                    type="text"
                    autoComplete="off"
                    autoFocus
                    placeholder="Search movies here"
                    value={query}
                    onChange={handleChange}
                />
                <button type="submit" className={s.searchFormButton}>
                    <span> 
                        <FaSearch
                            style={{ marginRight: 8 }}
                            color="rgb(250, 149, 17)"
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
                <form className={s.searchForm} onSubmit={handleSubmit}>
                    <input
                        className={s.searchFormInput}
                        type="text"
                        autoComplete="off"
                        autoFocus
                        placeholder="Search movies here"
                        value={query}
                        onChange={handleChange}
                    />
                    <button type="submit" className={s.searchFormButton}>
                        <span>
                            <FaSearch
                                style={{ marginRight: 8 }}
                                color="rgb(250, 149, 17)"
                                size="30px"
                                aria-label="Search images" />
                        </span>
                    </button>
                </form>
                {films && (
                    <div className={s.filmCards}>
                        <ul className={s.filmCardsList}>
                            {films.map(({ poster_path, title, id }) => (
                                <li key={id} className={s.filmCardWrap}>
                                    <NavLink className={s.filmCardLink}
                                        to={{
                                            pathname: `${url}/${id}`,
                                            state: {
                                                from: location,
                                            },
                                        }}
                                    >
                
                                        <img src={poster_path ? `${srcBaseUrl}${poster_path}` : notImage} alt={title} className={s.filmCardPoster} />
                                        <h3 className={s.filmCardTitle}>{title.slice(0, 35)}</h3>
                
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                        {films.length > 19 && (
                            <Button onClick={changePage} />
                        )}
                    </div>
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