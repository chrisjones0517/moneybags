import React, { Component } from "react";
import Avatar from "../Avatar";
import { Redirect } from "react-router-dom";
import Decode from "../../helpers/Decode";
import {
  AvForm,
  AvGroup,
  AvInput,
  AvFeedback
} from "availity-reactstrap-validation";
import {
  Button,
  Label
} from "reactstrap";

const decode = new Decode();
class Login extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      referrerRedirect: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }
  handleSubmit(e) {
    e.preventDefault();

    fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password
      })
    })
      .then(data => data.json())
      .then(res => {
        if (typeof res.user === "undefined") {
          let errors = {
            invalid: "Login invalid"
          };
          throw console.log(errors.invalid);
        } else {
          localStorage.setItem("isAuthenticated", true);
          const { token } = res;
          // Set token to auth header
          decode.setToken(token);
          // Decode token to get user data
          const profile = decode.getProfile(token);
          // Set current user
          localStorage.setItem("user_id", profile.id);
          localStorage.setItem("user_email", profile.email);

          window.location.reload();

          profile
            ? this.setState(() => ({ referrerRedirect: true }))
            : console.log("YOU GOT THE $%#%$% WRONG");
        }
      })
      .catch(errors => {
        console.log(`Login error: ${errors}`);
      });
  }
  render() {
    const { from } = {
      from: { pathname: "/dashboard" }
    };
    const { referrerRedirect } = this.state;
    if (referrerRedirect) return <Redirect to={from} />;
    return (
      <div id="login">
        <div className="LoginForm">
          <AvForm className="form-horizontal" onSubmit={this.handleSubmit}>
            <Avatar />
            <AvGroup
              className="col-3 col-mr-auto"
              style={{
                paddingTop: "10px"
              }}
            >
              <Label for="email">Email:</Label>
              <AvInput
                id="email"
                name="email"
                onChange={this.handleInputChange}
                onKeyPress={this.handleKeyPress}
                placeholder="noreply@moneyBAGS.com"
                required
                type="email"
                value={this.state.email}
                onChange={this.handleChange}
              />
              <AvFeedback>Invalid</AvFeedback>
            </AvGroup>
            <AvGroup className="col-3 col-mr-auto">
              <Label for="password">Password:</Label>
              <AvInput
                id="password"
                minLength="8"
                name="password"
                onKeyPress={this.handleKeyPress}
                placeholder="Password"
                required
                type="password"
                value={this.state.password}
                onChange={this.handleChange}
              />

              <AvFeedback>Invalid</AvFeedback>
            </AvGroup>
            <Button className="btn btn-primary col-mr-auto" type="submit">
              Login
            </Button>
          </AvForm>
        </div>
      </div>
    );
  }
}
export default Login;
