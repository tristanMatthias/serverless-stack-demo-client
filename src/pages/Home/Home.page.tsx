import React from 'react';
import { Spinner } from 'react-bootstrap';
import { NotesList } from '../../components/NotesList/NotesList';
import { AuthContainer } from '../../containers/Auth.container';
import './Home.page.css';
import { Landing } from './Landing';

export default function Home() {
  const { authenticated, isAuthenticating } = AuthContainer.useContainer();

  if (isAuthenticating) return <Spinner animation="border" />;

  return <div className="Home">
    {authenticated
      ? <NotesList />
      : <Landing />
    }
  </div>;

}
