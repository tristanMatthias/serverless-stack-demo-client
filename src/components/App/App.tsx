import React, { useEffect } from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { LinkContainer } from 'react-router-bootstrap';
import { AuthContainer } from '../../containers/Auth.container';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import { Routes } from '../Routes/Routes';
import './App.css';

export const App = () => {

  const {
    authenticated,
    isAuthenticating,
    loadSession,
    signOut
  } = AuthContainer.useContainer();


  useEffect(() => { loadSession(); }, []);
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
          {authenticated ? (
            <>
              <LinkContainer to="/settings">
                <Nav.Link>Settings</Nav.Link>
              </LinkContainer>
              <Nav.Link onClick={signOut}>Logout</Nav.Link>
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
      <Routes />
    </ErrorBoundary>

  </div>;
};
