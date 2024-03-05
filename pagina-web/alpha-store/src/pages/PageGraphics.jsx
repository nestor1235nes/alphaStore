import "./PageGraphics.css"
import { Dropdown } from 'react-bootstrap';
import { useAuth } from "../context/AuthContext";
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { useSale } from "../context/SaleContext";

const PageGraphics = () =>{

    //////////////////////////////////////////////////////////////////////////
    //Funcion para cerrar sesion
    const { signout, user } = useAuth();
    const logOutSubmit = async () => {
        const result = await signout();
    };

    ///////////////////////////////////////////////////////////////////////////
    //Se Obtienen las ventas
    const { getSales } = useSale();
    const [dataSales, setDataSales] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        const result = await getSales();
        setDataSales(result);
      };
      fetchData();
    }, []);

    
////////////////////////////////////////////////////////////
    const getProductSalesData = (sales) => {
      const productSalesData = {};
      sales.forEach((sale) => {
        sale.products.forEach((product) => {
          if (product.productCode in productSalesData) {
            productSalesData[product.productCode].quantity += parseInt(product.saleAmount);
          } else {
            productSalesData[product.productCode] = {
              productName: product.productName,
              quantity: parseInt(product.saleAmount),
            };
          }
        });
      });
      return Object.values(productSalesData);
    };

    //////////////////////////////////////////////////////////////////////////
    //Seccion para mostrar grafico de productos vendidos
    const productSalesData = getProductSalesData(dataSales);

    const data = {
      labels: productSalesData.map((product) => product.productName),
      datasets: [
        {
          label: 'Cantidad Vendida',
          data: productSalesData.map((product) => product.quantity),
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    };

    const options = {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
          },
        },
      },
    };

      //////////////////////////////////////////////////////////////////////////////////////////////
    //Seccion para mostrar grafico de ventas realizadas por dia
    const getProductSalesByDay = () => {
      const productSalesByDay = {};
      dataSales.forEach((sale) => {
        const saleDate = new Date(sale.createdAt);
        const day = `${saleDate.getFullYear()}-${saleDate.getMonth() + 1}-${saleDate.getDate()}`;
        if (day in productSalesByDay) {
          productSalesByDay[day] += sale.products.length;
        } else {
          productSalesByDay[day] = sale.products.length;
        }
      });
      return productSalesByDay;
    };
    const productSalesByDay = getProductSalesByDay();

    const dataByDay = {
      labels: Object.keys(productSalesByDay),
      datasets: [
        {
          label: 'Productos Vendidos por Día',
          data: Object.values(productSalesByDay),
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    };
  
    const optionsByDay = {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
          },
        },
      },
    };


    /////////////////////////////////////////////////////////
    //seccion para mostra grafico de ventas mensuales
    const getMonthlySales = () => {
      const monthlySales = {};
      
      dataSales.forEach((sale) => {
        const saleDate = new Date(sale.createdAt);
        const month = `${saleDate.getFullYear()}-${saleDate.getMonth() + 1}`;
        
        if (month in monthlySales) {
          monthlySales[month] += 1; // Assuming each sale is one unit
          
        } else {
          monthlySales[month] = 1;
        }
      });
      return monthlySales;
    };
  
    const monthlySales = getMonthlySales();

    const dataMonthlySales = {
      labels: Object.keys(monthlySales),
      datasets: [
        {
          label: 'Ventas Mensuales',
          data: Object.values(monthlySales),
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    };
  
    const optionsMonthlySales = {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
          },
        },
      },
    };

    return(
        <div className="fullContainerGraphicsPage">
                      
               
           <div className="headContainerGraphics">
                <div>
                    <img
                            src="https://cloud.alphanetcurico.com/s/WgTq9kGcCfCceYs/download?path=%2FImagen%20varias&files=Avatar_upscayl_4x_realesrgan-x4plus.png"
                            alt="Logo"
                            className="logo-home"
                        />         
                    <h1 className="estandarLetter" style={{marginLeft:'55%'}}>Alpha<strong >Store</strong></h1>    
                </div> 
                
               <Dropdown>
               <Dropdown.Toggle variant="light" id="dropdown-basic" className="userGraphics" style={{overflow:'hidden', whiteSpace:'nowrap'}}>
               <img
                   src="https://cdn.icon-icons.com/icons2/632/PNG/512/user_icon-icons.com_57997.png"
                   className="userLogGraphics"
               />
               <h1 className="user-name">{user.username}</h1>
               </Dropdown.Toggle>
               <Dropdown.Menu style={{  backgroundColor: 'white', fontSize: '1.3rem', width:'230px', marginLeft:'50%'}}>
                   <Dropdown.Item style={{color: 'black', display:'flex'}} onClick={logOutSubmit}>
                       <img
                       src="https://cdn.icon-icons.com/icons2/1207/PNG/512/1491313938-close_82982.png"
                       className="buttonClose"
                       />
                       Cerrar Sesión</Dropdown.Item>
               </Dropdown.Menu>
               </Dropdown>        
           </div>

           <hr className="lineStoreGraphics"></hr>
           <div style={{width:'70%',marginTop:'7%',marginLeft:'-50%'}}>
              <h2>Cantidad de productos Vendidos</h2>
              <Bar data={data} options={options} />
              <h2>Productos Vendidos por Día</h2>
              <Bar data={dataByDay} options={optionsByDay} />
              <h2>Ventas Mensuales</h2>
              <Bar style={{width:'100%'}} data={dataMonthlySales} options={optionsMonthlySales} />
                
           </div>
           <div style={{width:'70%',marginTop:'7%',marginLeft:'-50%'}}>
              
                
           </div>
        </div>


    );
}

export default PageGraphics;