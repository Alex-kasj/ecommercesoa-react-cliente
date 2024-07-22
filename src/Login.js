import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import Reclamaciones from './Reclamaciones';

const loginUrl = "https://gregarious-victory-production.up.railway.app/api/login";
const registerUrl = "https://gregarious-victory-production.up.railway.app/api/register";

class Login extends Component {
  state = {
    form: {
      email: '',
      password: '',
      name: '',
      address: '',
      phone: '',
      password_confirmation: ''
    },
    modalRegister: false,
    loggedIn: false,
    userId: null,
    errorMessage: ''
  }

  handleChange = e => {
    const { name, value } = e.target;
    this.setState(prevState => ({
      form: {
        ...prevState.form,
        [name]: value
      }
    }));
  }

  handleLogin = async e => {
    e.preventDefault();
    const { email, password } = this.state.form;
    try {
      const response = await axios.post(loginUrl, { email, password });
  
      // Imprime la respuesta completa de la API
      console.log('API Response:', response.data);
  
      // Asegúrate de que la respuesta contiene el token y el userId
      const { token, userId } = response.data;
  
      // Verifica que token y userId no sean undefined
      console.log('Token:', token);
      console.log('UserId:', userId);
  
      // Guarda token y userId en localStorage si están definidos
      if (token) {
        localStorage.setItem('token', token);
      } else {
        console.error('Token is undefined');
      }
  
      if (userId) {
        localStorage.setItem('userId', userId);
      } else {
        console.error('UserId is undefined');
      }
  
      this.setState({ loggedIn: true, errorMessage: '' });
    } catch (error) {
      console.error('Login Error:', error.message);
      this.setState({ errorMessage: 'Invalid credentials. Please try again.' });
    }
  }
  
  

  handleRegister = async e => {
    e.preventDefault();
    const { name, email, address, phone, password, password_confirmation } = this.state.form;
    if (password !== password_confirmation) {
      this.setState({ errorMessage: 'Passwords do not match.' });
      return;
    }
    try {
      await axios.post(registerUrl, { name, email, address, phone, password, password_confirmation });
      this.toggleModalRegister();
      this.setState({ errorMessage: '' });
    } catch (error) {
      console.log(error.message);
      this.setState({ errorMessage: 'Registration failed. Please try again.' });
    }
  }

  toggleModalRegister = () => {
    this.setState({ modalRegister: !this.state.modalRegister });
  }

  render() {
    const { form, loggedIn, modalRegister, errorMessage } = this.state;

    if (loggedIn) {
      return <Reclamaciones />;
    }

    return (
      <div className="container login-container">
        <div className="row justify-content-center">
          <div className="col-md-20">
            <div className="card login-form ">
              <div className="card-body">
                <h3 className="card-title text-center mb-4">Login</h3>
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                <form onSubmit={this.handleLogin}>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" className="form-control" id="email" name="email" value={form.email} onChange={this.handleChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" className="form-control" id="password" name="password" value={form.password} onChange={this.handleChange} required />
                  </div>
                  <div className="text-center">
                    <button type="submit" className="btn btn-primary btn-block">Login</button>
                  </div>
                </form>
                <p className="mt-3 text-center">Don't have an account? <button className="btn btn-link" onClick={this.toggleModalRegister}>Register</button></p>
              </div>
            </div>
          </div>
        </div>

        <Modal isOpen={modalRegister} toggle={this.toggleModalRegister}>
          <ModalHeader toggle={this.toggleModalRegister}>Register</ModalHeader>
          <ModalBody>
            <form onSubmit={this.handleRegister}>
              <div className="card register-form">
                <div className="card-body">
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" className="form-control" id="name" name="name" value={form.name} onChange={this.handleChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" className="form-control" id="email" name="email" value={form.email} onChange={this.handleChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <input type="text" className="form-control" id="address" name="address" value={form.address} onChange={this.handleChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input type="text" className="form-control" id="phone" name="phone" value={form.phone} onChange={this.handleChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" className="form-control" id="password" name="password" value={form.password} onChange={this.handleChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password_confirmation">Confirm Password</label>
                    <input type="password" className="form-control" id="password_confirmation" name="password_confirmation" value={form.password_confirmation} onChange={this.handleChange} required />
                  </div>
                  <div className="text-center">
                    <button type="submit" className="btn btn-primary btn-block">Register</button>
                  </div>
                </div>
              </div>
            </form>
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-secondary" onClick={this.toggleModalRegister}>Cancel</button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default Login;






