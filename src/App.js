//import './App.css';
import { Switch, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Container from './components/Container/Container';
import AppBar from './components/AppBar/AppBar';
import HomePage from './views/HomePage/HomePage';
import MoviesPage from './views/MoviesPage/MoviesPage';
import MovieDetailsPage from './views/MovieDetailsPage/MovieDetailsPage';

function App() {
  return (
    <Container>
      <AppBar />
       <Switch>
        <Route path="/" exact>
          <HomePage />
        </Route>

        <Route path="/movies">
          <MoviesPage />
        </Route>

        <Route path="/movies/:movieId" exact>
          <MovieDetailsPage />
        </Route>

        {/* <Route path="/books/:bookId">
          <BookDetailsView />
        </Route> */}

        <Route>
          <HomePage />
        </Route>
      </Switch>

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
  );
}

export default App;
