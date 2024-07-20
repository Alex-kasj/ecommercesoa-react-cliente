import React, { Component } from 'react';
import './App.css';
import './index.css';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Link } from 'react-router-dom';

const url = "http://127.0.0.1:8000/api/reclamos";

class Reclamaciones extends Component {

  state = {
    data: [],
    modalInsertar: false,
    modalEliminar: false,
    form: {
      id: '',
      id_cliente: '',
      DNI: '',
      fecha: '',
      detalle_reclamo: '',
      tipoModal: ''
    },
    currentPage: 1,
    itemsPerPage: 6
  }

  peticionGet = () => {
    axios.get(url).then(response => {
      this.setState({ data: response.data });
    }).catch(error => {
      console.log(error.message);
    })
  }

  peticionPost = async () => {
    delete this.state.form.id;
    await axios.post(url, this.state.form).then(response => {
      this.modalInsertar();
      this.peticionGet();
    }).catch(error => {
      console.log(error.message);
    })
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
    })
  }

  modalInsertar = () => {
    this.setState({ modalInsertar: !this.state.modalInsertar });
  }

  seleccionarReclamacion = (reclamacion) => {
    this.setState({
      tipoModal: 'actualizar',
      form: {
        id: reclamacion.id,
        id_cliente: reclamacion.id_cliente,
        DNI: reclamacion.DNI,
        fecha: reclamacion.fecha,
        detalle_reclamo: reclamacion.detalle_reclamo
      }
    })
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
      <div className="App">

        <div className='main-content'>
          <header>
            <nav class="navbar navbar-expand-lg bg-body-tertiary">
              <div class="container-fluid">
                <a class="navbar-brand" href="#">Navbar</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                  <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                  <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                      <a class="nav-link active" aria-current="page" href="#">Home</a>
                    </li>
                    <li class="nav-item">
                      <a class="nav-link" href="#">Link</a>
                    </li>
                    <li class="nav-item dropdown">
                      <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Dropdown
                      </a>
                      <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="#">Action</a></li>
                        <li><a class="dropdown-item" href="#">Another action</a></li>
                        <li><hr class="dropdown-divider"/></li>
                        <li><a class="dropdown-item" href="#">Something else here</a></li>
                      </ul>
                    </li>
                    <li class="nav-item">
                      <a class="nav-link disabled" aria-disabled="true">Disabled</a>
                    </li>
                  </ul>
                  <form class="d-flex" role="search">
                    <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
                      <button class="btn btn-outline-success" type="submit">Search</button>
                  </form>
                </div>
              </div>
            </nav>
          </header>
          <body>
            <div id="carouselExampleIndicators" class="carousel slide">
              <div class="carousel-indicators">
                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
              </div>
              <div class="carousel-inner">
                <div class="carousel-item active">
                  <img src="src/img/imagen 1.jpg" class="d-block w-100" alt="..." />
                </div>
                <div class="carousel-item">
                  <img src="src/img/imagen 2.jpg" class="d-block w-100" alt="..." />
                </div>
                <div class="carousel-item">
                  <img src="src/img/imagen 3.jpg" class="d-block w-100" alt="..." />
                </div>
              </div>
              <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
              </button>
              <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
              </button>
            </div>
          </body>
          <footer>
            <br />
            <button className='btn btn-success' onClick={() => { this.setState({ form: null, tipoModal: 'insertar' }); this.modalInsertar() }}>Agregar Reclamación</button>
            <br /><br />

            <Modal isOpen={this.state.modalInsertar}>
              <ModalHeader style={{ display: 'block' }}>
                <span style={{ float: 'right' }} onClick={() => this.modalInsertar()}> X </span>
              </ModalHeader>
              <ModalBody>
                <div className='form-group'>
                  <label htmlFor='id'>ID</label>
                  <input className='form-control' type="text" name="id" id="id" onChange={this.handleChange} value={form ? form.id : this.state.data.length + 2} readOnly />
                  <br />
                  <label htmlFor='id_cliente'>ID Cliente</label>
                  <input className='form-control' type="text" name="id_cliente" id="id_cliente" onChange={this.handleChange} value={form ? form.id_cliente : ''} />
                  <br />
                  <label htmlFor='DNI'>DNI</label>
                  <input className='form-control' type="text" name="DNI" id="DNI" onChange={this.handleChange} value={form ? form.DNI : ''} />
                  <br />
                  <label htmlFor='fecha'>Fecha</label>
                  <input className='form-control' type="text" name="fecha" id="fecha" onChange={this.handleChange} value={form ? form.fecha : ''} />
                  <br />
                  <label htmlFor='detalle_reclamo'>Detalle Reclamo</label>
                  <textarea className='form-control' name="detalle_reclamo" id="detalle_reclamo" onChange={this.handleChange} value={form ? form.detalle_reclamo : ''}></textarea>
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
                ¿Estas Seguro de que quieres eliminar la reclamación {form && form.id}?
              </ModalBody>
              <ModalFooter>
                <button className='btn btn-danger' onClick={() => this.peticionDelete()}>SI</button>
                <button className='btn btn-secondary' onClick={() => this.setState({ modalEliminar: false })}>NO</button>
              </ModalFooter>
            </Modal>
          </footer>
        </div>
      </div>
    );
  }
}

export default Reclamaciones;


