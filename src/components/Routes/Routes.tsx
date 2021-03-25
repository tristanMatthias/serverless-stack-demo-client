import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from '../../pages/Home/Home.page';
import Login from '../../pages/Login/Login.page';
import Notes from '../../pages/Notes/Notes.page';
import Signup from '../../pages/Signup/Signup.page';
import { NewNote } from '../../pages/Notes/NewNote.page';
import Settings from '../../pages/Settings/Settings.page';
import NotFound from '../../pages/NotFound/NotFound.page';
import { AuthenticatedRoute } from './Authenticated.route';
import { UnauthenticatedRoute } from './Unauthenticated.route';

interface IRoute { component: JSX.Element, auth?: boolean }

export const ROUTES: { [path: string]: IRoute } = {
  '/': { component: <Home /> },
  '/login': { component: <Login />, auth: false },
  '/signup': { component: <Signup />, auth: false },
  '/settings': { component: <Settings />, auth: true },
  '/notes/new': { component: <NewNote />, auth: true },
  '/notes/:id': { component: <Notes />, auth: true },
  '*': { component: <NotFound /> }
};

export const Routes: React.FC = () => <Switch>
  {Object.entries(ROUTES).map(([path, r]) => {
    switch (r.auth) {
      case true:
        return <AuthenticatedRoute exact path={path}> {r.component} </AuthenticatedRoute>;

      case false:
        return <UnauthenticatedRoute exact path={path}> {r.component} </UnauthenticatedRoute>;

      default:
        return <Route exact path={path}> {r.component} </Route>;
    }
  })}
</Switch>;
