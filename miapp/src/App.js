import React , {useState, useEffect} from 'react';
import Axios from 'axios';
import './App.css';

export default function App() {
  const [restaurantData, setRestaurantData] = useState({
    restaurantName: '',
    restaurantNit: '',
    restaurantAddress: '',
    restaurantPhone: '',
    cityId: 0
  });
  const [departamentos, setDepartamentos] = useState([]);
  const [deptoSeleccionado, setDeptoSeleccionado] = useState('');
  const [ciudades, setCiudades] = useState([]);
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState('');

  useEffect(()=>{

    const obtenerDeptos = async () => {
      const response = await Axios({
        url: `http://localhost:1337/api/listdepartments`
      });
      const lstDepartamentos = Object.keys(response.data).map(i => response.data[i]);
      setDepartamentos(lstDepartamentos.flat());
    }

    const obtenerCiudades = async (departmentId) =>{
      const response = await Axios({
        url: `http://localhost:1337/api/listcities/${departmentId}`
      });
      const lstCiudades = Object.keys(response.data).map(i=> response.data[i]);
      setCiudades(lstCiudades.flat());
    }

    obtenerDeptos();

    if(deptoSeleccionado !== "")
      obtenerCiudades(deptoSeleccionado);
    
  },[deptoSeleccionado]);

  function handleDepartamentosSelect(event){
    setDeptoSeleccionado(event.target.value);
  }

  function handleCiudadesSelect(event){
    setCiudadSeleccionada(event.target.value);
    setRestaurantData({
      ...restaurantData,
      cityId : event.target.value
    })
  }

  function handleChange(event){
    const { name, value} = event.target;
    setRestaurantData({
      ...restaurantData,
      [name]: value
    });
  }

  const handleSubmit = async(event) => {
    try{
      const response = await Axios.post('http://localhost:1337/api/createrestaurant', restaurantData);
      console.log(response.data);
    }
    catch (error){
      console.log(error);
    }
  } 

  return (
    <div>
      <h2>Formulario Restaurante</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre del restaurante: </label>
          <input type='text' id="restaurantName" name="restaurantName" value={restaurantData.restaurantName} onChange={handleChange}></input>
        </div>
        <div>
          <label>NIT del restaurante: </label>
          <input type='text' id="restaurantNit" name="restaurantNit" value={restaurantData.restaurantNit} onChange={handleChange}></input>
        </div>
        <div>
          <label>Departamento: </label>
          <select id="opcionesDepartamentos" value={deptoSeleccionado} onChange={handleDepartamentosSelect}>
            <option value="">Seleccione un departamento</option>
            {departamentos.map(opcion =>(
              <option key={opcion.value} value={opcion.value}>{opcion.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Ciudad: </label>
          <select id="opcionesCiudades" value={ciudadSeleccionada} onChange={handleCiudadesSelect}>
            <option value="">Seleccione una ciudad</option>
            {ciudades.map(opcion =>(
              <option key={opcion.value} value={opcion.value}>{opcion.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Dirección del restaurante: </label>
          <input type='text' id="restaurantAddress" name="restaurantAddress" value={restaurantData.restaurantAddress} onChange={handleChange}></input>
        </div>
        <div>
          <label>Teléfono del restaurante: </label>
          <input type='text' id="restaurantPhone" name="restaurantPhone" value={restaurantData.restaurantPhone} onChange={handleChange}></input>
        </div>
        <div>
          <button type='submit'> Guardar </button>
        </div>
      </form>
    </div>
  );
}