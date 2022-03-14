
import { NavPageContainer, Link } from 'react-windows-ui'
import React, { useEffect } from 'react'
import NavigationWindow from '../../components/Navigation'
import { Dialog, Button } from 'react-windows-ui'
import MaterialTable from 'material-table'
import Modal from '../../components/Modal';
import useState from 'react-usestateref'

const Ciudad = () => {

  const [showModal, setShowModal] = useState(false);
  const [listAreas, setListAreas] = useState()
  const [loading, setLoading] = useState(true)
  const [defaultName, setDefaultName, defaultNameRef] = useState()
  const [selectedIndex, setSelectedIndex, selectedIndexRef] = useState()
  const [addModal, setAddModal] = useState(false)

  useEffect(() => {
    getAreasData()
  }, [])

  const addNewArea = async () => {
    if (defaultName) {
      try {
        setLoading(true)
        const response = await fetch(process.env.REACT_APP_HOME + "area", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ "DescripcionArea": defaultNameRef.current })
        })
        const result = await response.json()
        console.log(result)
        await getAreasData()
        setAddModal(false)
        setLoading(false)
        setDefaultName()
        alert("El area se guardo exitosamente")
      } catch (error) {
        alert("Ocurrio un error al guardar el area")
      }
    } else {
      alert("El nombre del area no puede ir vacio")
    }
  }

  const updateCityRow = async () => {
    if(defaultName){
      try {
        setLoading(true)
        const response = await fetch(process.env.REACT_APP_HOME + "area/"+selectedIndexRef.current, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ "DescripcionArea": defaultNameRef.current })
        })
        const result = await response.json();
        console.log(result)
        await getAreasData()
        setShowModal(false)
        setLoading(false)
        setDefaultName()
        alert("El area se actualizó exitosamente")
      } catch (error) {
        alert("Ocurrio un error al actualizar la categoria")
      }
    }else{
      alert("El nombre del area no puede ir vacio")
    }
  }

  const getAreasData = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_HOME + "area", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const result = await response.json()

      setListAreas(result)
      setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }


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

  const handleUpdateCity = async(nombre, codigo) => {
    setDefaultName(nombre); 
    setSelectedIndex(codigo); 
    setShowModal(true)
  }

  return (
    <>
      {
        loading ? <></> :
          <>
            <NavigationWindow />
            <NavPageContainer
              hasPadding={true}
              animateTransition={true}>

              <Modal showOverlay={true} show={showModal} onClose={() => setShowModal(false)} size={"md"}>
                <Modal.Header>
                  <Modal.Title>Actualizar Sucursal</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {/* <img src={currentImageRef.current} width="700px" height="auto" /> */}
                  <table style={{ width: '100%' }} className="styled-table" id="table-products">
                    <thead>
                      <tr>
                        <th>Caracteristica</th>
                        <th>Valor</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Nombre de la Sucursal</td>
                        <td>
                          <input type="text" className='app-input-text' value={defaultName} onChange={(e) => setDefaultName(e.target.value)} />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Modal.Body>
                <Modal.Footer>
                  <Button value="Aceptar" onClick={updateCityRow} />
                  <Button value="Cerrar" onClick={() => setShowModal(false)} />
                </Modal.Footer>
              </Modal>

              <Modal showOverlay={true} show={addModal} onClose={() => setAddModal(false)} size={"md"}>
                <Modal.Header>
                  <Modal.Title>Nueva Sucursal</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {/* <img src={currentImageRef.current} width="700px" height="auto" /> */}
                  <table style={{ width: '100%' }} className="styled-table" id="table-products">
                    <thead>
                      <tr>
                        <th>Caracteristica</th>
                        <th>Valor</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Nombre de la Sucursal</td>
                        <td>
                          <input type="text" className='app-input-text' value={defaultName} onChange={(e) => setDefaultName(e.target.value)} />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Modal.Body>
                <Modal.Footer>
                  <Button value="Aceptar" onClick={addNewArea} />
                  <Button value="Cerrar" onClick={() => setAddModal(false)} />
                </Modal.Footer>
              </Modal>


              <h1>Áreas</h1>
              <p>Añada, modifique o elimine registro de áreas de su empresa</p>
              <div className="app-hr"></div>
              <div style={{ marginTop: "20px", marginRight: "30px", display: "flex", flex: 1, flexDirection: "column" }}>
              <div style={{ marginTop: "15px", display: "flex" }}>
                  <div style={{flex: 1}}>
                  <label>Buscar</label>
                  <input className='app-input-text' id="search-input-table" placeholder='Buscar...' style={{ marginLeft: "20px" }} onKeyUp={searchTableAll} />
                  </div>
                  <div style={{flex: 1, justifyContent: "flex-end", display: "flex"}}>
                  <button className='app-button primary animate' onClick={()=> setAddModal(true)}>Nueva Sucursal</button>
                  </div>
                </div>
                <table style={{ width: '100%' }} className="styled-table" id="table-products">
                  <thead>
                    <tr>
                      <th>Ciudad</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      listAreas?.map((item, index) => {
                        return (
                          <tr>
                            <td>{item.DescripcionArea}</td>
                            <td style={{ display: "flex", justifyContent: "center" }}>
                              <button className='app-button primary animate' onClick={() => handleUpdateCity(item.DescripcionArea, item.IdArea)}>Actualizar</button>
                            </td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </table>
              </div>

            </NavPageContainer>
          </>
      }
    </>
  );
}

export default Ciudad