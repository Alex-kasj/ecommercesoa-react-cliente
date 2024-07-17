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
        <div className="sidebar">
          <h2>Menú</h2>
          <ul>
            <li><Link to="/">INICIO</Link></li>
            <li><Link to="/reclamaciones">RECLAMACIONES</Link></li>
          </ul>
        </div>
        <div className='main-content'>
          <br />
          <button className='btn btn-success' onClick={() => { this.setState({ form: null, tipoModal: 'insertar' }); this.modalInsertar() }}>Agregar Reclamación</button>
          <br /><br />
          <table className='table'>
            <thead>
              <tr>
                <th>#</th>
                <th>ID Cliente</th>
                <th>DNI</th>
                <th>Fecha</th>
                <th>Detalle Reclamo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map(reclamacion => {
                return (
                  <tr key={reclamacion.id}>
                    <td>{reclamacion.id}</td>
                    <td>{reclamacion.id_cliente}</td>
                    <td>{reclamacion.DNI}</td>
                    <td>{reclamacion.fecha}</td>
                    <td>{reclamacion.detalle_reclamo}</td>
                    <td>
                      <button className='btn btn-primary' onClick={() => { this.seleccionarReclamacion(reclamacion); this.modalInsertar() }}><FontAwesomeIcon icon={faEdit} /></button>
                      {" "}
                      <button className='btn btn-danger' onClick={() => { this.seleccionarReclamacion(reclamacion); this.setState({ modalEliminar: true }) }}><FontAwesomeIcon icon={faTrashAlt} /></button>
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
        </div>
      </div>
    );
  }
}

export default Reclamaciones;


