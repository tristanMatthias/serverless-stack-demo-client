import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { AuthContainer } from '../../containers/Auth.container';
import { FormSignup } from './Signup.form';
import './Signup.page.css';
import { FormVerify } from './Verify.form';


export default function Signup() {
  const { authenticated } = AuthContainer.useContainer();

  if (authenticated) return <Redirect to="/" />;

  return <div className="Signup">
    <Router basename="/signup">
      <Switch>
        <Route path="/verify" component={FormVerify} />
        <Route path="/" exact component={FormSignup} />
        <Redirect to="/" />
      </Switch>
    </Router>
  </div>;
}
