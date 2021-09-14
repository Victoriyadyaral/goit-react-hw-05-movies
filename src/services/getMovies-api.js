const API_KEY = '4066382581cfb979e447ac972cd0fc85';
const BASE_URL = 'https://api.themoviedb.org/3/';
const MEDIA_TYPE = 'movie';
const LANGUAGE = 'en';

function getPopularMovies( page=1) {

  const url = `${BASE_URL}trending/movie/day?api_key=${API_KEY}&page=${page}&language=${LANGUAGE}`;

  return fetch(url).then(response => {
    if (response.ok) {
      return response.json();
    }

    return Promise.reject(new Error("No response from server"));
  });
};

function getFilmByRequest(requestTerm, page) {
  requestTerm = requestTerm.trim();
  const url = `${BASE_URL}search/${MEDIA_TYPE}?api_key=${API_KEY}&query=${requestTerm}&page=${page}&language=${LANGUAGE}`;
  if (!requestTerm) { return };

  return fetch(url).then(response => {
    if (response.ok) {
      return response.json();
    }

    return Promise.reject(new Error(`No results on request ${requestTerm}`));
  });
};

function getFilmInfoById(id) {
  const url = `${BASE_URL}${MEDIA_TYPE}/${id}?api_key=${API_KEY}&language=${LANGUAGE}`;
  if(!id){return}
    return fetch(url)
           .then(response => {
             if (response.ok) return response.json();
               throw new Error("No response from server");
            })
           .catch((err) => {
                //notification.fetchError();
            });
};

function getMovieCast(id) {
  const url = `${BASE_URL}${MEDIA_TYPE}/${id}/credits?api_key=${API_KEY}&language=${LANGUAGE}`;
  if(!id){return}
    return fetch(url)
           .then(response => {
             if (response.ok) return response.json();
               throw new Error("No response from server");
            })
           .catch((err) => {
                //notification.fetchError();
            });
};

function getMovieReviews(id) {
  const url = `${BASE_URL}${MEDIA_TYPE}/${id}/reviews?api_key=${API_KEY}&language=${LANGUAGE}`;
  if(!id){return}
    return fetch(url)
           .then(response => {
             if (response.ok) return response.json();
               throw new Error("No response from server");
            })
           .catch((err) => {
                //notification.fetchError();
            });
};

const getMovieAPI = {
  getPopularMovies,
  getFilmByRequest,
  getFilmInfoById,
  getMovieCast,
  getMovieReviews,
};

export default getMovieAPI;