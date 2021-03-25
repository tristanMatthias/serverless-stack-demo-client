import React, { JSXElementConstructor } from 'react';
import { Route, RouteProps } from 'react-router-dom';

export type AppliedRouteProps<T extends JSXElementConstructor<any>> = RouteProps & {
  component: T
  appProps: React.ComponentProps<T>
}

export const AppliedRoute: React.FC<AppliedRouteProps<any>> = ({
  component: C,
  appProps,
  ...routeProps
}) =>
  <Route {...routeProps} render={props => <C {...props} {...appProps} />} />;
