/// Description:
//  Main component which is rendered to the DOM
//  This component acts as a router for the other components with the help of react router dom 

//// Imports ////
/// Packages 
// react-router-dom - Allows rendering of components for different urls 
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';

/// bootsrap ///
// There is a container within the main body to make is easier for page layouts, 
// The main body page size is set in index.css 
// Container - React bootsrap container which uses grid system, see https://react-bootstrap.github.io/layout/grid/
import {Container} from 'react-bootstrap';

/// Screens ///
// Screens are particular view for given subdomain in the site 
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import ProfileScreen from './screens/ProfileScreen';
import RegisterScreen from './screens/RegisterScreen';
import NoMatchScreen from './screens/NoMatchScreen';
import MovieScreen from './screens/MovieScreen';

/// Components ///
import Header from './components/Header';
import Footer from './components/Footer';

/// App ///
// Description:
//  Main component, the main function of it is to render the router to allow navigation around the site
//  using the react-router-dom library.
function App() {
  return (
    <Router> 
        <Header/>
        <main>
          <Container>
            <Routes>
              <Route path="/" element={<HomeScreen/>}/>
              <Route path="/login" element={<LoginScreen/>}/>
              <Route path="/register" element={<RegisterScreen/>}/>
              <Route path="/profile" element={<ProfileScreen/>}/>
              <Route path="/movie/:id" element={<MovieScreen/>}/>
              <Route path="*" element={<NoMatchScreen/>}/>
            </Routes>
          </Container>
        </main>
        <Footer />
    </Router>
  );
}

export default App;
