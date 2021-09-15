//import './App.css';
import { lazy, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Container from './components/Container/Container';
import AppBar from './components/AppBar/AppBar';
import PendingView from './views/PendingView/PendingView';

const HomePage = lazy(() => import('./views/HomePage/HomePage' /* webpackChunkName: "home-page" */));
const MoviesPage = lazy(() => import('./views/MoviesPage/MoviesPage' /* webpackChunkName: "movie-page" */));
const MovieDetailsPage = lazy(() => import('./views/MovieDetailsPage/MovieDetailsPage' /* webpackChunkName: "movie-details-page" */));

function App() {
  return (
    <>
    <AppBar />
      <Container>
        
      <Suspense fallback={<PendingView />}>
      <Switch>
        <Route path="/" exact>
          <HomePage />
        </Route>

        <Route path="/movies" exact>
          <MoviesPage />
        </Route>

        <Route path="/movies/:movieId">
          <MovieDetailsPage />
        </Route>

        <Route>
          <HomePage />
        </Route>
      </Switch>
      </Suspense>
       <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          />
      
      </Container>
      </>
  );
}

export default App;
