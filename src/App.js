import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import './index.css';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Reclamaciones from './Reclamaciones';

const url = "http://127.0.0.1:8000/api/productos";

class App extends Component {
  state = {
    data: [],
    modalInsertar: false,
    modalEliminar: false,
    form: {
      id: '',
      nombre: '',
      descripcion: '',
      image_path: '',
      precio: '',
      stock: '',
      tipoModal: ''
    },
    currentPage: 1,
    itemsPerPage: 6
  };

  peticionGet = () => {
    axios.get(url).then(response => {
      this.setState({ data: response.data });
    }).catch(error => {
      console.log(error.message);
    });
  }

  peticionPost = async () => {
    delete this.state.form.id;
    await axios.post(url, this.state.form).then(reponse => {
      this.modalInsertar();
      this.peticionGet();
    }).catch(error => {
      console.log(error.message);
    });
  }

  peticionPut = () => {
    axios.put(url + "/" + this.state.form.id, this.state.form).then(response => {
      this.modalInsertar();
      this.peticionGet();
    }).catch(error => {
      console.log(error.message);
    });
  }

  peticionDelete = () => {
    axios.delete(url + "/" + this.state.form.id).then(response => {
      this.setState({ modalEliminar: false });
      this.peticionGet();
    }).catch(error => {
      console.log(error.message);
    });
  }

  modalInsertar = () => {
    this.setState({ modalInsertar: !this.state.modalInsertar });
  }

  seleccionarProducto = (producto) => {
    this.setState({
      tipoModal: 'actualizar',
      form: {
        id: producto.id,
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        image_path: producto.image_path,
        precio: producto.precio,
        stock: producto.stock
      }
    });
  }

  handleChange = async e => {
    e.persist();
    await this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value
      }
    });
    console.log(this.state.form);
  }

  componentDidMount() {
    this.peticionGet();
  }

  handlePageChange = (event, pageNumber) => {
    event.preventDefault();
    this.setState({ currentPage: pageNumber });
  }

  render() {
    const { form, data, currentPage, itemsPerPage } = this.state;

    // Filtra los datos para la página actual
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentData = data.slice(indexOfFirstItem, indexOfLastItem);

    // Calcular el número total de páginas
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(data.length / itemsPerPage); i++) {
      pageNumbers.push(i);
    }

    return (
      <Router>
        <div className="App">
          <div className="sidebar">
            <h2>Menú</h2>
            <ul>
              <li><Link to="/">INICIO</Link></li>
              <li><Link to="/reclamaciones">RECLAMACIONES</Link></li>
            </ul>
          </div>
          <div className='main-content'>
            <Routes>
              <Route path="/" element={
                <>
                  <br />
                  <button className='btn btn-success' onClick={() => { this.setState({ form: null, tipoModal: 'insertar' }); this.modalInsertar() }}>Agregar Producto</button>
                  <br /><br />
                  <table className='table'>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>NOMBRE</th>
                        <th>DESCRIPCION</th>
                        <th>IMAGEN</th>
                        <th>PRECIO</th>
                        <th>STOCK</th>
                        <th>ACCIONES</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentData.map(producto => {
                        return (
                          <tr key={producto.id}>
                            <td>{producto.id}</td>
                            <td>{producto.nombre}</td>
                            <td>{producto.descripcion}</td>
                            <td>{producto.image_path}</td>
                            <td>{producto.precio}</td>
                            <td>{producto.stock}</td>
                            <td>
                              <button className='btn btn-primary' onClick={() => { this.seleccionarProducto(producto); this.modalInsertar() }}><FontAwesomeIcon icon={faEdit} /></button>
                              {" "}
                              <button className='btn btn-danger' onClick={() => { this.seleccionarProducto(producto); this.setState({ modalEliminar: true }) }}><FontAwesomeIcon icon={faTrashAlt} /></button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>

                  <nav>
                    <ul className='pagination'>
                      {pageNumbers.map(number => (
                        <li key={number} className='page-item'>
                          <a onClick={(e) => this.handlePageChange(e, number)} href='!#' className='page-link'>
                            {number}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>

                  <Modal isOpen={this.state.modalInsertar}>
                    <ModalHeader style={{ display: 'block' }}>
                      <span style={{ float: 'right' }}> X </span>
                    </ModalHeader>
                    <ModalBody>
                      <div className='form-group'>
                        <label htmlFor='id'>ID</label>
                        <input className='form-control' type="text" name="id" id="id" onChange={this.handleChange} value={form ? form.id : this.state.data.length + 2} readOnly />
                        <br />
                        <label htmlFor='nombre'>NOMBRE</label>
                        <input className='form-control' type="text" name="nombre" id="nombre" onChange={this.handleChange} value={form ? form.nombre : ''} />
                        <br />
                        <label htmlFor='descripcion'>DESCRIPCION</label>
                        <input className='form-control' type="text" name="descripcion" id="descripcion" onChange={this.handleChange} value={form ? form.descripcion : ''} />
                        <br />
                        <label htmlFor='image_path'>IMAGEN</label>
                        <input className='form-control' type="text" name="image_path" id="image_path" onChange={this.handleChange} value={form ? form.image_path : ''} />
                        <br />
                        <label htmlFor='precio'>PRECIO</label>
                        <input className='form-control' type="text" name="precio" id="precio" onChange={this.handleChange} value={form ? form.precio : ''} />
                        <br />
                        <label htmlFor='stock'>STOCK</label>
                        <input className='form-control' type="text" name="stock" id="stock" onChange={this.handleChange} value={form ? form.stock : ''} />
                      </div>
                    </ModalBody>
                    <ModalFooter>
                      {this.state.tipoModal === 'insertar' ?
                        <button className='btn btn-success' onClick={() => this.peticionPost()}>
                          INSERTAR
                        </button> : <button className='btn btn-primary' onClick={() => this.peticionPut()}>
                          ACTUALIZAR
                        </button>
                      }
                      <button className='btn btn-danger' onClick={() => this.modalInsertar()}>
                        CANCELAR
                      </button>
                    </ModalFooter>
                  </Modal>

                  <Modal isOpen={this.state.modalEliminar}>
                    <ModalBody>
                      ¿Estas Seguro de que quieres eliminar el producto {form && form.nombre}?
                    </ModalBody>
                    <ModalFooter>
                      <button className='btn btn-danger' onClick={() => this.peticionDelete()}>SI</button>
                      <button className='btn btn-secondary' onClick={() => this.setState({ modalEliminar: false })}>NO</button>
                    </ModalFooter>
                  </Modal>
                </>
              } />
              <Route path="/reclamaciones" element={<Reclamaciones />} />
            </Routes>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;


