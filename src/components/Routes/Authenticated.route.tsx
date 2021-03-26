import React from 'react';
import { Redirect, Route, RouteProps, useLocation } from 'react-router-dom';
import { AuthContainer } from '../../containers/Auth.container';

export const AuthenticatedRoute: React.FC<RouteProps> = ({ children, ...rest }) => {
  const { pathname, search } = useLocation();
  const { authenticated } = AuthContainer.useContainer();

  return <Route {...rest}>
    {authenticated
      ? children
      : <Redirect to={`/login?redirect=${pathname}${search}`} />
    }
  </Route>;
};
