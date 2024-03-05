import React from "react";
import './SalePoint.css';
import { useForm } from 'react-hook-form';
import {useReactTable, getCoreRowModel, flexRender} from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { Modal , Dropdown, Form, Button } from 'react-bootstrap';
import { useAuth } from "../context/AuthContext";
import { useStore } from "../context/StoreContext";
import { useSale } from "../context/SaleContext";
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';


function SalePoint(){

    const {register, handleSubmit} = useForm();
    const { signout, user } = useAuth();

    const [showModalEmployee, setShowModalEmployee] = useState(false);
    const handleModalShowEmployee = () => setShowModalEmployee(true);
    const handleModalCloseEmployee = () => setShowModalEmployee(false);

    const { deleteProduct, editProduct, getProducts, createProduct, getProduct } = useStore();

    //////////////////////////////////////////////////////////////////////////
    //Añadiendo o eliminando productos al carro de compras
    const [dataShoppingCar, setDatashoppingCar] = useState([]);
    const onSubmit = handleSubmit(async (data) => {
        const result = await getProduct(data);
    
        const newProduct = {
            resultProductAmount: result.productAmount,
            resultProductName: result.productName,
            resultSalePrice: result.salePrice,
            resultID: result._id,
            resultPriceProvider: result.priceProvider,
            resultProductCode: result.productCode,
            cont: 1,

        };
    
        
        if (dataShoppingCar.length === 0) {
        // El carrito está vacío, agregar el producto con cantidad 1
            setDatashoppingCar([newProduct]);
        } else {
            // El carrito no está vacío, verificar si el producto ya está en el carrito
            const existingProductIndex = dataShoppingCar.findIndex(item => item.resultID === newProduct.resultID);

            if (existingProductIndex !== -1) {
                // El producto ya está en el carrito, aumentar la cantidad en 1
                setDatashoppingCar(prevData => {
                    const newData = prevData.map(item => {
                        if (item.resultID === newProduct.resultID) {
                            // Actualizar la cantidad del producto existente
                            return {
                                ...item,
                                cont: item.cont + 1
                            };
                        }
                        return item;
                    });
                    return newData;
                });
            } else {
                console.log("producto no existente");
                // El producto no está en el carrito, agregarlo con cantidad 1
                setDatashoppingCar(prevData => [...prevData, newProduct]);
            }
        }
 
    });

    const deleteProductShoppingCarButtonSubmit = (productID) => {
        // Buscar el índice del producto en el array
        const index = dataShoppingCar.findIndex(product => product.resultID === productID);
        
        if (index !== -1) {
            // Eliminar el producto del array
            const updatedShoppingCar = [...dataShoppingCar];
            updatedShoppingCar.splice(index, 1);
            
            // Actualizar el estado de dataShoppingCar
            setDatashoppingCar(updatedShoppingCar);
        }
    };
    
    const columnsShoppingCar = [
        {
            header: "Cantidad",
            accessorKey: 'cont'
        },
        {
            header: "Nombre",
            accessorKey: 'resultProductName'
        },
        {
            header: "Precio unitario",
            accessorKey: 'resultSalePrice'
        },
        
    ]

    const shoppingCar = useReactTable({
        data: dataShoppingCar,
        columns: columnsShoppingCar,
        getCoreRowModel: getCoreRowModel(),
    });

    //////////////////////////////////////////////////////////////////////////
    //Modal para agregar, editar o eliminar algun producto del almacen
    const [showModalProduct, setShowModalProduct] = useState(false);
    const handleModalShowProduct = () => setShowModalProduct(true);
    const handleModalCloseProduct = () => setShowModalProduct(false);

    const [selectedProduct, setSelectedProduct] = useState("");
    const editProductButtonImageSubmit = (row) => {
        setSelectedProduct(row);
    };
    const editProductModalSubmit = async (event) =>{
        event.preventDefault();
        const productName = event.target.productName.value;
        const productCode = event.target.productCode.value;
        const productAmount = event.target.productAmount.value;
        const priceProvider = event.target.priceProvider.value;
        const salePrice = event.target.salePrice.value;
        
        const editProductData = {
            productName,
            productCode,
            productAmount,
            priceProvider,
            salePrice,
          };
        await deleteProduct(selectedProduct.resultID);
        const result = await createProduct(editProductData);
        const updatedProducts = await getProducts();
        const modalProductData = updatedProducts.map(product => {
            const resultProductAmount = product.productAmount;
            const resultProductName = product.productName;
            const resultSalePrice = product.salePrice;
            const resultID = product._id;
            const resultPriceProvider = product.priceProvider;
            const resultProductCode = product.productCode;

            return {
                resultProductAmount,
                resultProductName,
                resultSalePrice,
                resultID,
                resultPriceProvider,
                resultProductCode
            };
        });
        
        setDataModalProduct(modalProductData);
        toast.success('Producto editado exitosamente');
        handleModalCloseEdit();
        
    }
    const deleteProductButtonSubmit = async (productID) => { 
        const isConfirmed = window.confirm('¿Estás seguro que quieres eliminar este producto?');

        if (isConfirmed) {
            // El usuario hizo clic en 'Aceptar' (Sí, estoy seguro)
            const result = await deleteProduct(productID);
            const updatedProducts = await getProducts();
            const modalProductData = updatedProducts.map(product => {
                const resultProductAmount = product.productAmount;
                const resultProductName = product.productName;
                const resultSalePrice = product.salePrice;
                const resultPriceProvider = product.priceProvider;
                const resultProductCode = product.productCode;
                const resultID = product._id;

                return {
                    resultProductAmount,
                    resultProductName,
                    resultSalePrice,
                    resultID,
                    resultPriceProvider,
                    resultProductCode,
                };
            });
        
        setDataModalProduct(modalProductData);
        toast.success('Producto eliminado');
        }
    };

    const addProductSubmit = async (event) => {
        event.preventDefault();
        const productName = event.target.productName.value;
        const productCode = event.target.productCode.value;
        const productAmount = event.target.productAmount.value;
        const priceProvider = event.target.priceProvider.value;
        const salePrice = event.target.salePrice.value;

        const addProductData = {
            productName,
            productCode,
            productAmount,
            priceProvider,
            salePrice,
          };

        const result = await createProduct(addProductData);
        const updatedProducts = await getProducts();
        const modalProductData = updatedProducts.map(product => {
            const resultProductAmount = product.productAmount;
            const resultProductName = product.productName;
            const resultSalePrice = product.salePrice;
            const resultID = product._id;
            const resultPriceProvider = product.priceProvider;
            const resultProductCode = product.productCode;

            return {
                resultProductAmount,
                resultProductName,
                resultSalePrice,
                resultID,
                resultPriceProvider,
                resultProductCode
            };
        });
        
        setDataModalProduct(modalProductData);
        event.target.reset();
        toast.success('Producto agregado exitosamente');
    };

    const [dataModalProduct, setDataModalProduct] = useState([]);

    const fetchDataModalProduct = async () => {
        try {
            const result = await getProducts();
            const modalProductData = result.map(product => ({
                resultProductAmount: product.productAmount,
                resultProductName: product.productName,
                resultSalePrice: product.salePrice,
                resultID: product._id,
                resultPriceProvider: product.priceProvider,
                resultProductCode: product.productCode
            }));
            setDataModalProduct(modalProductData);
        } catch (error) {
            console.error("Error al obtener datos:", error);
        }
    };
    const handleOpenModalAndFetchData = () => {
        handleModalShowProduct(); // Abre el modal
        fetchDataModalProduct(); // Obtiene los productos
    };

    const columnsProduct = [
        {
            header: "Cantidad",
            accessorKey: 'resultProductAmount'
        },
        {
            header: "Nombre",
            accessorKey: 'resultProductName'
        },
        {
            header: "Precio",
            accessorKey: 'resultSalePrice'
        },
    ]
    
    const tableAddEditDeleteProduct = useReactTable({
        data: dataModalProduct,  // Cambiado a 'data' en lugar de 'dataModalProduct'
        columns: columnsProduct,
        getCoreRowModel: getCoreRowModel(),
    });

//////////////////////////////////////////////////////////////////////////
    //Funcion para cerrar sesion
    const logOutSubmit = async () => {
        const result = await signout();
    };


//////////////////////////////////////////////////////////////////////////
//Modal para agregar empleados
    const [showModalEdit, setShowModalEdit] = useState(false);
    const handleModalShowEdit = () => setShowModalEdit(true);
    const handleModalCloseEdit = () => setShowModalEdit(false);

    const { signup, isAuthenticated, errors: registerErrors } = useAuth();
    const sendRegisterSubmit = async (event) => {
        event.preventDefault();
        const username = event.target.elements.username.value;
        const email = event.target.elements.email.value;
        const password = event.target.elements.password.value;
    
        const addEmployee = {
            username,
            email,
            password,
          };

        const result = await signup(addEmployee);
        console.log(result);
    };

    ////////////////////////////////////////////////////////////////////////
    //Seccion para guardar la venta realizada

    const [showModalPayCash, setShowModalPayCash] = useState(false);
    const handleModalShowPayCash = () => setShowModalPayCash(true);
    const handleModalClosePayCash = () => setShowModalPayCash(false);  

    const {createSale} = useSale();
    const [totalPrice, setTotalPrice] = useState(0); // Estado para almacenar el monto total de la venta
    const [turned, setTurned] = useState(0);

    const calculatedTurned = (paid, totalp) => {
        const result = paid - totalp;
        console.log(result);
    
        if (result >= 0) { // Utilizamos result en lugar de turned para verificar si alcanza
            setTurned(result);
            confirmSale();
        } else {
            toast.error("Dinero inferior al monto total del carrito");
        }
    }


    const openModalPaid = async () => {
        if (dataShoppingCar.length === 0) {
            toast.error('El carrito de compras está vacío');
            return;
        }

        // Calcula el monto total de la venta
        const total = dataShoppingCar.reduce((total, product) => total + (product.resultSalePrice * product.cont), 0);
        setTotalPrice(total);

        handleModalShowPayCash();
    };

    const handleCashPayment = (amount) => {
        calculatedTurned(amount, totalPrice); 
        
    };
    const [cashAmount, setCashAmount] = useState("");
    const handleCashPaymentManual = (e) => {
        e.preventDefault(); // Evita que se recargue la página al enviar el formulario
        calculatedTurned(cashAmount, totalPrice);
        setCashAmount("");
    };

    const confirmSale = async () => {

        const sale = {
            products: dataShoppingCar.map(product => ({
                productName: product.resultProductName,
                productCode: product.resultProductCode,
                saleAmount: product.cont.toString(),
                priceProvider: product.resultPriceProvider,
                salePrice: product.resultSalePrice,
                saleTotal: totalPrice.toString(),
            })),
        };

        try {
            const resultSale = await createSale(sale);
            toast.success('Venta realizada');
            handleModalClosePayCash();
            handleModalShowSaleSuccesful();
            setDatashoppingCar([]);
        } catch (error) {
            console.error(`Error creating sale: ${error.message}`);
        }
       
    };
    //Modal para mostrar que la venta fue un exito
    const [showModalSaleSuccesful, setShowModalSaleSuccesful] = useState(false);
    const handleModalShowSaleSuccesful = () => setShowModalSaleSuccesful(true);
    const handleModalCloseSaleSuccesful = () => setShowModalSaleSuccesful(false);

    useEffect(() => {
        let timer;
        if (showModalSaleSuccesful) {
            timer = setTimeout(() => {
                handleModalCloseSaleSuccesful();
            }, 5000); // 5000 milisegundos = 5 segundos
        }

        return () => {
            clearTimeout(timer);
        };
    }, [showModalSaleSuccesful]);

    return(
        <div className="bigContainer">
           
            <img
                    src="https://cloud.alphanetcurico.com/s/WgTq9kGcCfCceYs/download?path=%2FImagen%20varias&files=Avatar_upscayl_4x_realesrgan-x4plus.png"
                    alt="Logo"
                    className="logo-home"
                />
            
            <div className="headContainer">

                
                <h1>Alpha<strong >Store</strong></h1>
                <Dropdown>
                <Dropdown.Toggle variant="light" id="dropdown-basic" style={{width:'80%', marginTop:'15%'}}>
                    <img
                    src="https://cdn.icon-icons.com/icons2/1090/PNG/512/settings_78352.png"
                    className="Configurate"
                    />
                </Dropdown.Toggle>

                <Dropdown.Menu style={{  backgroundColor: 'white', fontSize: '1.3rem', width:'230px'}}>
                    <Dropdown.Item onClick={handleOpenModalAndFetchData} style={{color: 'black', borderBottom: '1px solid #212338', display:'flex'}}>
                        <img
                        src="https://cdn.icon-icons.com/icons2/3653/PNG/512/market_shop_ecommerce_delivery_product_icon_228243.png"
                        className="product"
                        />
                        Gestionar productos</Dropdown.Item>
                    <Dropdown.Item onClick={() => { handleModalShowEmployee(); }} style={{color: 'black', borderBottom: '1px solid #212338', paddingTop:'3%', paddingBottom:'3%', display:'flex'}}>
                        <img
                        src="https://cdn.icon-icons.com/icons2/2744/PNG/512/employee_person_business_teamwork_businessman_icon_175923.png"
                        className="product"
                        />
                        Gestionar empleados</Dropdown.Item>
                        <Dropdown.Item
                            as={Link}
                            to='/graphicspage'
                            style={{ color: 'black', display: 'flex' }}
                            >
                            <img
                                src="https://cdn.icon-icons.com/icons2/62/PNG/128/blue_chartstats_until_azu_12519.png"
                                className="product"
                                alt="Gráficos"
                            />
                            Gráficos
                        </Dropdown.Item>
                </Dropdown.Menu>
                </Dropdown>
                
                
                <Modal show={showModalProduct} onHide={handleModalCloseProduct} size='xl'>
                    <Modal.Header closeButton>
                    <Modal.Title style={{fontSize:'30px'}} className="modalLeter">Gestiona tus productos</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="modalLeter">
                        <div style={{maxWidth:'100%', display:'flex'}}>
                            <div className="gestionProdcutContainer">
                                <Form style={{textAlign:'center'}} onSubmit={addProductSubmit}>
                                    <Form.Group controlId="formNombre">
                                    <Form.Label className="modalLeter" style={{marginBottom:'3%'}}>Nombre del producto</Form.Label>
                                    <Form.Control className="modalLeter" style={{textAlign:'center'}} type="text" name="productName" required />
                                    </Form.Group>
                                    <Form.Group controlId="formCodigo">
                                    <Form.Label className="modalLeter" style={{marginTop:'5%',marginBottom:'3%'}}>Código de barras</Form.Label>
                                    <Form.Control className="modalLeter" style={{textAlign:'center'}} type="text"  name="productCode" required />
                                    </Form.Group>

                                    <Form.Group controlId="formCantidad">
                                    <Form.Label className="modalLeter" style={{marginTop:'5%',marginBottom:'3%'}}>Cantidad</Form.Label>
                                    <Form.Control className="modalLeter" style={{textAlign:'center'}} type="number" name="productAmount" required />
                                    </Form.Group>
                                    <Form.Group controlId="formProveedor">
                                    <Form.Label className="modalLeter" style={{marginTop:'5%',marginBottom:'3%'}}>Precio del proveedor</Form.Label>
                                    <Form.Control className="modalLeter" style={{textAlign:'center'}} type="number" name="priceProvider" required />
                                    </Form.Group>
                                    <Form.Group controlId="formVenta">
                                    <Form.Label className="modalLeter" style={{marginTop:'5%',marginBottom:'3%'}}>Precio de venta</Form.Label>
                                    <Form.Control className="modalLeter" style={{textAlign:'center'}} type="number" name="salePrice" required />
                                    </Form.Group>

                                    <Button variant="primary" type="submit" style={{marginTop:'10%', backgroundColor:'#344a57', maxWidth:'60% ', marginLeft: '20%'}} >
                                    Agregar producto
                                    </Button>
                                    
                                </Form>
                            </div>
                            <table className="tableStyle">
                            <thead className="headTableModal">
                                {
                                    tableAddEditDeleteProduct.getHeaderGroups().map((headerGroup, j) =>(
                                        <tr key={j} >
                                            {
                                                headerGroup.headers.map((headers, j) =>(
                                                    <th key={j}>
                                                        {headers.column.columnDef.header}

                                                    </th>
                                                ))
                                            }
                                            
                                        </tr>
                                    ))
                                }
                            </thead>
                            <tbody>
                                {
                                    tableAddEditDeleteProduct.getRowModel().rows.map((row, j) =>(
                                        <tr key={j} >
                                            {row.getVisibleCells().map((cell,j) =>(
                                                <td key={j} className="celdasTableModal">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </td>
                                            ))}
                                            <td className="celdasTableModal">
                                                <div className="lastColumn">
                                                    <button style={{width: '30%', height: '25px', borderRadius:'10px', marginLeft:'15%'}} onClick={() => {
                                                        console.log(row.original.resultID)
                                                        deleteProductButtonSubmit(row.original.resultID);
                                                        
                                                    }}>
                                                        
                                                    <img
                                                        src="https://cdn.icon-icons.com/icons2/17/PNG/256/recyclebinfilled_recycling_full_garbage_1993.png"
                                                        alt="Imagen"
                                                        style={{borderRadius: '5px'}}
                                                    />
                                                    
                                                    </button>
                                                    <button style={{width: '30%', height: '25px', borderRadius:'5px', marginLeft:'15%'}} className="hov" onClick={() =>{
                                                        editProductButtonImageSubmit(row.original);
                                                        handleModalShowEdit();
                                                        
                                                    }}>
                                                    <img
                                                        src="https://cdn.icon-icons.com/icons2/1786/PNG/128/file-edit_114433.png"
                                                        
                                                        
                                                    />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        </div>
                    </Modal.Body>
                </Modal>
                <Modal show={showModalEdit} onHide={handleModalCloseEdit}>
                    <Modal.Header closeButton>
                        <Modal.Title style={{fontSize:'30px'}} className="modalLeter">Editar Producto</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form style={{textAlign:'center'}} onSubmit={editProductModalSubmit}>
                            <Form.Group controlId="formNombreProduct">
                            <Form.Label className="modalLeter" style={{marginBottom:'3%'}}>Nombre del producto</Form.Label>
                            <Form.Control className="modalLeter" style={{textAlign:'center'}} type="text" placeholder={selectedProduct.resultProductName} name="productName"  />
                            </Form.Group>

                            <Form.Group controlId="formCodigo">
                            <Form.Label className="modalLeter" style={{marginTop:'5%',marginBottom:'3%'}}>Codigo de barras</Form.Label>
                            <Form.Control className="modalLeter" style={{textAlign:'center'}} type="text" placeholder={selectedProduct.resultProductCode} name="productCode"  />
                            </Form.Group>

                            <Form.Group controlId="formCantidad">
                            <Form.Label className="modalLeter" style={{marginTop:'5%',marginBottom:'3%'}}>Cantidad</Form.Label>
                            <Form.Control className="modalLeter" style={{textAlign:'center'}} type="text" placeholder={selectedProduct.resultProductAmount} name="productAmount"  />
                            </Form.Group>

                            <Form.Group controlId="formProveedor">
                            <Form.Label className="modalLeter" style={{marginTop:'5%',marginBottom:'3%'}}>Precio del Proveedor</Form.Label>
                            <Form.Control className="modalLeter" style={{textAlign:'center'}} type="text" placeholder={selectedProduct.resultPriceProvider} name="priceProvider"  />
                            </Form.Group>

                            <Form.Group controlId="formVenta">
                            <Form.Label className="modalLeter" style={{marginTop:'5%',marginBottom:'3%'}}>Precio de venta</Form.Label>
                            <Form.Control className="modalLeter" style={{textAlign:'center'}} type="text" placeholder={selectedProduct.resultSalePrice} name="salePrice"  />
                            </Form.Group>

                            <Button variant="primary" type="submit" style={{marginTop:'10%', backgroundColor:'#344a57'}}>
                            Editar
                            </Button>
                            
                        </Form>
                        
                    </Modal.Body>
                </Modal>
                <Modal show={showModalEmployee} onHide={handleModalCloseEmployee}>
                    <Modal.Header closeButton>
                    <Modal.Title style={{fontSize:'30px'}} className="modalLeter">Gestionar empleados</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form style={{textAlign:'center'}} onSubmit={sendRegisterSubmit}>
                            <Form.Group controlId="formNombre">
                            <Form.Label className="modalLeter" style={{marginBottom:'3%'}}>Nombre</Form.Label>
                            <Form.Control className="modalLeter" style={{textAlign:'center'}} type="text" placeholder="Ingresa nombre" name="username" required />
                            </Form.Group>

                            <Form.Group controlId="formEmail">
                            <Form.Label className="modalLeter" style={{marginTop:'5%',marginBottom:'3%'}}>Email</Form.Label>
                            <Form.Control className="modalLeter" style={{textAlign:'center'}} type="email" placeholder="Ingresa email" name="email" required />
                            </Form.Group>

                            <Form.Group controlId="formContraseña">
                            <Form.Label className="modalLeter" style={{marginTop:'5%',marginBottom:'3%'}}>Contraseña</Form.Label>
                            <Form.Control className="modalLeter" style={{textAlign:'center'}} type="password" placeholder="Ingresa contraseña" name="password" required />
                            </Form.Group>

                            <Button variant="primary" type="submit" style={{marginTop:'10%', backgroundColor:'#344a57'}}>
                            Enviar
                            </Button>
                            
                        </Form>
                    </Modal.Body>
                </Modal>
                
                <Dropdown>
                <Dropdown.Toggle variant="light" id="dropdown-basic" className="user" style={{overflow:'hidden', whiteSpace:'nowrap'}}>
                <img
                    src="https://cdn.icon-icons.com/icons2/632/PNG/512/user_icon-icons.com_57997.png"
                    className="userLog"
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

            <hr className="lineStore"></hr>
            <div className="options-head">
            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', alignItems: 'center' }}>
                <input
                    className="findInput"
                    placeholder="Código de barras del producto"
                    {...register("producto")} // Registra el input con el nombre "producto"
                    required
                ></input>
                <button className="findButton">Agregar al carrito</button>
            </form>
                
                <button className="closeBox">Cerrar Caja</button>
                
            </div>

            <div className="cont">
                <div className="trolleyContainer">
                    {shoppingCar.getRowModel().rows.length === 0 ? (
                        <div>
                            <img
                                src="https://cdn.icon-icons.com/icons2/727/PNG/512/si-duo-trolley-down_icon-icons.com_62691.png"
                                alt="shoppingCar"
                                style={{ opacity: '30%', marginTop:'20%', marginLeft:'20%' }}
                            />
                        </div>
                    ) : (
                        <table className="shoppingTableStyle">
                            <thead className="headTableShoppingCar">
                                {shoppingCar.getHeaderGroups().map((headerGroup, i) => (
                                    <tr key={i}>
                                        {headerGroup.headers.map((headers, i) => (
                                            <th key={i}>
                                                {headers.column.columnDef.header}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody>
                                {shoppingCar.getRowModel().rows.map((row, i) => (
                                    <tr key={i}>
                                        {row.getVisibleCells().map((cell, j) => (
                                            <td key={j} className="celdasTableShoppingCar">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                        <td >
                                            <div className="lastColumn">
                                                <button style={{ width: '50%', height: '25px', borderRadius: '10px', marginLeft: '25%' }} onClick={() => {
                                                    console.log(row.original.resultID);
                                                    deleteProductShoppingCarButtonSubmit(row.original.resultID);
                                                }}>
                                                    <img
                                                        src="https://cdn.icon-icons.com/icons2/17/PNG/256/recyclebinfilled_recycling_full_garbage_1993.png"
                                                        alt="Eliminar"
                                                        style={{ borderRadius: '5px' }}
                                                    />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
                <div className="totalContainer">
                    <h1 style={{fontSize:'350%'}}>Total:</h1>

                    
                    <h1 style={{fontSize:'500%', }}>
                        {dataShoppingCar.reduce((total, product) => total + (product.resultSalePrice * product.cont), 0)}
                    </h1>
                </div>
                
            
                <div className="payButtonWrapper">
                    <div className="payButtonContainer">
                        <button className="payButton" onClick={openModalPaid}>
                            <img
                                src="https://cdn.icon-icons.com/icons2/2427/PNG/512/cash_icon_147027.png"
                                className="cashImage"
                            />
                            <span>Pago con efectivo</span>
                        </button>
                        <Modal show={showModalPayCash} onHide={handleModalClosePayCash}>
                            <Modal.Header closeButton>
                            <Modal.Title style={{fontSize:'30px'}} className="modalLeter">Pago</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <h1 className="estandarLetter" style={{textAlign:"center", fontSize:'2rem'}}>Seleccione opción rápida</h1>
                                <Button variant="primary" type="button" onClick={() => handleCashPayment(1000)} className="estandarLetter" style={{fontWeight:"bold", marginTop:'5%', marginBottom:"5%", marginLeft:"1.3%", backgroundColor:'#344a57'}}>
                                $ 1.000
                                </Button>
                                <Button variant="primary" type="button" onClick={() => handleCashPayment(2000)} className="estandarLetter" style={{fontWeight:"bold", marginTop:'5%', marginBottom:"5%", marginLeft:"1.3%", backgroundColor:'#344a57'}}>
                                $ 2.000
                                </Button>
                                <Button variant="primary" type="button" onClick={() => handleCashPayment(5000)} className="estandarLetter" style={{fontWeight:"bold", marginTop:'5%', marginBottom:"5%", marginLeft:"1.3%", backgroundColor:'#344a57'}}>
                                $ 5.000
                                </Button>
                                <Button variant="primary" type="button" onClick={() => handleCashPayment(10000)} className="estandarLetter" style={{fontWeight:"bold", marginTop:'5%', marginBottom:"5%", marginLeft:"1.3%", backgroundColor:'#344a57'}}>
                                $ 10.000
                                </Button>
                                <Button variant="primary" type="button" onClick={() => handleCashPayment(20000)} className="estandarLetter" style={{fontWeight:"bold", marginTop:'5%', marginBottom:"5%", marginLeft:"1.3%", backgroundColor:'#344a57'}}>
                                $ 20.000
                                </Button>
                                <h1 className="estandarLetter" style={{textAlign:"center", fontSize:'2rem'}}>O ingrese dinero recibido</h1>
                                <Form style={{textAlign:'center'}}>
                                    <Form.Group controlId="payCash">
                                        <Form.Control
                                            className="modalLeter"
                                            style={{textAlign:'center'}}
                                            type="text"
                                            placeholder="Ingresa monto"
                                            name="paycash"
                                            value={cashAmount}
                                            onChange={(e) => setCashAmount(e.target.value)}
                                            required
                                        />
                                    </Form.Group>

                                    <Button variant="primary" type="submit" onClick={handleCashPaymentManual} style={{marginTop:'10%', backgroundColor:'#344a57'}}>
                                        Enviar
                                    </Button>
                                </Form>
                            </Modal.Body>
                        </Modal>
                        
                        <Modal show={showModalSaleSuccesful} onHide={handleModalCloseSaleSuccesful}>
                            <Modal.Header closeButton>
                                <Modal.Title style={{fontSize:'30px'}} className="modalLeter">¡Gracias por su compra!</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <h1 className="estandarLetter" style={{textAlign:'center'}}>Su vuelto es de</h1>
                                <h1 className="estandarLetter" style={{textAlign:'center', fontSize:'4rem'}}>${turned}</h1>
                            </Modal.Body>
                        </Modal>
                        <button className="payButton">
                            <img
                                src="https://cdn.icon-icons.com/icons2/2104/PNG/512/credit_card_icon_129105.png"
                                className="cardImage"
                            />
                            <span>Pago con tarjeta</span>
                        </button>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default SalePoint;