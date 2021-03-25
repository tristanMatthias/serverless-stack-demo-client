import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { useAppContext } from '../../libs/contextLib';

export const querystring = (name: string, url = window.location.href) => {
  const n = name.replace(/[[]]/g, '\\$&');

  const regex = new RegExp(`[?&]${n}(=([^&#]*)|&|#|$)`, 'i');
  const results = regex.exec(url);

  if (!results) return null;
  if (!results[2]) return '';

  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};


export const UnauthenticatedRoute: React.FC<RouteProps> = ({ children, ...rest }) => {
  const { isAuthenticated } = useAppContext();
  const redirect = querystring('redirect');

  return <Route {...rest}>
    {!isAuthenticated
      ? children
      : <Redirect to={redirect === '' || redirect === null ? '/' : redirect} />
    }
  </Route>;
};
