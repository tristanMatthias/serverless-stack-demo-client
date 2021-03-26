import React from 'react';
import { Link } from 'react-router-dom';

export const Landing = () => <div className="lander">
  <h1>Scratch</h1>
  <p className="text-muted">A simple note taking app</p>
  <div className="pt-3">
    <Link to="/login" className="btn btn-info btn-lg mr-3">
      Login
    </Link>
    <Link to="/signup" className="btn btn-success btn-lg">
      Signup
    </Link>
  </div>
</div>;
