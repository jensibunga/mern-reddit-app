import React from 'react';

import axios from 'axios';



class Post extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

      value: this.props.post.text,
      likes: this.props.post.likes,

    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleLike = this.handleLike.bind(this);

  }

  handleSubmit(event) {
    event.preventDefault();
    let _this = this;
    axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/post/${this.props.post._id}/update`, { text: this.state.value })
      .then(function (response) {
        _this.setState({ editting: false })
      })
      .catch(function (error) {
        console.log(error);
      })
  }



  handleChange(event) {
    this.setState({ value: event.target.value })
  }



  handleLike(event) {
    let _this = this;
    axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/post/${this.props.post._id}/like`)
      .then(function (response) {
        _this.setState({ likes: response.data.likes })
        _this.props.refreshTimeline();

        console.log(response)
      })
      .catch(function (error) {
        console.log(error);
      })
  }


  render() {

    //console.log(this.props.post.text);
    return (

      <div>
        <div>
          <h4>Message:</h4>

          <h5 className="test">{this.props.post.text}</h5>

        </div>

        <p>Uploader: {this.props.post.user.firstname} | {this.state.likes && this.state.likes > 0 &&
          this.state.likes} upvotes</p>

        <button onClick={this.handleLike} className="btn btn-success">Upvote</button>

      </div>





    )
  }

}
export default Post;