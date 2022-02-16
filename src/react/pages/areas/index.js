
import { NavPageContainer } from 'react-windows-ui'
import React, { useState, useEffect } from 'react'
import NavigationWindow from '../../components/Navigation'
import "../categorias/index.css"
import { Dialog, Button } from 'react-windows-ui'
import MaterialTable from 'material-table'

const Areas = () => {

  const [showModal, setShowModal] = useState(false);
  const [categoria, setCategoria] = useState("")
  const [listCat, setlistCat] = useState("")
  const [loading, setLoading] = useState(true)

  const columnas = [
    {
      title: 'Id',
      field: 'id',
      hidden: true
    },
    {
      title: 'Área',
      field: 'area'
    }
  ]

  useEffect(() => {
    getItems()
  }, [])

  const addItem = async () => {
    try {
      setLoading(true)
      const response = await fetch(process.env.REACT_APP_HOME + "area", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "DescripcionArea": categoria })
      })
      setCategoria("")
      await getItems()
      setShowModal(false)
      setLoading(false)
      alert("El área se guardo exitosamente")
    } catch (error) {
      alert("Ocurrio un error al guardar el área")
    }
  }

  const getItems = async () => {
    try {
      const response = await fetch("http://localhost:9000/area", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const result = await response.json()
      var arre = []
      result.forEach(ele => {
        var obj = {
          id: ele.IdArea,
          area: ele.DescripcionArea ?? "No hay"
        }
        arre.push(obj)
        console.log(obj)
      })
      setlistCat(arre)
      setLoading(false)
      //console.log(result)
      //setlistCat(response)

    } catch (error) {
      console.log(error)
    }
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

              <h1>Áreas</h1>
              <p>Ingrese y administre los registros de las áreas de la empresa</p>
              <div className="app-hr"></div>

              <div style={{ margin: '20px 0' }}>
                <Button
                  style={{ marginLeft: '30px' }}
                  value="Nueva"
                  onClick={() => setShowModal(true)}
                  icon={<i className="icons10-plus"></i>} />
              </div>
              <div style={{ width: '100%' }}>
                {/*            <TableView
              columns={[
                { 'title':'Categoría', 'showSortIcon': true },
                { 'title':'Acciones','showSortIcon': false, 'sortable': false },
              ]}
              rows={listCat}
              style= {{width: '100%', backgroundColor: 'blue'}}
            /> */}
                <MaterialTable
                  columns={columnas}
                  data={listCat}
                  title="Categorias"
                  style={{ boxShadow: 'none', marginRight: '30px' }}
                  localization={{
                    header: {
                      actions: 'Acciones'
                    },
                    pagination: {
                      labelDisplayedRows: '{from}-{to} de {count}',
                      labelRowsSelect: 'filas',
                      labelRowsPerPage: 'Filas por página',
                      firstAriaLabel: 'Primera página',
                      firstTooltip: 'Primera página',
                      previousAriaLabel: 'Página anterior',
                      previousTooltip: 'Página anterior',
                      nextAriaLabel: 'Siguiente página',
                      nextTooltip: 'Siguiente página',
                      lastAriaLabel: 'Última página',
                      lastTooltip: 'Última página'
                    },
                    toolbar: {
                      nRowsSelected: '{0} fila(s) seleccionada(s)',
                      searchTooltip: 'Buscar...',
                      searchPlaceholder: 'Buscar...',
                      exportTitle: "Categrorias",
                      exportPDFName: 'Exportar como PDF',
                      exportCSVName: 'Exportar como CSV'
                    },
                    body: {
                      emptyDataSourceMessage: 'No hay datos para mostrar',
                      filterRow: {
                        searchTooltip: 'Buscar...'
                      }
                    }
                  }}
                  options={{
                    actionsColumnIndex: -1,
                    exportButton: true,
                    draggable: true
                  }}
                  actions={
                    [
                      {
                        icon: 'edit',
                        tooltip: 'Editar categoria',
                        onClick: (event, rowData) => alert("Has presionado la categoria: " + rowData.categoria)
                      },
                      {
                        icon: 'delete',
                        tooltip: 'Eliminar categoria',
                        onClick: (event, rowData) => alert("Has presionado la categoria: " + rowData.categoria)
                      }
                    ]
                  }

                />
              </div>
              <Dialog
                isVisible={showModal}
                onBackdropPress={() => setShowModal(false)}
                showDropShadow={true}>
                <div style={{ padding: '10px' }}>
                  <h3>Nueva área</h3>
                  <div className="app-hr"></div>
                  <div >
                    <p>Nombre del área: </p>
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

export default Areas