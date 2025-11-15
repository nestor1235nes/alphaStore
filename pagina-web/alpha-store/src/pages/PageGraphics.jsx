import "./PageGraphics.css"
import { Dropdown } from 'react-bootstrap';
import { useAuth } from "../context/AuthContext";
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { useSale } from "../context/SaleContext";
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { Link } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaArrowLeft } from 'react-icons/fa';
import logoImage from "../components/logo.jpg";

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
    
      const labels = Object.values(productSalesData).map((item) => item.productName);
      const data = Object.values(productSalesData).map((item) => item.quantity);
    
      return { labels, data };
    };
    
    
    
    const getProductSalesByDay = (sales) => {
      const productSalesByDay = {};
      const today = new Date();
      const lastSevenDays = new Date(today);
      lastSevenDays.setDate(today.getDate() - 6); // Restar 6 días para obtener los últimos 7 días
    
      sales.forEach((sale) => {
        const saleDate = new Date(sale.createdAt);
        if (saleDate >= lastSevenDays && saleDate <= today) {
          const day = `${saleDate.getDate()}/${saleDate.getMonth() + 1}`;
          if (day in productSalesByDay) {
            productSalesByDay[day] += sale.products.length;
          } else {
            productSalesByDay[day] = sale.products.length;
          }
        }
      });
    
      const labels = Object.keys(productSalesByDay);
      const data = Object.values(productSalesByDay);
      return {
        labels,
        data,
      };
    };
    
    const getMonthlySales = (sales) => {
      const monthlySales = {};
      sales.forEach((sale) => {
        const saleDate = new Date(sale.createdAt);
        const month = `${saleDate.getFullYear()}-${saleDate.getMonth() + 1}`;
        if (month in monthlySales) {
          monthlySales[month] += 1; // Assuming each sale is one unit
        } else {
          monthlySales[month] = 1;
        }
      });
    
      const labels = Object.keys(monthlySales);
      const data = Object.values(monthlySales);
    
      return { labels, data };
    };

    const handleChange = (event) => {
      setSelectedChart(event.target.value);
    };
    
    const finalData = (labels, data) => {
      const dataArray = Array.isArray(data) ? data : [];
      
      return {
        labels: labels,
        datasets: [
          {
            label: 'Cantidad Vendida',
            data: dataArray.map((item) => item.quantity || item),
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
        ],
      };
    };
    
    
    
    // Obtener los datos de acuerdo al tipo de gráfico seleccionado
    const [selectedChart, setSelectedChart] = useState('productSales'); // Seleccionar 'productSales' por defecto al cargar la página
    const [chartData, setChartData] = useState(null);
    

    useEffect(() => {
      let labels, data;
      switch (selectedChart) {
        case 'productSales':
          const proSalesdate = getProductSalesData(dataSales);
          labels = proSalesdate.labels;
          data = proSalesdate.data;
          break;
        case 'productSalesByDay':
          const salesByDayData = getProductSalesByDay(dataSales);
          labels = salesByDayData.labels;
          data = salesByDayData.data;
          break;
        case 'monthlySales':
          const salesByMonthData = getMonthlySales(dataSales);
          labels = salesByMonthData.labels;
          data = salesByMonthData.data;
          break;
        default:
          labels = () => '';
          data = [];
      }
    
      const chartData = finalData(labels, data);
      console.log(chartData)
      setChartData(chartData);
    }, [dataSales, selectedChart]);
    
      
    // Convertir data a un array si es un objeto
    

    return(
        <div className="fullContainerGraphicsPage">
                      
               
           <div className="headContainerGraphics">
                <div style={{ marginLeft:'5%'}}>
                    <img
                            src={logoImage}
                            alt="Logo"
                            className="logo-home"
                        />         
                    <h1 className="estandarLetter" style={{marginLeft:'15%'}}>Alpha<strong >Store</strong></h1>    
                </div> 
                <div style={{marginLeft:'28%', marginTop:'1%', width:'0px'}}>
                  <Link to="/salepoint">
                    <button className="buttonBack">
                        <FaArrowLeft style={{fontSize: '1.25rem'}} />
                        <span>Volver</span>
                    </button>
                  </Link>
                </div>
               <Dropdown>
               <Dropdown.Toggle variant="light" id="dropdown-basic" className="userGraphics" style={{overflow:'hidden', whiteSpace:'nowrap'}}>
               <div className="userLogGraphics">
                   <FaUser />
               </div>
               <h1 className="user-name">{user.username}</h1>
               </Dropdown.Toggle>
               <Dropdown.Menu style={{  backgroundColor: 'white', fontSize: '1.3rem', width:'230px', marginLeft:'50%'}}>
                   <Dropdown.Item style={{color: 'black', display:'flex', alignItems: 'center', gap: '10px'}} onClick={logOutSubmit}>
                       <FaSignOutAlt style={{fontSize: '1.5rem', color: 'var(--color-error)'}} />
                       Cerrar Sesión</Dropdown.Item>
               </Dropdown.Menu>
               </Dropdown>        
           </div>
           
            <hr className="lineStoreGraphics"></hr>

            <div style={{display:'flex'}}>
              <div style={{ width: '70%', marginTop: '3%', marginLeft: '5%' }}>
                

                {chartData ? (
                  <div>
                    <h2>{selectedChart}</h2>
                    <Bar data={chartData} />
                  </div>
                ) : (
                  <div>Loading...</div>
                )}
              </div>
              <div className="multiSelect" >
                <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">Select Chart</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectedChart}
                        label="Select Chart"
                        onChange={handleChange}
                      >
                        <MenuItem value={'productSales'}>Ventas Totales de cada producto</MenuItem>
                        <MenuItem value={'productSalesByDay'}>Ventas totales ultimos 7 dias</MenuItem>
                        <MenuItem value={'monthlySales'}>Ventas totales de cada mes</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
              </div>
                
           </div>
          
        </div>


    );
}

export default PageGraphics;