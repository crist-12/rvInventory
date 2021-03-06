/**
 * @file Componente - Asignación
 * @author Christopher Ortiz
 * @namespace Equipos
 * @description Los equipos deben ser asignados a los empleados, esta pantalla es la encargada de realizar las asignaciones a cada uno de ellos.
 * @version 1.0.0
 */
import { NavPageContainer, InputText, RadioButton, Button, NavPageContainerRight, LinkCompound } from 'react-windows-ui'
import React, { useEffect } from 'react'
import NavigationWindow from '../../components/Navigation'
import Select from 'react-select'
import useState from 'react-usestateref'
import { useMasterState } from '../../stores/MasterStore'
import { useAuthState } from '../../stores/AuthStore'
import "../equipos/index.css"
import Loader from 'react-js-loader'
import getPivotArray from '../../../shared/arrayToPivot'
import { triggerBase64Download } from 'react-base64-downloader'
import Modal from '../../components/Modal';


const Equipos = () => {

  const [entities, setEntities] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [controls, setControls] = React.useState([])
  const [selected, setSelected] = React.useState(null)
  const [options, setOptions] = React.useState([[]])
  const [respuesta, setRespuesta, respuestaRef] = useState([])
  const [entityCode, setEntityCode, entityCodeRef] = useState()
  const [mode, setMode] = React.useState('R')
  const [tableEquipo, setTableEquipo, tableEquipoRef] = useState([])
  const [lastKey, setLastKey, lastKeyRef] = useState()
  const [headers, setHeaders, headersRef] = useState([])
  const [rows, setRows, rowsRef] = useState([])
  const [modalImg, setModalImg] = useState(false)
  const [currentImage, setCurrentImage, currentImageRef] = useState()
  // const [dataList, setDataList] = React.useState([])

  const masterState = useMasterState();
  const authState = useAuthState();



  const columnas = [
    {
      title: 'Equipo',
      field: 'equipo'
    }
  ]

  useEffect(() => {
    getAllCategories()
    setLoading(false)
  }, [])

  /**
   * Obtiene todas las entidades para cargarlas en el select
   * @function getAllCategories
   * @memberof Equipos
   * @async
   * @return void
   * @inner
   */
  const getAllCategories = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_HOME + "category", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const result = await response.json()
      var arre = []
      result.forEach(ele => {
        var obj = {
          value: ele.IdCategoria,
          label: ele.DescripcionCategoria
        }
        arre.push(obj)
        // console.log(obj)
      })
      setEntities(arre)
      // setLoading(false)
    } catch (error) {
      alert(error)
    }
  }
  /**
   * Obtiene las cabeceras para establecer en la tabla
   * @function getHeaders
   * @memberof Equipos
   * @async
   * @return void
   * @inner
   */
  const getHeaders = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_HOME + "control/headers/" + entityCodeRef.current, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const result = await response.json()
      var arre = []
      result.forEach(ele => {
        var obj = {
          categoria: ele.IdCategoria,
          caracteristica: ele.IdCaracteristica,
          descripcion: ele.CaracteristicaDescripcion
        }
        arre.push(obj)
        // console.log(obj)
      })
      //console.log("RESPUESTA HEADERS")
      //console.log(result)
      setHeaders(arre)
      //console.log(headersRef.current)
      // setLoading(false)
    } catch (error) {
      alert(error)
    }
  }
  /**
   * Cuando seleccionamos la entidad, obtenemos los campos de la misma
   * @function getEntityEntries
   * @memberof Equipos
   * @async
   * @return void
   * @inner
   */
  const getEntityEntries = async (id) => {
    try {
      const response = await fetch(process.env.REACT_APP_HOME + "control/filter/" + id, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const result = await response.json()
      var arre = []
      var resp = [...respuesta]
      result.forEach(ele => {
        var obj = {
          id: ele.IdCaracteristica,
          key: ele.IdCategoria,
          name: ele.CaracteristicaDescripcion,
          required: ele.Requerido,
          placeholder: ele.Placeholder,
          tooltip: ele.Tooltip,
          type: ele.DescripcionTipo
        }
        arre.push(obj)
        var keyObj = "CTRL-" + obj.id
        setEntityCode(ele.IdCategoria)
        resp[keyObj] = ""
        //setRespuesta([...respuesta, resp])
        // console.log(resp)
      })
      setRespuesta(resp)
      // console.log(resp)
      setControls(arre)
      getOptions(id)
      // setLoading(false)
    } catch (error) {
      alert(error)
    }
  }
  /**
   * Obtiene las opciones para los campos de la entidad
   * @function getOptions
   * @memberof Equipos
   * @async
   * @return void
   * @inner
   */
  const getOptions = async (id) => {
    try {
      const response = await fetch(process.env.REACT_APP_HOME + "control/options/" + id, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const result = await response.json()
      var arre = []
      result.forEach(ele => {
        var obj = {
          value: ele.IdOpcion,
          label: ele.OpcionDescripcion,
          key: ele.IdCaracteristica
        }
        arre.push(obj)
        //console.log(obj)
      })
      setOptions(arre)
    } catch (error) {
      alert(error)
    }
  }

  /**
   * Manejo el cambio de la entidad 
   * @function handleListChange
   * @memberof Equipos
   * @async
   * @return void
   * @inner
   */
  const handleListChange = async (e) => {
    //setLoading(true)
    //setSelected(e.value)
    /*if (mode == 'R')
      await getEntityEntries(e.value)
    else if (mode == 'L') {
      setLoading(true)
      await getAllEntriesTable(e.value)
      setLoading(false)
    }*/
    await getEntityEntries(e.value)
    await getAllEntriesTable(e.value)
    await getHeaders();
    await getRows();
    //setLoading(false)
  }

  /**
   * Obtiene las entradas de la entidad seleccionada
   * @function getAllEntriesTable
   * @memberof Equipos
   * @async
   * @return void
   * @inner
   */
  const getAllEntriesTable = async (id) => {
    //setLoading(true)
    try {
      const response = await fetch(process.env.REACT_APP_HOME + "control/equipos", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const result = await response.json()
      var arre = []
      result.forEach(ele => {
        var obj = {
          equipo: ele.Equipo
        }
        arre.push(obj)
        //console.log(obj)
      })
      setTableEquipo(arre)
      //setLoading(false)
    } catch (error) {
      alert(error)
    }
  }

  /**
  * Muestra el control indicado de acuerdo al tipo de control especificado en la base de datos
  * @function showControls
  * @memberof Equipos
  * @async
  * @return void
  * @inner
  */
  const showControls = (item) => {
    try {
      if (item?.type != undefined) {
        var req = item.required.data[0];
        // console.log(req)
        if (req == 1) req = true; else req = false;
        //console.log(req)
        switch (item.type) {
          case "text": case "number": case "date":
            return (
              <div style={{ margin: "15px 0px" }}>
                <label>{item.name} {req ? <label style={{ color: masterState.get().color }}>*</label> : <></>}</label>
                <div style={{ margin: "10px 0" }}>
                  <input
                    className='app-input-text'
                    placeholder={item.placeholder}
                    tooltip={item.tooltip}
                    type={item.type}
                    required={req}
                    onChange={handleChangeControlValue}
                    //onChange={change}
                    step={0.01}
                    id={item.id} />
                </div>
              </div>
            )
          case "textarea":
            return (
              <div style={{ margin: "15px 0px" }}>
                <label>{item.name} {req ? <label style={{ color: masterState.get().color }}>*</label> : <></>}</label>
                <div style={{ margin: "10px 0" }}>
                  <textarea
                    className='app-textarea'
                    style={{ resize: 'none', width: '350px', height: '150px' }}
                    placeholder={item.placeholder}
                    tooltip={item.tooltip}
                    id={item.id}
                    onChange={handleChangeControlValue}
                    required={req} />
                </div>
              </div>
            )
          case 'file':
            return (
              <div style={{ margin: "15px 0px" }}>
                {/* 
                <br />
                <div style={{ marginTop: "15px" }}>
                  <label htmlFor={"filePicker"+item.id} style={{ background: "lightgray", padding: "5px 10px" }}>
                    {item.placeholder ?? "Escoge un archivo"}
                  </label>
                  <input id={"filePicker"+item.id} style={{ visibility: "hidden" }} type={"file"} required={req} onChange={handleInputControlValue} />
                </div>
                <br /> */}
                <label>{item.name} {req ? <label style={{ color: masterState.get().color }}>*</label> : <></>}</label>
                <br />
                <input type={item.type} id={item.id} onChange={handleInputControlValue} required={req} style={{ marginTop: "10px" }} accept="image/*" />
              </div>)
          case 'select':
            /*getOptions(item.key)*/
            var arrayAux = options.filter(ele => ele.key == item.id)
            return (
              <div style={{ margin: "15px 0px" }}>
                <label>{item.name} {req ? <label style={{ color: masterState.get().color }}>*</label> : <></>}</label>
                <div style={{ margin: "10px 0" }}>
                  <Select
                    name={item.id}
                    // id={item.id}
                    placeholder={item.placeholder}
                    options={arrayAux}
                    onChange={handleChangeSelectValue}
                    theme={(theme) => ({
                      ...theme,
                      borderRadius: 0,
                      colors: {
                        ...theme.colors,
                        primary: masterState.get().color,
                        primary25: masterState.get().color
                      },
                    })}
                  />
                </div>
              </div>
            )
        }
      }
    } catch (error) {

    }

  }

  /**
   * Maneja los valores de los controles cuando se produce un cambio en él 
   * @function handleChangeControlValue
   * @memberof Equipos
   * @async
   * @return void
   * @inner
   */
  const handleChangeControlValue = (e) => {
    var auxArray = respuesta

    var keyName = "CTRL-" + e.target.id;
    // if(e?.value){

    if (e.target?.value) {
      auxArray[keyName] = e.target.value;
    } else
      console.log(auxArray)
    setRespuesta(auxArray)
  }
  /**
   * Obtiene las opciones para los campos de la entidad
   * @function handleInputControlValue
   * @memberof Equipos
   * @async
   * @return void
   * @inner
   */
  const handleInputControlValue = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertToBase64(file);
    console.log(base64)
    var auxArray = respuesta

    var id = e.target.id;
    //  var id2 = id.substring(10);
    var keyName = "CTRL-" + id;
    console.log(keyName)
    // if(e?.value){
    auxArray[keyName] = base64;

    setRespuesta(auxArray)
    console.log(auxArray)
  }

  /**
   * Convierte el archivo obtenido por el input type file en base 64
   * @function convertToBase64
   * @memberof Equipos
   * @async
   * @return void
   * @inner
   */
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  /**
   * Maneja el cambio del select cuando cambia
   * @function handleChangeSelectValue
   * @memberof Equipos
   * @async
   * @return void
   * @inner
   */
  const handleChangeSelectValue = (e, { name }) => {
    var auxArray = respuesta

    var keyName = "CTRL-" + name
    // if(e?.value){
    auxArray[keyName] = e.value;
    // }else

    console.log(auxArray)
    setRespuesta(auxArray)
  }

  /**
   * Obtiene el último equipo insertado
   * @function getLastProductKey
   * @memberof Equipos
   * @async
   * @return void
   * @inner
   */
  const getLastProductKey = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_HOME + "control/key", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const result = await response.json()
      setLastKey(result[0].Key)
    } catch (error) {
      alert(error)
    }
  }

  /**
   * Maneja el proceso del guardado del estado de la computadora
   * @function saveComputerState
   * @memberof Equipos
   * @async
   * @return void
   * @inner
   */
  const saveComputerState = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_HOME + "control/state", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "IdEquipo": lastKeyRef.current })
      })
      console.log("ESTOY AQUI " + lastKeyRef.current)
      const result = await response.json()

    } catch (error) {
      alert(error)
    }
  }
  /**
   * Obtiene las opciones para los campos de la entidad
   * @function handleSaveNewEntry
   * @memberof Equipos
   * @async
   * @return void
   * @inner
   */
  const handleSaveNewEntry = async (event) => {
    event.preventDefault()
    try {
      await getLastProductKey();

      let llaves = Object.keys(respuestaRef.current)
      const entityCode = entityCodeRef.current;

      // if (entityCode == 1) {

      // }

      console.log(llaves)

      llaves.forEach((el) => {
        console.log(el)
        var show = el.substring(5)
        console.log(respuestaRef.current[el])
        const response = fetch(process.env.REACT_APP_HOME + "control/entries", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ "IdEquipoIngresado": lastKeyRef.current, "IdCategoria": entityCode, "IdCaracteristica": show, "Respuesta": respuestaRef.current[el], "UsuarioCreo": authState.me.get().username })
        })

      }).then((response) => {
        console.log(response);
        alert("Se ha registrado el producto exitosamente");
      }).catch((error) => {
        alert("Ocurrio un error al registrar el producto");
        console.log(error);
      })
      //setRespuesta([])
      alert("Registro finalizado exitosamente")

    } catch (error) {
      //alert("Ocurrio un error al guardar el empleado" + error)
      //alert("Ocurrio un error en el proceso "+error)
    }
    await saveComputerState();
    alert("Registro finalizado exitosamente")
    setRespuesta([])
    setLoading(true);
    setLoading(false);
    /*await getAllCategories();*/
  }
  /**
   * Función que obtiene los listados de la computadora, invoca a  la función pivote en Js para ordenamiento de los mismos.
   * @function getRows
   * @memberof Equipos
   * @async
   * @return void
   * @inner
   */
  const getRows = async (id) => {
    try {
      const response = await fetch(process.env.REACT_APP_HOME + "control/rows/" + entityCodeRef.current, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const result = await response.json()
      console.log(result)
      let array = []

      result.forEach((el) => {
        let row = [];
        console.log(el)
        row[0] = el.IdEquipoIngresado
        row[1] = el.IdCaracteristica
        row[2] = el.Respuesta
        array.push(row)
      })
      //console.log(array)
      setRows(getPivotArray(array, 0, 1, 2))
    } catch (error) {
      alert(error)
    }
  }
  /**
   * Filtra en la tabla buscando por todos los campos
   * @function performSearch
   * @memberof Equipos
   * @async
   * @return void
   * @inner
   */
  const performSearch = () => {
    var searchBox = document.getElementById('search-input-table');
    var table = document.getElementById("table-products");
    var trs = table.tBodies[0].getElementsByTagName("tr");
    var filter = searchBox.value.toUpperCase();
    for (var rowI = 0; rowI < trs.length; rowI++) {
      var tds = trs[rowI].getElementsByTagName("td");
      trs[rowI].style.display = "none";
      for (var cellI = 0; cellI < tds.length; cellI++) {
        if (tds[cellI].innerHTML.toUpperCase().indexOf(filter) > -1) {
          trs[rowI].style.display = "";
          continue;
        }
      }
    }

  }


  return (
    <>
      {
        loading ? <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center", width: "100vw", height: "100vh" }}>
          <Loader type="spinner-circle" bgColor={"#000"} title={"Cargando..."} color={'#000'} size={100} />
        </div> : <>
          <NavigationWindow />
          <NavPageContainer
            hasPadding={true}
            animateTransition={true}>

            <h1>Equipos</h1>
            <p>Ingrese productos a su stock de inventario.</p>
            <div className="app-hr"></div>
            <div>
              <span style={{ fontWeight: "bold" }}>Modo</span>
              <br />
              <div style={{ display: "flex", margin: "15px 0px" }}>
                <div style={{ marginRight: "15px" }}>
                  <RadioButton name="radio" value={mode} label='Registro' onChange={() => setMode('R')} defaultChecked />
                </div>
                <div>
                  <RadioButton name="radio" value={mode} label='Lectura' onChange={() => setMode('L')} />
                </div>
              </div>
            </div>

            <div style={{ marginRight: "20px" }}>
              <Select
                // defaultInputValue='Seleccione una categoria'
                placeholder='Seleccione una categoria'
                defaultValue={entities[0]}
                menuPortalTarget={document.body}
                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                options={entities}
                onChange={handleListChange}
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 0,
                  colors: {
                    ...theme.colors,
                    primary: masterState.get().color,
                    primary25: masterState.get().color
                  },
                })}
              />
            </div>
            {
              mode == 'R' ?
                <>
                  {
                    controls.length >= 1 ?
                      <form id="form-control-items" onSubmit={handleSaveNewEntry}>
                        <fieldset style={{ borderRadius: "10px", marginTop: "15px", marginRight: "20px", color: "d9d9d9", borderColor: "d9d9d9" }}>
                          {
                            controls.map(item => {
                              return showControls(item)
                            })
                          }
                          <button type="submit" className='app-button animate primary' /*onSubmit={handleSaveNewEntry}*/ /*onClick={handleSaveNewEntry}*/>Guardar</button>
                        </fieldset>
                      </form>
                      :
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <h3 style={{ color: "lightgray", marginTop: "40px" }}>Selecciona un elemento de la lista para añadir productos</h3>
                      </div>
                  }
                </>
                : rowsRef.current.length >= 1 ? <>
                  <div style={{ marginTop: "20px", marginRight: "30px" }}>
                    <div>
                      <label>Buscar</label>
                      <input className='app-input-text' id="search-input-table" placeholder='Buscar...' style={{ marginLeft: "20px" }} onKeyUp={performSearch} />
                    </div>
                    <div style={{ overflow: "auto" }}>
                      <table className="styled-table" id="table-products">
                        <thead>
                          <tr>
                            {
                              headers.map(item => {
                                return (<th>{item.descripcion}</th>)
                              })
                            }
                          </tr>
                        </thead>
                        <tbody>
                          {
                            rowsRef.current.map((elemento, indice) => {
                              if (indice == 0) return;
                              return (
                                <tr>
                                  {
                                    elemento.map((dato, indiceDato) => {
                                      if (indiceDato == 0) return;
                                      //return (<td>{dato}</td>)
                                      if (dato.length > 500) {
                                        return (
                                          <>
                                            <td><a style={{ textDecoration: "underline", color: "blue" }} onClick={() => { setModalImg(true); setCurrentImage(dato); }}>Ver imagen</a></td>
                                            <Modal showOverlay={true} show={modalImg} onClose={() => setModalImg(false)}>
                                              <Modal.Header>
                                                <Modal.Title>Visualizador de imágenes</Modal.Title>
                                              </Modal.Header>
                                              <Modal.Body>
                                                <img src={currentImageRef.current} width="700px" height="auto" />
                                              </Modal.Body>
                                              <Modal.Footer>
                                                <Button value='Guardar imagen' onClick={() => { triggerBase64Download(currentImageRef.current, "IMG-" + Date.now()) }} />
                                                <Button value="Cerrar" onClick={() => setModalImg(false)} />
                                              </Modal.Footer>
                                            </Modal>
                                          </>
                                        )
                                      }
                                      return (
                                        <td>{dato}</td>
                                      )
                                    })
                                  }
                                </tr>
                              )

                            })
                          }
                        </tbody>
                      </table>
                    </div>
                  </div>
                </> : entityCodeRef.current ? <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center", width: "100%", height: "auto", marginTop: "30px" }}>
                  <Loader type="spinner-circle" bgColor={"#000"} title={"Cargando..."} color={'#000'} size={100} />
                </div> : <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <h3 style={{ color: "lightgray", marginTop: "40px" }}>Selecciona un elemento de la lista para añadir productos</h3>
                </div>
            }

          </NavPageContainer>
        </>
      }
    </>
  );
}

export default Equipos