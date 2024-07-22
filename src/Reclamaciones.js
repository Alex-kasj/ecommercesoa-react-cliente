import React, { Component } from 'react';
import './App.css';
import './index.css';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import './css/styles.css';
import images from './imageLoader';
import imagenLink from './img/MB (670 × 590 px) (1).ico';
import imagenIcon from './img/MB (670 × 590 px) (670 × 300 px).png';

const url = "https://gregarious-victory-production.up.railway.app/api/reclamos";
const productosUrl = "https://gregarious-victory-production.up.railway.app/api/productos"; // URL para traer productos del backend

class Reclamaciones extends Component {

  state = {
    data: [],
    productos: [], // Estado para los productos
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

  peticionGetProductos = () => {
    axios.get(productosUrl).then(response => {
      this.setState({ productos: response.data });
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
    this.peticionGetProductos(); // Trae productos al cargar el componente
  }

  handlePageChange = (event, pageNumber) => {
    event.preventDefault();
    this.setState({ currentPage: pageNumber });
  }

  render() {
    const { form, data, productos, currentPage, itemsPerPage } = this.state;

    // Filtra los datos para la página actual
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentData = data.slice(indexOfFirstItem, indexOfLastItem);
    const currentProductos = productos.slice(indexOfFirstItem, indexOfLastItem);

    // Calcular el número total de páginas
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(data.length / itemsPerPage); i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="App full-screen">
        <head>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
            integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous" />
          <title>Catalogo de Productos</title>
          <link rel="icon" href={imagenLink} />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
          <link
            href="https://fonts.googleapis.com/css2?family=Comic+Neue:ital@0;1&family=Kumbh+Sans:wght@400;700&family=Open+Sans&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
        </head>

        <div style={{ background: 'linear-gradient(#383220,#6b5422)' }}>
          <nav class="navbar navbar-expand-lg bg-black" style={{ backgroundColor: '#383220' }}>
            <div class="container-fluid text-center">
              <a class="navbar-brand text-white" href="index.html"><img src={imagenIcon} alt=""
                width="120" /></a>
              <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z" />
                </svg>
              </button>

            </div>
          </nav>
          <header id="header" class="vh-100 carousel slide" data-bs-ride="carousel" style={{ paddingTop: '104px' }}>
            <div class="container h-75 d-flex align-items-center carousel-inner">
              <div class="text-center carousel-item active">
                <h2 class="text-capitalize text-white">Encuentra el reloj</h2>
                <h1 class="text-uppercase py-2 fw-bold text-white">que se acomode a tu estilo</h1>
                <a href="ofertas.html" style={{ backgroundColor: '#383220' }} class="btn text-light mt-3 text-uppercase">Haz click
                  aquí</a>
              </div>
              <div class="text-center carousel-item">
                <h2 class="text-capitalize text-white">Revisa Todas las</h2>
                <h1 class="text-uppercase py-2 fw-bold text-white">Ofertas que tenemos para ti</h1>
                <a href="ofertas.html" style={{ backgroundColor: '#383220' }} class="btn text-light mt-3 text-uppercase">Haz click
                  aquí</a>
              </div>
            </div>

            <button class="carousel-control-prev" type="button" data-bs-target="#header" data-bs-slide="prev">
              <span class="carousel-control-prev-icon"></span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#header" data-bs-slide="next">
              <span class="carousel-control-next-icon"></span>
            </button>
          </header>
          <div id="riboon" class="container-fluid">
            <div id="cube" class="container w-50 px-5 rounded-lg">
              <div class="row align-items-center">
                <div class="col-sm p-3">
                  <div class="text-center text-light" style={{ marginTop: '7rem' }}>
                    <h1 style={{ marginTop: '-4rem' }}>Ofertas Navidad 2022</h1>
                  </div>
                </div>
              </div>
              <hr />
            </div>
          </div>

          <main style={{ marginTop: '30px' }}>
            <div class="container accordion text-light text-center">
              <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                {currentProductos.map((producto, index) => (
                  <div class="col">
                    <div class="card shadow-sm" style={{ backgroundColor: '#383220' }}>
                      <img src={images['90.png']} />
                      <div class="card-body">
                        <p class="card-text">{producto.nombre}</p>
                        
                        <p class="card-text">S/.{producto.precio}</p>
                        <div class="accordion-item">
                          <h2 class="accordion-header" id="heading7">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                              data-bs-target="#collapse7" aria-expanded="true" aria-controls="collapse7">
                              {producto.descripcion}
                            </button>
                          </h2>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
              </div>
              <div className="d-flex justify-content-center mt-4">
                  <ul className="pagination">
                    {pageNumbers.map(number => (
                      <li key={number} className="page-item">
                        <a onClick={(e) => this.handlePageChange(e, number)} href="!#" className="page-link">
                          {number}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
            </div>
          </main>
          <footer style={{ marginTop: '5rem', backgroundColor: '#383220' }} className="py-5">
            <div className="container">
              <div className="row text-white g-4">
                <div className="col-md-4 col-lg-">
                  <h5 className="fw-light mb-3">Contactanos</h5>
                  <div className="d-flex justify-content-start align-items-start my-2 text-muted">
                    <span className="me-3">
                      <i className="fas fa-envelope"></i>
                    </span>
                    <span className="fw-light">
                      mbwatchperu@gmail.com
                    </span>
                  </div>
                  <div className="d-flex justify-content-start align-items-start my-2 text-muted">
                    <span className="me-3">
                      <i className="fas fa-phone-alt"></i>
                    </span>
                    <span className="fw-light">
                      961325570
                    </span>
                  </div>
                </div>
                <div className="col-md-4 col-lg-4">
                  <h5 className="fw-light mb-3">Siguenos</h5>
                  <div>
                    <ul className="list-unstyled d-flex">
                      <li>
                        <a href="https://www.facebook.com/MBwatchperu"
                          className="text-white text-decoration-none text-muted fs-4 me-4">
                          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor"
                            className="bi bi-facebook" viewBox="0 0 16 16">
                            <path
                              d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                          </svg>
                        </a>
                      </li>
                      <li>
                        <a href="https://www.instagram.com/mbwatchperu/"
                          className="text-white text-decoration-none text-muted fs-4 me-4">
                          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor"
                            className="bi bi-instagram" viewBox="0 0 16 16">
                            <path
                              d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z" />
                          </svg>
                        </a>
                      </li>
                      <li>
                        <a href="https://wa.link/4kpxbf" className="text-white text-decoration-none text-muted fs-4 me-4">
                          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor"
                            className="bi bi-whatsapp" viewBox="0 0 16 16">
                            <path
                              d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
                          </svg>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-md-4 col-lg-4">
                  <h5 className="fw-light mb-3">Reclamaciones: </h5>
                  <div>
                    <ul className="list-unstyled d-flex">
                      <li>
                        <a className='btn btn-successbtn btn-outline-gray' onClick={() => { this.setState({ form: null, tipoModal: 'insertar' }); this.modalInsertar() }}>
                          Reclamos
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

          </footer>
          <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js"
            integrity="sha384-IQsoLXl5PILFhosVNubq5LC7Qb9DXgDA9i+tQ8Zj3iwWAwPtgFTxbJ8NT4GN1R8p"
            crossorigin="anonymous"></script>
          <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.min.js"
            integrity="sha384-cVKIPhGWiC2Al4u+LWgxfKTRIcfu0JTxR+EQDz/bgldoEyl4H0zUF0QKbrJ0EcQF"
            crossorigin="anonymous"></script>
        </div>

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
      </div>
    );
  }
}

export default Reclamaciones;


