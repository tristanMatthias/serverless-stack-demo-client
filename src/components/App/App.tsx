import { Auth } from 'aws-amplify';
import React, { useEffect, useState } from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { LinkContainer } from 'react-router-bootstrap';
import { useHistory } from 'react-router-dom';
import './App.css';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import { AppContext } from '../../libs/contextLib';
import { onError } from '../../libs/errorLib';
import { Routes } from '../Routes/Routes';

export const App = () => {
  const history = useHistory();
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, userHasAuthenticated] = useState<boolean>(false);

  const onLoad = async () => {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
    } catch (e) {
      if (e !== 'No current user') {
        onError(e);
      }
    }

    setIsAuthenticating(false);
  };

  useEffect(() => { onLoad(); }, []);


  async function handleLogout() {
    await Auth.signOut();

    userHasAuthenticated(false);

    history.push('/login');
  }

  if (isAuthenticating) return null;

  return <div className="App container py-3">
    <Navbar collapseOnSelect bg="light" expand="md" className="mb-3">
      <LinkContainer to="/">
        <Navbar.Brand className="font-weight-bold text-muted">
          Scratch
        </Navbar.Brand>
      </LinkContainer>
      <Navbar.Toggle />
      <Navbar.Collapse className="justify-content-end">
        <Nav activeKey={window.location.pathname}>
          {isAuthenticated ? (
            <>
              <LinkContainer to="/settings">
                <Nav.Link>Settings</Nav.Link>
              </LinkContainer>
              <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
            </>
          ) : (
            <>
              <LinkContainer to="/signup">
                <Nav.Link>Signup</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/login">
                <Nav.Link>Login</Nav.Link>
              </LinkContainer>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
    <ErrorBoundary>
      <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated }}>
        <Routes />
      </AppContext.Provider>
    </ErrorBoundary>
  </div>;
};
