import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { AuthContainer } from '../../containers/Auth.container';

export const querystring = (name: string, url = window.location.href) => {
  const n = name.replace(/[[]]/g, '\\$&');

  const regex = new RegExp(`[?&]${n}(=([^&#]*)|&|#|$)`, 'i');
  const results = regex.exec(url);

  if (!results) return null;
  if (!results[2]) return '';

  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};


export const UnauthenticatedRoute: React.FC<RouteProps> = ({ children, ...rest }) => {
  const { authenticated } = AuthContainer.useContainer();
  const redirect = querystring('redirect');

  return <Route {...rest}>
    {!authenticated
      ? children
      : <Redirect to={redirect === '' || redirect === null ? '/' : redirect} />
    }
  </Route>;
};
