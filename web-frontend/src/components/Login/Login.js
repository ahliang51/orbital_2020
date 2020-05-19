import React, { Component, } from "react";
import {
  InputGroup,
  Button,
  Form,
} from "react-bootstrap";
import "./Login.scss";
import { FaEnvelope, FaLock, FaFacebook, FaGoogle } from "react-icons/fa";
import { Link } from "react-router-dom";
import Logo from "../Logo/Logo";
import Grid from "antd/lib/card/Grid";
import { Row, Col, Divider, notification } from 'antd'
import { withRouter, } from "react-router";
import { backendUrl } from '../../global-variables';
import axios from 'axios';
import { connect } from 'react-redux'
import * as authActionTypes from '../../store/actions/authActions'
import * as globalActionTypes from '../../store/actions/globalActions'
class Login extends Component {

  state = { validated: false, setValidated: false }

  componentDidMount(props) {
    if (this.props.location.state && this.props.location.state.message) {
      notification.error({
        message: 'Error',
        description: this.props.location.state.message,
        placement: 'bottomRight'
      });
    }
  }

  render() {

    let handleSubmit = (event) => {
      this.props.toggleLoading();
      event.preventDefault();
      event.stopPropagation();
      const form = event.currentTarget;
      this.setState({
        setValidated: true, validated: true
      })

      console.log(form.elements.email.value)

      axios.post(backendUrl + '/auth/login', {
        email: form.elements.email.value,
        password: form.elements.password.value
      }).then((response) => {
        console.log(response)
        if (response.data.success) {
          localStorage.setItem('token', response.data.token)
          this.props.saveToken(response.data.token);
          notification.success({
            message: 'Success',
            description: "You have logged in!",
            placement: 'bottomRight'
          });
          this.props.history.push("/home");
        } else {
          notification.error({
            message: 'Error',
            description: response.data.message,
            placement: 'bottomRight'
          });
        }
        this.props.toggleLoading();
      })
    };

    return (
      <div className="Login" >
        <Grid>
          <Row>
            <Col xs={6}></Col>
            <Col xs={12}>
              <Logo></Logo>
              <Divider></Divider>
              <Form className="user-input" noValidate validated={this.state.validated} onSubmit={handleSubmit}>
                <Form.Row>
                  <Form.Group as={Col} controlId="email">
                    <InputGroup>
                      <InputGroup.Prepend>
                        <InputGroup.Text id="basic-addon1">
                          <FaEnvelope></FaEnvelope>
                        </InputGroup.Text>
                      </InputGroup.Prepend>
                      <Form.Control
                        type="email"
                        placeholder="Email"
                        aria-describedby="inputGroupPrepend"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please choose a email.
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Form.Group as={Col} controlId="password">
                    <InputGroup>
                      <InputGroup.Prepend>
                        <InputGroup.Text id="basic-addon1">
                          <FaLock></FaLock>
                        </InputGroup.Text>
                      </InputGroup.Prepend>
                      <Form.Control
                        type="password"
                        placeholder="Password"
                        aria-describedby="inputGroupPrepend"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter a your password.
                       </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <div className="login-btn">
                    <Button type="submit">Login</Button>
                  </div>
                </Form.Row>

              </Form>
              <Divider />
              <div className="social-media-container">
                <div className="facebook-container">
                  <a href={backendUrl + "/auth/facebook"} className="social-media-icon">
                    <FaFacebook></FaFacebook>
                  &nbsp; Continue with Facebook
                 </a>
                </div>


                <div className="google-container">
                  <a href={backendUrl + "/auth/google"} className="social-media-icon">
                    <FaGoogle></FaGoogle>
                  &nbsp; Continue with Google
                 </a>
                </div>
                <Link to={'/register'} className="sign-up"> or Sign up here! </Link>

              </div>
            </Col>
            <Col xs={6}></Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    saveToken: (token) => { dispatch({ type: authActionTypes.SAVE_TOKEN, payload: token }) },
    toggleLoading: () => { dispatch({ type: globalActionTypes.TOGGLE_LOADING }) },
  }
}


export default connect(null, mapDispatchToProps)(withRouter(Login));