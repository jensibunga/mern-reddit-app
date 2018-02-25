import React from 'react';
import axios from 'axios';

import PostForm from './PostForm';
import PostList from './PostList';
import { Redirect } from 'react-router-dom';
import Nav from './Nav';



class Timeline extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      posts: null,
      user: null,
      loading: true,

    }

    this.handlePostFormSubmit = this.handlePostFormSubmit.bind(this);
    this.refreshTimeline = this.refreshTimeline.bind(this);
     this.handleLogOut=  this.handleLogOut.bind(this);
  }

  handlePostFormSubmit() {
    this.getPostsFromExpress();
  }

  refreshTimeline() {
    this.getPostsFromExpress();
  }

  getPostsFromExpress() {
    let _this = this;
    axios.get(`${ process.env.REACT_APP_BACKEND_URL }/api/posts`)
      .then(function (response) {
        
        _this.setState({ posts: response.data }) 
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  componentDidMount() {
    this.getPostsFromExpress();

    let _this = this;

    axios.get(`${ process.env.REACT_APP_BACKEND_URL }/api/current_user`)
      .then(function (response) {
        if (response.data.error) {
          _this.setState({ loading: false })
        } else {
          _this.setState({ user: response.data, loading: false })
         
        }
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  handleLogOut(){
    let _this= this;
    axios.get(`${process.env.REACT_APP_BACKEND_URL }/api/logout`)
    .then(function (response){
      _this.setState({user : null})
      
    })
    .catch(function (error){
      console.log(error);
    })
  }

  render() {
    if (this.state.loading) { 
      return <p>Loading your user information, please be patient</p>
    } else if (!this.state.user) { 
      return <Redirect to="/" />
    } else { 
      return (

        <div className="p-4">
          <Nav logOut={this.handleLogOut}/>
          
          <div className="container p-5">
            
            {this.state.user && this.state.user.firstname &&
              <h6>Welcome, {this.state.user.firstname}</h6>}

            <PostForm formHasBeenSubmittedAndSavedInDatabase={this.handlePostFormSubmit} 
                      refreshTimeline={this.refreshTimeline} 
                      user={this.state.user}/>
            <PostList posts={this.state.posts} 
                      refreshTimeline={this.refreshTimeline} 
                      user={this.state.user}/>
          </div>
        </div>
      )
    }
  }
}

export default Timeline;