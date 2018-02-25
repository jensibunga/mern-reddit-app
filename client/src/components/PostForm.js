import React from 'react';
import axios from 'axios';

class PostForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      postMessage: "",

      errors: null,
    }
    this.handlePostMessage = this.handlePostMessage.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handlePostMessage(event) {

    this.setState({
      postMessage: event.target.value,
    })
  }

  handleSubmit(event) {
    let _this = this;
    event.preventDefault();
    axios.post(`${ process.env.REACT_APP_BACKEND_URL }/api/post`, {
      postMessage: this.state.postMessage,
      userId: this.props.user._id

    })

      .then(function (response) {
        console.log(response);
        if (response.data.errors) {
          _this.setState({ errors: response.data.errors })

        } else {
          _this.setState({
            postMessage: "",
            errors: null
        })
        _this.props.refreshTimeline();
        }
      })
      .catch(function(error) {
    console.log(error);
  })

}

render() {
  return (

    <div className="p-4">
      <form onSubmit={this.handleSubmit} className="clearfix">

        <div className="form-group">
          <label htmlFor="exampleFormControlTextarea1">Post on Reddit</label>
          <textarea onChange={this.handlePostMessage} value={this.state.postMessage} className="form-control" id="exampleFormControlTextarea1" rows={3} />
          {this.state.errors && this.state.errors.postMessage &&

            <p className="text-danger">{this.state.errors.postMessage.msg}</p>}

        </div>
        <button type="submit" className="btn btn-primary float-right">Post</button>

      </form>
    </div>

  )
}
}

export default PostForm;