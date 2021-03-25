import React from 'react';
import { Route } from 'react-router-dom';
import { NavItem, NavItemProps } from 'react-bootstrap';

export interface RouteNavItemProps extends NavItemProps {
  href: string;
}

export const RouteNavItem: React.FC<RouteNavItemProps> = props =>
  <Route
    path={props.href}
    exact
    children={({ match, history }) =>
      <NavItem
        onClick={(e: Event) => history.push((e.currentTarget as HTMLElement).getAttribute('href')!)}
        {...props}
        active={!!match}
      >
        {props.children}
      </NavItem>}
  />;
