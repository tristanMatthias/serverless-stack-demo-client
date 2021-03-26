import React, { ExoticComponent, lazy, Suspense } from 'react';
import { Spinner } from 'react-bootstrap';
import { Route, Switch } from 'react-router-dom';
import { AuthenticatedRoute } from './Authenticated.route';
import { UnauthenticatedRoute } from './Unauthenticated.route';

interface IRoute { component: ExoticComponent, auth?: boolean, exact?: boolean }

export const ROUTES: { [path: string]: IRoute } = {
  '/': {
    component: lazy(() => import('../../pages/Home/Home.page'))
  },
  '/login': {
    component: lazy(() => import('../../pages/Login/Login.page')), auth: false
  },
  '/signup': {
    component: lazy(() => import('../../pages/Signup/Signup.page')), auth: false, exact: false
  },
  '/settings': {
    component: lazy(() => import('../../pages/Settings/Settings.page')), auth: true
  },
  '/notes/new': {
    component: lazy(() => import('../../pages/Notes/NewNote.page')), auth: true
  },
  '/notes/:id': {
    component: lazy(() => import('../../pages/Notes/Notes.page')), auth: true
  },
  '*': {
    component: lazy(() => import('../../pages/NotFound/NotFound.page'))
  }
};

export const Routes: React.FC = () => <Suspense fallback={<Spinner animation="border" />}>
  <Switch>
    {Object.entries(ROUTES).map(([path, r]) => {
      const props = { key: path, path, exact: r.exact ?? true, component: r.component };
      switch (r.auth) {
        case true: return <AuthenticatedRoute {...props} />;
        case false: return <UnauthenticatedRoute {...props} />;
        default: return <Route {...props} />;
      }
    })}
  </Switch>
</Suspense>;
