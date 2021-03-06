/**
 * @file Componente - Categorías
 * @author Christopher Ortiz
 * @namespace Categorías
 * @description Componente que renderiza la lista de categorías
 * @version 1.0.0
 */
import { NavPageContainer } from 'react-windows-ui'
import React, { useEffect } from 'react'
import NavigationWindow from '../../components/Navigation'
import "../categorias/index.css"
import { Dialog, Button } from 'react-windows-ui'
import useState from 'react-usestateref'
import Modal from '../../components/Modal';
import Select from 'react-select';
import Loader from 'react-js-loader';
import { useAuthState } from '../../stores/AuthStore';

const Categoria = () => {
  /**
   * Hook encargado de manejar el estado de mostrar el modal
   * @function setShowModal
   * @memberof Categorías
   * @return showModal {boolean}
   * @inner
   */
  const [showModal, setShowModal] = useState(false);
  /**
   * Hook encargado de manejar el estado de mostrar el modal para cambiar el estado de la categoría
   * @function setModalCancel
   * @memberof Categorías
   * @return modalCancel {boolean}
   * @inner
   */
  const [modalCancel, setModalCancel] = useState(false);
  /**
   * Hook encargado de manejar el nombre de la categoría
   * @function setCategoria
   * @memberof Categorías
   * @return categoria {string}
   * @inner
   */
  const [categoria, setCategoria] = useState("")
  /**
   * Hook encargado de manejar el listado de las categorías de la base de datos
   * @function setlistCat
   * @memberof Categorías
   * @return listCat {array}
   * @inner
   */
  const [listCat, setlistCat, listCatRef] = useState([])
  /**
   * Hook encargado de manejar el estado de carga de la página
   * @function setLoading
   * @memberof Categorías
   * @return loading {boolean}
   * @inner
   */
  const [loading, setLoading] = useState(true)
  /**
   * Hook encargado de manejar el código del equipo que se está actualizando actualmente
   * @function setKeyEdit
   * @memberof Categorías
   * @return keyEdit {Object}
   * @inner
   */
  const [keyEdit, setKeyEdit, keyEditRef] = useState(null)
  /**
   * Hook encargado de manejar la visualización del modal de actualización
   * @function setModalActualizar
   * @memberof Categorías
   * @return modalActualizar {boolean}
   * @inner
   */
  const [modalActualizar, setModalActualizar] = useState(false)
  /**
   * Hook encargado de manejar la información de la categoría que se está actualizando
   * @function setInfoRaw
   * @memberof Categorías
   * @return infoRaw {Object}
   * @inner
   */
  const [infoRaw, setInfoRaw, infoRawRef] = useState()
  /**
   * Hook encargado de manejar el estado del modal de la categoría
   * @function setModalCategory
   * @memberof Categorías
   * @return modalCategory {boolean}
   * @inner
   */
  const [modalCategory, setModalCategory] = useState(false)
  /**
   * Hook encargado de manejar el ingreso de un nuevo ítem
   * @function setNewItems
   * @memberof Categorías
   * @return newItems {string}
   * @inner
   */
  const [newItems, setNewItems, newItemsRef] = useState("")
  /**
   * Hook encargado de manejar el estado del modal de los nuevos items
   * @function setItemModal
   * @memberof Categorías
   * @return itemsModal {boolean}
   * @inner
   */
  const [itemsModal, setItemsModal] = useState(false)
  /**
   * Hook encargado de manejar el estado del modal de los nuevos items
   * @function setItems
   * @memberof Categorías
   * @return items {Object}
   * @inner
   */
  const [items, setItems, itemsRef] = useState()
  /**
   * Hook encargado de manejar el estado del modal de los items seleccionados
   * @function setItemsSelect
   * @memberof Categorías
   * @return itemsSelect {Array}
   * @inner
   */
  const [itemsSelect, setItemsSelect, itemsSelectRef] = useState([])
  /**
   * Hook encargado de manejar el estado del modal mostrar/ocultar de los nuevos items
   * @function setModalNew
   * @memberof Categorías
   * @return modalNew {Object}
   * @inner
   */
  const [modalNew, setModalNew] = useState(false)
  /**
   * Hook encargado de manejar el estado del modal de los nuevos items
   * @function setTypes
   * @memberof Categorías
   * @return types {Object}
   * @inner
   */
  const [types, setTypes, typesRef] = useState()
  /**
   * Hook encargado de manejar el tipo de campo seleccionado
   * @function setSelectedType
   * @memberof Categorías
   * @return selectedType {Object}
   * @inner
   */
  const [selectedType, setSelectedType, selectedTypeRef] = useState();
  /**
   * Hook encargado de manejar el nombre de la caracteristica
   * @function setNombreCaracteristica
   * @memberof Categorías
   * @return nombreCaracteristica {Object}
   * @inner
   */
  const [nombreCaracteristica, setNombreCaracteristica, nombreCaracteristicaRef] = useState()
  /**
   * Hook encargado de manejar el valor del Placeholder a registrar
   * @function setPlaceholderR
   * @memberof Categorías
   * @return placeholderR {Object}
   * @inner
   */
  const [placeholderR, setPlaceholderR, placeholderRRef] = useState()
  /**
   * Hook encargado de manejar el valor deL requerido
   * @function setIsRequired
   * @memberof Categorías
   * @return isRequired {int}
   * @inner
   */
  const [isRequired, setIsRequired, isRequiredRef] = useState(0)
  /**
   * Hook encargado de manejar el valor de los valores seleccionados
   * @function setSelectValues
   * @memberof Categorías
   * @return selectValues {Object}
   * @inner
   */
  const [selectValues, setSelectValues, selectValuesRef] = useState()
  /**
   * Hook encargado de manejar el valor del último nivel conseguido
   * @function setLastLevel
   * @memberof Categorías
   * @return lastLevel {Object}
   * @inner
   */
  const [lastLevel, setLastLevel, lastLevelRef] = useState()
  /**
   * Hook encargado de manejar el valor del código que fue insertado
   * @function setInsertedId
   * @memberof Categorías
   * @return insertedId {Object}
   * @inner
   */
  const [insertedId, setInsertedId, insertedIdRef] = useState()


  const AuthStore = useAuthState();

  useEffect(() => {
    getAllTypes()
    getItems()
  }, [])

  /**
   * Se encarga de agregar una nueva categoría a la base de datos
   * @function addItem
   * @memberof Categorías
   * @async
   * @return void
   * @inner
   */
  const addItem = async () => {
    try {
      setLoading(true)
      const response = await fetch(process.env.REACT_APP_HOME + "category", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "DescripcionCategoria": categoria })
      })
      setCategoria("")
      await getItems()
      setShowModal(false)
      setLoading(false)
      alert("La categoria se guardo exitosamente")
    } catch (error) {
      alert("Ocurrio un error al guardar la categoria")
    }
  }

  /**
 * Se encarga de traer los datos de las categorías desde la base de datos
 * @function getItems
 * @memberof Categorías
 * @async
 * @return void
 * @inner
 */
  const getItems = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_HOME + "category/table", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const result = await response.json()
      setlistCat(result)
      setLoading(false)
      //console.log(result)
      //setlistCat(response)
      // console.log(result)
    } catch (error) {
      console.log(error)
      alert("Ocurrio un error al obtener las categorias " + error)
    }
  }

  /**
   * Se encarga de agregar una nueva categoría a la base de datos
   * @function getAllTypes
   * @memberof Categorías
   * @async
   * @return void
   * @inner
   */
  const getAllTypes = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_HOME + "machines/types", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const result = await response.json()
      setTypes(result)
    } catch (error) {
      console.log(error)
      alert("Ocurrio un error al obtener los tipos de datos " + error)
    }
  }

  /**
   * Maneja la búsqueda en la tabla, función que se encarga de filtrar los datos de la tabla
   * @name searchTableAll
   * @function
   * @memberof Categorías
   * @inner
   * @return {void}
  */
  const searchTableAll = () => {
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

  /**
   * Cambia el estado de la entidad
   * @name changeEntityStatus
   * @function
   * @memberof Categorías
   * @inner
   * @return {void}
  */
  const changeEntityStatus = async (key, action) => {
    setKeyEdit(key);
    await getLastLevelByEntity();
    if (action == "UPD") {
      await getEntityInfoRaw();
      setModalActualizar(true);
    }
    if (action == "STA") {
      setModalCancel(true);
    }
  }

  /**
   * Maneja los cambios relacionados con el estado de la categoría
   * @name handleEntityStatus
   * @function
   * @memberof Categorías
   * @inner
   * @return {void}
  */
  const handleEntityStatus = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_HOME + "category/changestatus/" + keyEditRef.current, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const result = await response.json()
      await getAllTypes()
      await getItems()
      //window.location.reload()
    } catch (error) {
      console.log(error)
      alert("Ocurrio un error al cambiar el estado de la entidad " + error)
    }
    setModalCancel(false);
  }

  /**
   * Trae la información detallada de las entidades
   * @name getEntityInfoRaw
   * @function
   * @memberof Categorías
   * @inner
   * @return {void}
  */
  const getEntityInfoRaw = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_HOME + "category/update/" + keyEditRef.current, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const result = await response.json()
      setInfoRaw(result)
      console.log(infoRawRef.current)
    } catch (error) {
      console.log(error)
      alert("Ocurrio un error al obtener la entidad " + error)
    }
  }

  /**
   * Gestiona el cambio en un input y lo almacena en un objeto
   * @name handleCaracteristicaNameChange
   * @function
   * @memberof Categorías
   * @inner
   * @return {void}
  */
  const handleCaracteristicaNameChange = (e) => {
    var auxArray = [...infoRaw];
    auxArray[e.target.id].CaracteristicaDescripcion = e.target.value;
    setInfoRaw(auxArray);
  }
  /**
   * Gestiona el cambio en un input del valor del Placeholder y lo almacena en un objeto
   * @name handlePlaceholderChange
   * @function
   * @memberof Categorías
   * @inner
   * @return {void}
  */
  const handlePlaceholderChange = (e) => {
    var auxArray = [...infoRaw];
    auxArray[e.target.id].Placeholder = e.target.value;
    setInfoRaw(auxArray);
  }
  /**
   * Gestiona el cambio en un checkbox del valor del Requerido y lo almacena en un objeto
   * @name handleIsRequiredItem
   * @function
   * @memberof Categorías
   * @inner
   * @return {void}
  */
  const handleIsRequiredItem = (e) => {
    var auxArray = [...infoRaw];
    var value = auxArray[e.target.id].Requerido.data[0];
    //if(e.target.value == 0) value = 1; else value = 0;
    if (value == 0) value = 1; else value = 0;
    auxArray[e.target.id].Requerido.data[0] = value;
    setInfoRaw(auxArray);
    console.log(infoRawRef.current)
  }
  /**
   * Almacena el item una variable y su código para luego sean utilizados por los métodos de actualización e inserción.
   * @name handleNewItemsChange
   * @function
   * @memberof Categorías
   * @inner
   * @return {void}
  */
  const handleNewItemsChange = async (e) => {
    setItemsSelect(e.target.id)
    await getItemsByRow();
    setItemsModal(true)
  }
  /**
   * Trae los items de una entidad desde la base de datos
   * @name getItemsByRow
   * @function
   * @memberof Categorías
   * @inner
   * @return {void}
  */
  const getItemsByRow = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_HOME + "category/items/" + keyEditRef.current, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const result = await response.json()
      setItems(result)
    } catch (error) {
      console.log(error)
      alert("Ocurrio un error al obtener las categorias " + error)
    }
  }
  /**
   * Actualiza la información de una característica (pregunta)
   * @name updateCaracteristicaInfo
   * @function
   * @memberof Categorías
   * @inner
   * @return {void}
  */
  const updateCaracteristicaInfo = async (index) => {
    try {
      const response = await fetch(process.env.REACT_APP_HOME + "category/update/" + keyEditRef.current, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          CaracteristicaDescripcion: infoRawRef.current[index].CaracteristicaDescripcion,
          Placeholder: infoRawRef.current[index].Placeholder,
          Requerido: infoRawRef.current[index].Requerido.data[0],
          IdCaracteristica: infoRawRef.current[index].IdCaracteristica
        })
      })
      const result = await response.json()
      console.log(result)
    } catch (error) {
      console.log(error)
      //alert("Ocurrio un error al obtener la entidad " + error)
    }
  }
  /**
   * Método que se encarga de actualizar la entidad en general
   * @name handleUpdateEntity
   * @function
   * @memberof Categorías
   * @inner
   * @return {void}
  */
  const handleUpdateEntity = async (e) => {
    setModalActualizar(false)
    try {
      infoRawRef.current.forEach((item, index) => {
        updateCaracteristicaInfo(index);
      })
      alert("Datos actualizados exitosamente")
      await getAllTypes()
      await getItems()
    } catch (error) {
      console.log(error)
      alert("Ocurrio un error al actualizar la entidad " + error)
    }
  }
  /**
   * Método que guarda item por item las preguntas de la entidad
   * @name saveNewItem
   * @function
   * @memberof Categorías
   * @inner
   * @return {void}
  */
  const saveNewItem = async (e) => {
    if (newItemsRef.current.length < 1) return alert("El campo no puede estar vacio");
    try {
      const lastLevel = parseInt(itemsRef.current?.filter(x => x.IdCaracteristica == itemsSelectRef.current)[0].MaxNivel) + 1;
      const response = await fetch(process.env.REACT_APP_HOME + "category/items/", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          IdCategoria: keyEditRef.current,
          IdCaracteristica: itemsSelectRef.current,
          OpcionDescripcion: newItemsRef.current,
          Nivel: lastLevel
        })
      })
      const result = await response.json()
      console.log(result)
      alert("Item guardado exitosamente")
      await getAllTypes()
      await getItems()
      //window.location.reload()
    } catch (error) {
      console.log(error)
      alert("Ocurrio un error al guardar la entidad " + error)
    }
  }
  /**
   * Reacciona ante el check de activo/inactivo
   * @name handleChangeItemsName
   * @function
   * @memberof Categorías
   * @inner
   * @return {void}
  */
  const handleChangeItemsState = async (e) => {
    var auxArray = [...items];
    console.log(auxArray)
    var value = auxArray[e.target.id].Estado.data[0];
    console.log(value)
    if (value == 0) value = 1; else value = 0;
    auxArray[e.target.id].Estado.data[0] = value;
    setItems(auxArray);
  }
  /**
   * Guarda el nombre de los items al ser insertados/actualizados
   * @name handleChangeItemsName
   * @function
   * @memberof Categorías
   * @inner
   * @return {void}
  */
  const handleChangeItemsName = async (e) => {
    var auxArray = [...items];
    var id = e.target.id;
    auxArray.filter(x => x.IdCaracteristica == itemsSelectRef.current)[e.target.id].OpcionDescripcion = e.target.value;
    setItems(auxArray);
  }
  /**
   * Toma todos los items (que pertenezcan a un campo de tipo selección) y los actualiza
   * @name updateAllMyItems
   * @function
   * @async
   * @memberof Categorías
   * @inner
   * @return {void}
  */
  const updateAllMyItems = async (e) => {
    try {
      itemsRef.current.forEach((item, index) => {
        updateItems(index);
      })
      alert("Datos actualizados exitosamente")
      setModalActualizar(false)
      await getAllTypes()
      await getItems()
    } catch (error) {
      console.log(error)
      alert("Ocurrio un error al actualizar la entidad " + error)
    }
  }
  /**
   * Actualiza item por item los datos que pertenezcan a un campo de tipo selección
   * @name updateItems
   * @function
   * @async
   * @memberof Categorías
   * @inner
   * @return {void}
  */
  const updateItems = async (index) => {
    try {
      const response = await fetch(process.env.REACT_APP_HOME + "category/updateitems", {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          Estado: itemsRef.current[index].Estado.data[0],
          OpcionDescripcion: itemsRef.current[index].OpcionDescripcion,
          IdCategoria: keyEditRef.current,
          IdCaracteristica: itemsSelectRef.current,
          IdOpcion: itemsRef.current[index].IdOpcion
        })
      })
      const result = await response.json()
      console.log(result)
    } catch (error) {
      console.log(error)
      //alert("Ocurrio un error al obtener la entidad " + error)
    }
  }
  /**
   * Función que se encarga de actualizar el valor de si es o no requerido
   * @name handleRequiredNewItem
   * @function
   * @memberof Categorías
   * @inner
   * @return {void}
  */
  const handleRequiredNewItem = (e) => {
    if (e.target.value == "on") {
      setIsRequired(1);
    } else {
      setIsRequired(0);
    }
  }
  /**
   * Obtiene cuál fue el último nivel que se insertó entre las entidades
   * @name getLastLevelByEntity
   * @function
   * @memberof Categorías
   * @inner
   * @return {void}
  */
  const getLastLevelByEntity = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_HOME + "control/lastlevel/" + keyEditRef.current, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const result = await response.json()
      setLastLevel(result[0].LastNivel)
    } catch (error) {
      console.log(error)
      alert("Ocurrio un error al obtener las categorias " + error)
    }
  }
  /**
   * Función que se encarga de insertar una nueva característica
   * @name addCaracteristica
   * @function
   * @async
   * @memberof Categorías
   * @inner
   * @return {void}
  */
  const addCaracteristica = async () => {
    try {

      const response = await fetch(process.env.REACT_APP_HOME + "control", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "IdCategoria": keyEditRef.current,
          "CaracteristicaDescripcion": nombreCaracteristicaRef.current,
          "Estado": 1,
          "Nivel": parseInt(lastLevelRef.current) + 1,
          "Requerido": isRequiredRef.current,
          "Placeholder": placeholderRRef.current,
          "Tooltip": nombreCaracteristicaRef.current,
          "UsuarioCreo": AuthStore.me.get().username,
          "CaracteristicaTipo": selectedTypeRef.current
        })
      })
      const result = await response.json()
      console.log(result)
      setInsertedId(result.message)

      if (selectedTypeRef.current != 4)
        alert("La categoria se guardo exitosamente")
      else
        await handleNewSelectionSave();

    } catch (error) {
      alert("Ocurrio un error al guardar la categoria")
    }
  }
  /**
   * Registra las opciones que tendrá un nuevo campo de tipo Selección
   * @name addItemsOptions
   * @function
   * @memberof Categorías
   * @inner
   * @return {void}
  */
  const addItemsOptions = async (description, level) => {
    try {
      const response = await fetch(process.env.REACT_APP_HOME + "control/detail", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "IdCategoria": keyEditRef.current,
          "IdCaracteristica": insertedIdRef.current,
          "Valores": description,
          "Nivel": level,
          "Estado": 1
        })
      })
      const result = await response.json()
      console.log(result)
      //window.location.reload()
    } catch (error) {
      alert("Ocurrio un error al guardar la categoria")
    }
  }
  /**
   * Toma los datos insertados, hace un split de ellos (el texto en formato de barra) y los inserta como opciones de un campo de tipo selección
   * @name handleNewSelectionSave
   * @function
   * @memberof Categorías
   * @inner
   * @return {void}
  */
  const handleNewSelectionSave = async () => {
    try {
      const stringValues = selectValuesRef.current;
      const stringValuesArray = stringValues.split("|");
      stringValuesArray.forEach((item, index) => {
        console.log(item)
        addItemsOptions(item, index).then((result) => {
          //console.log(result)
        })
      })
      alert("La categoria se guardo exitosamente");
      await getAllTypes()
      await getItems()
    } catch (error) {
      alert("Algo salió mal durante se guardaba la categoría");
    }

  }

  return (
    <>
      {
        loading ? <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center", width: "100vw", height: "100vh" }}>
          <Loader type="spinner-circle" bgColor={"#000"} title={"Cargando..."} color={'#000'} size={100} />
        </div> :
          <>
            <NavigationWindow />
            <NavPageContainer
              hasPadding={true}
              animateTransition={true}>


              <Modal showOverlay={true} show={modalCancel} onClose={() => setModalCancel(false)}>
                <Modal.Header>
                  <Modal.Title>Cambiar estado</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div style={{ display: 'flex' }}>
                    <i className="icons10-exclamation-mark" style={{ color: '#faca2a', fontSize: "70px" }} />
                    <div style={{ marginLeft: 25, justifyContent: "center", alignItems: "center", display: "flex" }}>
                      <label>Estás a punto de cambiar el estado de esta entidad, ¿estás seguro(a) que deseas continuar?</label>
                    </div>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button value='Si, cambiar estado' onClick={() => { handleEntityStatus() }} />
                  <Button value="No, mantener estado actual" onClick={() => setModalCancel(false)} />
                </Modal.Footer>
              </Modal>

              <Modal showOverlay={true} show={modalNew} onClose={() => setModalNew(false)} size={"md"}>
                <Modal.Header>
                  <Modal.Title>Nueva Caracteristica</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div style={{ display: 'flex', flex: 1 }}>
                    <table style={{ width: '100%' }} className="styled-table" id="table-products">
                      <thead>
                        <tr>
                          <th>Elemento</th>
                          <th>Valor</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <p>Nombre de la Caracteristica</p>
                          </td>
                          <td>
                            <input type="text" className='app-input-text' placeholder='Nombre de la caracteristica' value={nombreCaracteristica} onChange={(e) => setNombreCaracteristica(e.target.value)} />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <p>Placeholder</p>
                          </td>
                          <td>
                            <input type="text" className='app-input-text' placeholder='Nombre de la caracteristica' value={placeholderR} onChange={(e) => setPlaceholderR(e.target.value)} />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <p>Tipo</p>
                          </td>
                          <td>
                            <Select
                              options={typesRef.current}
                              onChange={(e) => setSelectedType(e.value)}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <p>
                              Opciones (separadas por barra |)
                            </p>
                          </td>
                          <td>
                            <input type="text" className='app-input-text' placeholder='Item 1|Item2|Item3' value={selectValues} onChange={(e) => setSelectValues(e.target.value)} disabled={selectedTypeRef.current == 4 ? false : true} />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <p>
                              ¿Es requerido?
                            </p>
                          </td>
                          <td>
                            <div style={{ display: "flex", justifyContent: "center" }}>
                              <input type="checkbox" placeholder='Nombre de la caracteristica' onChange={handleRequiredNewItem} />
                            </div>
                          </td>
                        </tr>

                      </tbody>
                    </table>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button value='Guardar nuevo campo' onClick={addCaracteristica} />
                  <Button value="Cancelar" onClick={() => setModalNew(false)} />
                </Modal.Footer>
              </Modal>

              <Modal showOverlay={true} show={modalActualizar} onClose={() => setModalActualizar(false)}>
                <Modal.Header>
                  <Modal.Title>Actualizar entidad</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div style={{ display: 'flex' }}>
                    {/* <i className="icons10-info" style={{ color: '#faca2a', fontSize: "50px" }} /> */}
                    <div style={{ marginRight: 25, flex: 1 }}>

                      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                        <button className="app-button animate primary" onClick={() => setModalNew(true)}>Nuevo campo</button>
                      </div>
                      <div>
                        <table style={{ width: '100%' }} className="styled-table" id="table-products">
                          <thead>
                            <tr>
                              <th>Caracteristica</th>
                              <th>Placeholder</th>
                              <th>Tipo</th>
                              <th>Requerido</th>
                              <th>Valores</th>
                              <th>Nuevos Items</th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              infoRaw ? infoRawRef.current?.map((item, index) => {

                                return (
                                  <tr>
                                    <td>
                                      <input type="text" className='app-input-text' id={index} value={infoRawRef.current[index].CaracteristicaDescripcion} onChange={handleCaracteristicaNameChange} />
                                    </td>
                                    <td>
                                      <input type="text" className='app-input-text' id={index} value={infoRawRef.current[index].Placeholder} onChange={handlePlaceholderChange} />
                                    </td>
                                    <td>
                                      {infoRawRef.current[index].DisplayText}
                                    </td>
                                    <td>{
                                      infoRawRef.current[index].Requerido.data[0] === 1 ?
                                        <div style={{ display: "flex", justifyContent: "center" }}>
                                          <input type="checkbox" id={index} checked onChange={handleIsRequiredItem} />
                                        </div>
                                        :
                                        <div style={{ display: "flex", justifyContent: "center" }}>
                                          <input type="checkbox" id={index} onChange={handleIsRequiredItem} />
                                        </div>
                                    }

                                    </td>
                                    <td>
                                      {infoRawRef.current[index].Campos}
                                    </td>
                                    <td>
                                      {
                                        infoRawRef.current[index].DescripcionTipo === "select" ?
                                          <button className='app-button animate primary' style={{ marginRight: "10px" }} id={item.IdCaracteristica} onClick={handleNewItemsChange}>Actualizar items</button>
                                          :
                                          <p>N/A</p>
                                      }

                                    </td>
                                  </tr>
                                )
                              }) : <></>
                            }
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex" }}>
                    <Modal showOverlay={true} show={itemsModal} onClose={() => setItemsModal(false)} size={"lg"}>
                      <Modal.Header>
                        <Modal.Title>Actualizacion de ítems</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <div style={{ display: "flex", flex: 1, justifyContent: "flex-end" }}>
                          <button className="app-button animate primary" onClick={() => setModalCategory(true)}>Nuevo item</button>
                        </div>
                        <div style={{ display: 'flex' }}>
                          <table style={{ width: '100%' }} className="styled-table" id="table-products">
                            <thead>
                              <tr>
                                <th>Item</th>
                                <th>Estado</th>
                              </tr>
                            </thead>
                            <tbody>
                              {
                                itemsRef.current?.filter(x => x.IdCaracteristica == itemsSelectRef.current).map((item, index) => {
                                  return (
                                    <tr>
                                      <td> <input className='app-input-text' type="text" id={index} value={itemsRef.current.filter(x => x.IdCaracteristica == itemsSelectRef.current)[index].OpcionDescripcion} onChange={handleChangeItemsName} /></td>
                                      {
                                        <td style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                          {
                                            itemsRef.current[index].Estado.data[0] == 1 ?
                                              <input type="checkbox" checked id={index} onChange={handleChangeItemsState} /> :
                                              <input type="checkbox" id={index} onChange={handleChangeItemsState} />
                                          }
                                        </td>
                                      }
                                    </tr>
                                  )
                                })
                              }
                            </tbody>
                          </table>
                        </div>


                        <Modal showOverlay={true} show={modalCategory} size={"xs"} onClose={() => setModalCategory(false)}>
                          <Modal.Header>
                            <Modal.Title>Nuevo Item</Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            <p>Ingrese el valor del nuevo item</p>
                            <input className='app-input-text' placeholder='Nuevo item' value={newItems} onChange={(e) => setNewItems(e.target.value)} />
                          </Modal.Body>
                          <Modal.Footer>
                            <Button value='Agregar item' onClick={() => { saveNewItem() }} />
                            <Button value="Cancelar" onClick={() => setModalCategory(false)} />
                          </Modal.Footer>
                        </Modal>



                      </Modal.Body>
                      <Modal.Footer>
                        <Button value='Actualizar items' onClick={updateAllMyItems} />
                        <Button value="Cancelar" onClick={() => setItemsModal(false)} />
                      </Modal.Footer>
                    </Modal>


                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <button className='app-button animate primary' style={{ marginRight: "10px" }} onClick={() => handleUpdateEntity()}>Actualizar</button>
                  <button className='app-button animate primary' style={{ marginRight: "10px" }} onClick={() => setModalActualizar(false)} >Cancelar</button>
                </Modal.Footer>
              </Modal>
              <h1>Entidades</h1>
              <p>Añada, modifique o elimine sus entidades</p>
              <div className="app-hr"></div>
              <div style={{ marginTop: "15px" }}>
                <label>Buscar</label>
                <input className='app-input-text' id="search-input-table" placeholder='Buscar...' style={{ marginLeft: "20px" }} onKeyUp={searchTableAll} />
              </div>
              <div style={{ display: "flex", flex: 1, marginRight: "30px" }}>
                <table style={{ width: '100%' }} className="styled-table" id="table-products">
                  <thead>
                    <tr>
                      <th>Entidad</th>
                      <th>Estado</th>
                      <th>Fecha de Creación</th>
                      <th>Grupo</th>
                      <th>Creada por</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      listCatRef?.current?.map(item => {
                        return (
                          <tr>
                            <td>{item.DescripcionCategoria}</td>
                            <td>{item.EstadoCategoria == "Activo" ? <span style={{ color: "green" }}>■</span> : <span style={{ color: "red" }}>■</span>} {item.EstadoCategoria}</td>
                            <td>{item.FechaCreacion}</td>
                            <td>{item.DescripcionGrupo}</td>
                            <td>{item.UsuarioCreo}</td>
                            <td>
                              <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <button className='app-button animate primary' style={{ marginRight: "10px" }} onClick={() => changeEntityStatus(item.IdCategoria, "STA")}>Cambiar estado</button>
                                <button className='app-button animate primary' style={{ marginRight: "10px" }} onClick={() => changeEntityStatus(item.IdCategoria, "UPD")}>Actualizar</button>
                              </div>
                            </td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </table>
              </div>
              <Dialog
                isVisible={showModal}
                onBackdropPress={() => setShowModal(false)}
                showDropShadow={true}>
                <div style={{ padding: '10px' }}>
                  <h3>Nueva Categoría</h3>
                  <div className="app-hr"></div>
                  <div >
                    <p>Nombre de la categoria: </p>
                    <input
                      value={categoria}
                      onChange={e => setCategoria(e.target.value)}
                    />
                    <Button
                      style={{ marginLeft: '30px' }}
                      value="Guardar"
                      onClick={addItem}
                      icon={<i className="icons10-save"></i>} />
                  </div>
                </div>
              </Dialog>
            </NavPageContainer>
          </>
      }
    </>
  );
}

export default Categoria