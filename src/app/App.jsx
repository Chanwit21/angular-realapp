import React, { useState, useEffect, createContext } from 'react';
import Main from '../components/layout/Main';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import Footer from '../components/layout/Footer';
import './App.css';
import LoadingIndicator from '../components/common/LoadingIndicator';
import Login from '../pages/user/login/Login';
import { Route, Switch } from 'react-router';
import { BrowserRouter as Router } from 'react-router-dom';
import Home from '../pages/home/Home';
import AppHeader from '../components/common/AppHeader';
import { toast, ToastContainer } from 'react-toastify';
import OAuth2RedirectHandler from '../pages/user/oauth2/OAuth2RedirectHandler';
import NotFound from '../pages/notfound/NotFound';
import Signup from '../pages/user/signup/Signup';
import { getCurrentUser, getMenu, removeCurrentUser } from '../util/APIUtils';
import { userContext } from '../util/userContext';

function App(props) {
  const [authenticated, setAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    loadCurrentlyLoggedInUser();
    if (currentUser) {
      console.log('userfound');
      setAuthenticated(true);
    }
    return () => {
      console.log('cleanup');
    };
  }, []);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
    console.log('toggle show sidebar');
  };

  const loadCurrentlyLoggedInUser = () => {
    setLoading(true);
    getCurrentUser()
      .then((response) => {
        setCurrentUser(response);
        setAuthenticated(true);
        setLoading(false);
      })
      .catch((error) => {
        removeCurrentUser();
        setLoading(false);
      });
  };

  const handleLogout = (params) => {
    //localStorage.removeItem(ACCESS_TOKEN);
    removeCurrentUser();
    setAuthenticated(false);
    setCurrentUser(null);
    setShowSidebar(false);

    //Alert.success("You're safely logged out!");
    toast("You're safely logged out!");
  };

  if (loading) {
    return <LoadingIndicator />;
  } else {
    if (authenticated) {
      const ctxValue = {
        user: currentUser,
        doLogout: handleLogout,
        sidebarData: getMenu(currentUser),
      };
      return (
        <div className="wrapper">
          <Router>
            <userContext.Provider value={ctxValue}>
              <Sidebar companyName="Go Go" showSidebar={showSidebar} toggleSidebar={toggleSidebar} onLogout={handleLogout} />
              <div className="content-wrapper">
                <Navbar {...props} showSidebar={showSidebar} toggleSidebar={toggleSidebar} />
                <Main />
                <Footer />
              </div>
            </userContext.Provider>

            <ToastContainer autoClose={3000} pauseOnHover />
          </Router>
        </div>
      );
    } else {
      return (
        <Router>
          <div className="app">
            <div className="app-top-box">
              <AppHeader {...props} onLogout={handleLogout} />
            </div>
            <div className="app-body">
              <Switch>
                <Route exact path="/" component={Home}></Route>
                <Route path="/login" render={(props) => <Login {...props} handleLoginSuccess={loadCurrentlyLoggedInUser} />}></Route>
                <Route path="/signup" render={(props) => <Signup authenticated={authenticated} {...props} />}></Route>
                <Route path="/oauth2/redirect" component={OAuth2RedirectHandler}></Route>
                <Route component={NotFound}></Route>
              </Switch>
            </div>
            <ToastContainer autoClose={3000} pauseOnHover />
          </div>
        </Router>
      );
    }
  }
}

export default App;
