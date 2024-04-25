import "./PageGraphics.css"
import { Dropdown } from 'react-bootstrap';
import { useAuth } from "../context/AuthContext";
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { useSale } from "../context/SaleContext";
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { Link } from 'react-router-dom';
import logoImage from "../components/logo.jpg";
import { Calendar, DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // Estilos de react-date-range
import 'react-date-range/dist/theme/default.css'; // Tema de estilos de react-date-range
import { CSSTransition } from 'react-transition-group';

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

    ///////////////////////////////////////////////////////////////////////////
    //Obtencion por cantidad de productos vendidos
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


    ///////////////////////////////////////////////////////////////////////////////
    //obtencion dependiendo la cantidad total vendida
    const getTotalSalesByDay = (sales) => {
      const productSalesByDay = {};
      const today = new Date();
      const lastSevenDays = new Date(today);
      lastSevenDays.setDate(today.getDate() - 6); // Restar 6 días para obtener los últimos 7 días
    
      sales.forEach((sale) => {
        const saleDate = new Date(sale.createdAt);
        if (saleDate >= lastSevenDays && saleDate <= today) {
          const day = `${saleDate.getDate()}/${saleDate.getMonth() + 1}`;
          const saleTotal = sale.products.reduce((total, product) => total + parseInt(product.saleTotal), 0);
          
          if (day in productSalesByDay) {
            productSalesByDay[day] += saleTotal;
          } else {
            productSalesByDay[day] = saleTotal;
          }
        }
        
      });
    
      const labels = Object.keys(productSalesByDay);
      const data = Object.values(productSalesByDay);
    
      return { labels, data };
    };
    const getTotalSalesByMonth = (sales) => {
      const productSalesByMonth = {};
    
      sales.forEach((sale) => {
        const saleDate = new Date(sale.createdAt);
        const monthYear = `${saleDate.getMonth() + 1}/${saleDate.getFullYear()}`;
        const saleTotal = sale.products.reduce((total, product) => total + parseInt(product.saleTotal), 0);
    
        if (monthYear in productSalesByMonth) {
          productSalesByMonth[monthYear] += saleTotal;
        } else {
          productSalesByMonth[monthYear] = saleTotal;
        }
      });
    
      const labels = Object.keys(productSalesByMonth);
      const data = Object.values(productSalesByMonth);
    
      return { labels, data };
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
    const [selectedChart, setSelectedChart] = useState('productSales');
    const [selectedChartSales, setSelectedChartSales] = useState(''); // Seleccionar 'productSales' por defecto al cargar la página
    const [chartData, setChartData] = useState(null);
    
    const handleChange = (event) => {
      setSelectedChart(event.target.value);
    };
    const handleChangeSales = (event) => {
      setSelectedChartSales(event.target.value);
    };

    useEffect(() => {
      let labels, data;
      switch (selectedChartSales) {
        
        case 'totalSalesByDay':
          const totalSalesByDay = getTotalSalesByDay(dataSales);
          labels = totalSalesByDay.labels;
          data = totalSalesByDay.data;
          break;
        case 'totalSalesByMonth':
          const totalSalesByMonth = getTotalSalesByMonth(dataSales);
          labels = totalSalesByMonth.labels;
          data = totalSalesByMonth.data;
          break;
        default:
          labels = () => '';
          data = [];
      }
      const chartData = finalData(labels, data);
      
      setChartData(chartData);
    }, [dataSales, selectedChartSales]);

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
        case 'totalSalesByDay':
          const totalSalesByDay = getTotalSalesByDay(dataSales);
          labels = totalSalesByDay.labels;
          data = totalSalesByDay.data;
          break;
        case 'totalSalesByMonth':
          const totalSalesByMonth = getTotalSalesByMonth(dataSales);
          labels = totalSalesByMonth.labels;
          data = totalSalesByMonth.data;
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
      
      setChartData(chartData);
    }, [dataSales, selectedChart]);
    
    ///////////////////////////////////////////////////////////////////////////
    //Seccion para despliegue menu lateral derecho

    const [showQuickCharts, setShowQuickCharts] = useState(true);
    const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

    const toggleCharts = () => {
      setShowQuickCharts(!showQuickCharts);
      if (showAdvancedOptions) {
        setShowAdvancedOptions(false);
      }
    };

    const toggleChartsAdvancedOptions = () => {
      setShowAdvancedOptions(!showAdvancedOptions);
      if (showQuickCharts) {
        setShowQuickCharts(false);
      }
    };
    ////////////////////////////////////////////////////////////
    // Seccion para los calendarios

    const [showCalendar, setShowCalendar] = useState(true);
    const today = new Date();
    const toggleCalendar = () => {
        setShowCalendar(!showCalendar);
    };
    
    const [selectedDates, setSelectedDates] = useState({ startDate: null, endDate: null });
    const handleSelectDate = (ranges) => {
      
      const { startDate, endDate } = ranges.range1;
      
      // Verificar si solo se ha seleccionado un día
      
      setSelectedDates({
        startDate: new Date(ranges.range1.startDate),
        endDate: new Date(ranges.range1.endDate),
      });
      
    };
    useEffect(() => {
      if (selectedDates.startDate && selectedDates.endDate) {
        const { labels, data } = getTotalSalesByDayCalendar(dataSales, selectedDates.startDate, selectedDates.endDate);
        const chartData = finalData(labels, data);
        setChartData(chartData);
      }

      
    }, [selectedDates.endDate]);

    //////////////////////////////////////////////////////////////////////////
    //Busqueda por rango de fecha seleccionado por el usuario

    const getTotalSalesByDayCalendar = (sales, startDate, endDate) => {
      const productSalesByDay = {};
      const endDateWithLastHour = new Date(endDate);
      endDateWithLastHour.setHours(23, 59, 59, 999);
      sales.forEach((sale) => {
        const saleDate = new Date(sale.createdAt);
        if (saleDate >= startDate && saleDate <= endDateWithLastHour) {
          const day = `${saleDate.getDate()}/${saleDate.getMonth() + 1}`;
          const saleTotal = sale.products.reduce((total, product) => total + parseInt(product.saleTotal), 0);
    
          if (day in productSalesByDay) {
            productSalesByDay[day] += saleTotal;
          } else {
            productSalesByDay[day] = saleTotal;
          }
        }
      });
    
      const labels = Object.keys(productSalesByDay);
      const data = Object.values(productSalesByDay);
    
      return { labels, data };
    };

    

    return(
        <div className="fullContainerGraphicsPage">
                      
               
           <div className="headContainerGraphics"> 
                <div style={{ marginLeft:'-2.2%'}}>
                    <img
                            src={logoImage}
                            alt="Logo"
                            className="logo-home"
                        />         
                    <h1 className="estandarLetter" style={{marginLeft:'15%'}}>Alpha<strong >Store</strong></h1>    
                </div> 
                <div style={{marginLeft:'70%', marginTop:'-0.5%', width:'0px'}}>
                  <button className="buttonBack">
                  <img
                      src="https://cdn.icon-icons.com/icons2/1134/PNG/512/1486348819-back-backwards-repeat-arrows-arrow-blue_80473.png"
                      alt="goBack"
                      style={{maxWidth:'30%', marginTop:'-4%', marginLeft:'0%'}}
                  /> 
                    <Link to= "/salepoint" style={{marginTop:'2%',marginLeft:'15%', fontSize:'1.8rem',  textDecoration: 'none', color:'#212338'}} >Atrás</Link> 
                  </button>
                </div>      
           </div>
           
            <hr className="lineStoreGraphics"></hr>

            <div style={{display:'flex'}}>
              <div style={{ width: '70%', marginTop: '3%', marginLeft: '5%' }}>
                

                {chartData ? (
                  <div>
                    <Bar data={chartData} />
                  </div>
                ) : (
                  <div>Loading...</div>
                )}
              </div>
              <div className="containerRight">
                <div style={{ display: 'flex', paddingTop: '5%' }}>
                  <h4
                    style={{ cursor: 'pointer', marginLeft: '20%' }}
                    onClick={toggleCharts}
                  >
                    <strong>Gráficos rápidos</strong>
                  </h4>
                  <img
                    src="https://cdn.icon-icons.com/icons2/1674/PNG/512/arrowheaddown_110942.png"
                    style={{
                      cursor: 'pointer',
                      maxWidth: '10%',
                      maxHeight: '30px',
                      marginTop: '0%',
                      marginLeft: '10%',
                      transform: showQuickCharts ? 'rotate(0deg)' : 'rotate(-180deg)',
                      transition: 'transform 0.3s ease-in-out',
                    }}
                    onClick={toggleCharts}
                  />
                </div>

                <div
                  className="chartsContainer"
                  style={{
                    height: showQuickCharts ? 'auto' : '0',
                    overflow: 'hidden',
                    transition: 'height 0.3s ease-in-out',
                    animation: showQuickCharts ? 'fadeIn 0.1s forwards' : 'fadeOut 0.1s forwards',
                  }}
                >
                  {/* Contenido de las Box */}
                  <h6 style={{ marginLeft: '5%', marginTop: '5%' }}>
                    Graficar por cantidad de productos vendidos
                  </h6>
                  <div className="multiSelect">
                    <Box sx={{ minWidth: 120 }}>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Seleccione</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={selectedChart}
                          label="Select Chart"
                          onChange={handleChange}
                        >
                          <MenuItem value={'productSales'}>
                            Ventas Totales de cada producto
                          </MenuItem>
                          <MenuItem value={'productSalesByDay'}>
                            Ventas totales últimos 7 días
                          </MenuItem>
                          <MenuItem value={'monthlySales'}>
                            Ventas totales de cada mes
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </div>
                  <h6 style={{ marginLeft: '5%', marginTop: '5%' }}>
                    Graficar según ganancias totales
                  </h6>
                  <div className="multiSelect">
                    <Box sx={{ minWidth: 120 }}>
                      <FormControl fullWidth>
                        
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={selectedChartSales}
                          label="Select Chart"
                          onChange={handleChangeSales}
                        >
                          <MenuItem value={'totalSalesByDay'}>
                            Ganancias totales últimos 7 días
                          </MenuItem>
                          <MenuItem value={'totalSalesByMonth'}>
                            Ganancias totales por mes
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </div>
                </div>

                <div style={{ display: 'flex', marginTop:'5%' }}>
                  <h4
                    style={{ cursor: 'pointer', marginLeft: '15%' }}
                    onClick={toggleChartsAdvancedOptions}
                  >
                    <strong>Opciones avanzadas</strong>
                  </h4>
                  <img
                    src="https://cdn.icon-icons.com/icons2/1674/PNG/512/arrowheaddown_110942.png"
                    style={{
                      cursor: 'pointer',
                      maxWidth: '10%',
                      maxHeight: '30px',
                      marginTop: '0%',
                      marginLeft: '2%',
                      transform: showAdvancedOptions ? 'rotate(0deg)' : 'rotate(-180deg)',
                      transition: 'transform 0.3s ease-in-out',
                    }}
                    className="animation"
                    onClick={toggleChartsAdvancedOptions}
                  />
                </div>

                {showAdvancedOptions && (
                  <div >
                    <button onClick={toggleCalendar} style={{marginLeft:'30%', marginTop:'5%', marginBottom:'5%'}}>Seleccionar fecha</button>
                    {showCalendar && (
                      <div className="calendar-container">
                        <DateRangePicker
                          ranges={[{ startDate: selectedDates.startDate, endDate: selectedDates.endDate }]}
                          onChange={handleSelectDate}
                          direction="horizontal"
                          maxDate={today}
                        />
                      </div>
                    )}
                  </div>
                )}

              

                
              </div>
              
           </div>
          
        </div>


    );
}

export default PageGraphics;