import React, { Component } from 'react'
import Register from './Register';
import Login from './Login';

class Home extends Component {
  render() {
    return (
      <div className="p-4">
        <div className="container">
          <h2> Howdy, welcome to Reddit!</h2>

          <div className="row">

            <Register />
            <Login />
          </div>
        </div>

      </div>
    )
  }
}

export default Home;