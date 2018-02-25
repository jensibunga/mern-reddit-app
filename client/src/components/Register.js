import React from 'react';
import axios from 'axios';

class Register extends React.Component {


  constructor(props) {
    super(props);

    this.state = {
      username: '',
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      birthdate: '',

      errors: null,

      registrationCompleted: false,
      
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(event) {
    event.preventDefault();
    let _this = this;
    axios.post(`${ process.env.REACT_APP_BACKEND_URL }/api/register`, {
      
      firstname: this.state.firstname,
      lastname:this.state.lastname,
      email: this.state.email,
      password:this.state.password,
      passwordConfirmation: this.state.passwordConfirmation,
     
    })
      .then(function (response) {
        console.log(response);
        if(response.data.errors){

        
        _this.setState({errors: response.data.errors})

        }else {
          _this.setState({registrationCompleted: true})
        }
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });

  }


  render() {

    return (
        <div className="col-md">
          {this.state.registrationCompleted
            ?
            <div>
              <p>Thank you for signing up.</p>
              <p>Please login...</p>
            </div>
            :
            <div>
            <form onSubmit={this.handleSubmit}>

             
              <h5> Register</h5>

              <div className="form-group">
               
                <input type="text" className="form-control" id="register-firstname" onChange={this.handleInputChange} value={this.state.firstname} name="firstname" placeholder="First Name" />
                {this.state.errors && this.state.errors.firstname && 
                  <p className="text-danger">
                  {this.state.errors.firstname.msg}</p>}
              </div>

              <div className="form-group">
               
                <input type="text" className="form-control" id="register-lastname" onChange={this.handleInputChange} value={this.state.lastname} name="lastname" placeholder="Last Name" />
                {this.state.errors && this.state.errors.lastname &&
                  <p className="text-danger">{this.state.errors.lastname.msg}</p>}
              </div>


              <div className="form-group">
               
                <input type="email" className="form-control" id="register-email" onChange={this.handleInputChange} value={this.state.email} name="email" placeholder="Enter email" />
                {this.state.errors && this.state.errors.email &&
                  <p className="text-danger">{this.state.errors.email.msg}</p>}
              </div>

              <div className="form-group">
               
                <input type="password" className="form-control" id="register-password" onChange={this.handleInputChange} value={this.state.password} name="password" placeholder="Password" />
                {this.state.errors && this.state.errors.password &&
                
                  <p className="text-danger">{this.state.errors.password.msg}</p>}
              </div>

              <div className="form-group">
              
                <input type="password" className="form-control" id="register-password-confirmation" onChange={this.handleInputChange} value={this.state.passwordConfirmation} name="passwordConfirmation" placeholder="Password" />
                {this.state.errors && this.state.errors.passwordConfirmation &&

                  <p className="text-danger">{this.state.errors.passwordConfirmation.msg}</p>}
              </div>

              
              <button type="submit" className="btn btn-primary">Register</button>
            </form>
        </div>}
        </div>

    )
  }
}

export default Register;