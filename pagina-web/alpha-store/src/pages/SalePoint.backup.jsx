import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Avatar,
    Menu,
    MenuItem,
    TextField,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    Card,
    CardContent,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Divider,
    ListItemIcon,
    ListItemText,
    InputAdornment,
    Fab,
    Tooltip,
    Badge,
    Stack,
} from '@mui/material';
import {
    Person,
    Inventory,
    PeopleAlt,
    BarChart,
    Logout,
    ShoppingCart,
    Delete,
    Edit,
    Add,
    Remove,
    Payments,
    CreditCard,
    Search,
    CheckCircle,
    Close as CloseIcon,
} from '@mui/icons-material';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import { ToastContainer, toast } from 'react-toastify';
import { useAuth } from "../context/AuthContext";
import { useStore } from "../context/StoreContext";
import { useSale } from "../context/SaleContext";
import logoImage from "../components/logo.jpg";

function SalePoint() {
    const navigate = useNavigate();
    const { signout, user } = useAuth();
    const { deleteProduct, getProducts, createProduct, getProduct } = useStore();
    const { createSale } = useSale();

    // Estados
    const [totalSalesAmount, setTotalSalesAmount] = useState('');
    const [dataShoppingCar, setDatashoppingCar] = useState([]);
    const [barcode, setBarcode] = useState('');
    const [auxStorage, setAuxStorage] = useState([]);
    const [dataModalProduct, setDataModalProduct] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);
    const [turned, setTurned] = useState(0);
    const [cashAmount, setCashAmount] = useState("");
    const [startingAmount, setStartingAmount] = useState('');

    // Estados para menús y modales
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [showModalInit, setShowModalInit] = useState(false);
    const [showModalProduct, setShowModalProduct] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [showModalEmployee, setShowModalEmployee] = useState(false);
    const [showModalPayCash, setShowModalPayCash] = useState(false);
    const [showModalSaleSuccesful, setShowModalSaleSuccesful] = useState(false);

    // Estados para formularios
    const [productForm, setProductForm] = useState({
        productName: '',
        productCode: '',
        productAmount: '',
        priceProvider: '',
        salePrice: ''
    });
    const [employeeForm, setEmployeeForm] = useState({
        username: '',
        email: '',
        password: ''
    });
    

    useEffect(() => {
        window.addEventListener('keydown', handleBarcodeScan);
        return () => {
            window.removeEventListener('keydown', handleBarcodeScan);
        };
    }, []);
    
    let tempBarcode = '';
    
    const handleBarcodeScan = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            
            onSubmit({ producto: tempBarcode });
            tempBarcode = ''; // Reinicia tempBarcode después de enviar
        } else {
            tempBarcode += e.key;
        }
    };
    const [auxStorage, setAuxStorage] = useState([]); 
    const updateProductStorage = async () => {
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
    
        // Recorrer cada producto vendido en 'sale'
        sale.products.forEach(soldProduct => {
            // Buscar el producto correspondiente en 'auxStorage'
            const productInStorage = auxStorage.find(product => product.resultProductCode === soldProduct.productCode);
            
            if (productInStorage) {
                // Restar la cantidad vendida de la cantidad en 'auxStorage'
                productInStorage.resultProductAmount -= parseInt(soldProduct.saleAmount);
                
            }
        });
    
        // Actualizar el estado 'auxStorage' con los productos actualizados
        setAuxStorage([...auxStorage]);
        

        auxStorage.forEach(async (product) => {
            
            const productName = product.resultProductName;
            const productCode = product.resultProductCode;
            const productAmount = product.resultProductAmount.toString();
            const priceProvider = product.resultPriceProvider;
            const salePrice = product.resultSalePrice;

            const editProduct = {
                productName,
                productCode,
                productAmount,
                priceProvider,
                salePrice,
            };
            
            await deleteProduct(product.resultID);
            const result = await createProduct(editProduct);
            
        });
        
    };
    
    const onSubmit = async (data) => {
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
        

        const existingProductIndex = dataShoppingCar.findIndex(item => item.resultID === newProduct.resultID);
    
        if (existingProductIndex !== -1) {
            // Si el producto ya está en el carrito, incrementa su contador
            const updatedShoppingCar = [...dataShoppingCar];
            updatedShoppingCar[existingProductIndex].cont++;
            setDatashoppingCar(updatedShoppingCar);
        } else {
            // Si el producto no está en el carrito, agrégalo
            setAuxStorage(prevData => {
                // Resto del código para agregar un nuevo producto
                return [...prevData, newProduct];
              });
            setDatashoppingCar(prevData => {
                // Resto del código para agregar un nuevo producto
                return [...prevData, newProduct];
              });
        }
    };
    const onSubmitLess = async (data) => {
        
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
        

        const existingProductIndex = dataShoppingCar.findIndex(item => item.resultID === newProduct.resultID);
        if (existingProductIndex !== -1) {
            // Si el producto ya está en el carrito, decrementa su contador
            const updatedShoppingCar = [...dataShoppingCar];
            updatedShoppingCar[existingProductIndex].cont--;
            
            if (updatedShoppingCar[existingProductIndex].cont === 0) {
                deleteProductShoppingCarButtonSubmit(newProduct.resultID);
            }else{
                setDatashoppingCar(updatedShoppingCar);
            }
        
            
        } else {
            // Si el producto no está en el carrito, agrégalo
            setDatashoppingCar(prevData => {
                // Resto del código para agregar un nuevo producto
                return [...prevData, newProduct];
            });
        }
    };

    useEffect(() => {
        
      }, [dataShoppingCar]);
      
    const deleteProductShoppingCarButtonSubmit = (productID) => {
        // Buscar el índice del producto en el array
        console.log(productID)
        const index = dataShoppingCar.findIndex(product => product.resultID === productID);
        console.log(index)
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
    //////////////////////////////////////////////////////////////////////////////////
    //Guardar lo que captura el lector
    
      

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
        localStorage.removeItem('totalSalesAmount'); // Eliminar totalSalesAmount de localStorage
        setTotalSalesAmount('');
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
        
    
        if (result >= 0) { // Utilizamos result en lugar de turned para verificar si alcanza
            setTurned(result);
            updateProductStorage();
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
            setAuxStorage([]);
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

    ////////////////////////////////////////////////////////////////////////
    //Modal para obtener monto inicial de la caja

    const [showModalInit, setShowModalInit] = useState(false);
    const [startingAmount, setStartingAmount] = useState('');
    useEffect(() => {
        setShowModalInit(true);
      }, []);
      useEffect(() => {
        const totalSalesAmountFromStorage = localStorage.getItem('totalSalesAmount');
        if (totalSalesAmountFromStorage) {
          setTotalSalesAmount(totalSalesAmountFromStorage);
          
        }
      }, []);
    
      const saveModalStartingAmount = (e) => {
        e.preventDefault();
        setTotalSalesAmount(startingAmount);
        localStorage.setItem('totalSalesAmount', startingAmount); // Guardar en localStorage
        setShowModalInit(false);
      }

    return(
        <div className="bigContainer">
           <Modal show={totalSalesAmount  === ''} onHide={() => {}}>
            <Modal.Header closeButton>
                <Modal.Title className="estandarLetter">Monto inicial de la caja</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form style={{textAlign:'center'}}>
                <Form.Group controlId="payCash">
                    <Form.Control
                    className="modalLeter"
                    style={{textAlign:'center'}}
                    type="text"
                    placeholder="Ingresa monto inicial"
                    name="startingAmount"
                    value={startingAmount}
                    onChange={(e) => setStartingAmount(e.target.value)}
                    required
                    />
                </Form.Group>

                <Button
                    className="estandarLetter"
                    variant="primary"
                    type="button" // Cambia el tipo de submit a button para evitar la recarga de la página
                    onClick={(e) => saveModalStartingAmount(e)} // Pasa el evento a la función
                    style={{marginTop:'10%', backgroundColor:'#344a57'}}
                >
                    Guardar
                </Button>
                </Form>
            </Modal.Body>
            </Modal>
            
            <img
                    src={logoImage}
                    alt="Logo"
                    className="logo-home"
                />
            
            <div className="headContainer">

                
                <h1>Alpha<strong >Store</strong></h1>         
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
                                                    <button style={{width: '35px', height: '35px', borderRadius:'8px', marginLeft:'15%', border: 'none', background: 'var(--color-error)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'}} onClick={() => {
                                                        
                                                        deleteProductButtonSubmit(row.original.resultID);
                                                        
                                                    }}>
                                                    <FaTrash />
                                                    </button>
                                                    <button style={{width: '35px', height: '35px', borderRadius:'8px', marginLeft:'15%', border: 'none', background: 'var(--color-primary)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'}} className="hov" onClick={() =>{
                                                        editProductButtonImageSubmit(row.original);
                                                        handleModalShowEdit();
                                                        
                                                    }}>
                                                    <FaEdit />
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
                <Dropdown.Toggle variant="light" id="dropdown-basic" className="user">
                <div className="userLog">
                    <FaUser />
                </div>
                <span className="user-name">{user.username}</span>
                </Dropdown.Toggle>
                <Dropdown.Menu align="end" style={{  backgroundColor: 'white', fontSize: '1.3rem', width:'270px', borderColor:'#9b9b9b'}}>
                <Dropdown.Item onClick={handleOpenModalAndFetchData} style={{color: 'black', borderBottom: '1px solid #9b9b9b', display:'flex', alignItems: 'center', gap: '10px'}}>
                        <FaBox style={{fontSize: '1.5rem', color: 'var(--color-primary)'}} />
                        Gestionar productos</Dropdown.Item>
                    <Dropdown.Item onClick={() => { handleModalShowEmployee(); }} style={{color: 'black', borderBottom: '1px solid #9b9b9b', paddingTop:'3%', paddingBottom:'3%', display:'flex', alignItems: 'center', gap: '10px'}}>
                        <FaUsers style={{fontSize: '1.5rem', color: 'var(--color-primary)'}} />
                        Gestionar empleados</Dropdown.Item>
                        <Dropdown.Item
                            as={Link}
                            to='/graphicspage'
                            style={{ color: 'black', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #9b9b9b', }}
                            >
                            <FaChartBar style={{fontSize: '1.5rem', color: 'var(--color-primary)'}} />
                            Gráficos
                        </Dropdown.Item>
                    <Dropdown.Item style={{color: 'black', display:'flex', alignItems: 'center', gap: '10px'}} onClick={logOutSubmit}>
                        <FaSignOutAlt style={{fontSize: '1.5rem', color: 'var(--color-error)'}} />
                        Cerrar Sesión</Dropdown.Item>
                </Dropdown.Menu>
                </Dropdown>

                
            </div>

            <hr className="lineStore"></hr>
            <div className="options-head">
            <form
                onSubmit={(e) => {
                    e.preventDefault(); // Evitar que el formulario se envíe automáticamente
                    onSubmit({ producto: barcode });
                    setBarcode('');
                }}
                style={{ display: 'flex', alignItems: 'center' }}
            >
            <input
                className="findInput"
                placeholder="Código de barras del producto"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                required
            ></input>
                
                <button className="findButton">Agregar al carrito</button>
            </form>
            
            <button className="closeBox">Cerrar Caja</button>
                
            </div>

            <div className="cont">
                <div className="trolleyContainer">
                    {shoppingCar.getRowModel().rows.length === 0 ? (
                        <div style={{textAlign: 'center', padding: '3rem'}}>
                            <div style={{display:'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem'}}>
                                <FaShoppingCart style={{fontSize: '6rem', color: 'var(--color-gray-light)', opacity: 0.5}} />
                                <FaArrowDown style={{fontSize: '3rem', color: 'var(--color-gray)', opacity: 0.7}} />
                            </div>
                            <p style={{marginTop: '2rem', fontSize: '1.25rem', color: 'var(--color-gray)'}}>Carrito vacío</p>
                        </div>
                        
                    ) : (
                        <table className="shoppingTableStyle">
                            <thead className="headTableShoppingCar" >
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
                                                <button style={{ width: '35px', height: '35px', borderRadius: '8px', marginLeft: '25%', border: 'none', background: 'var(--color-success)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => {
                                                    
                                                    onSubmit({ producto: row.original.resultProductCode});
                                        
                                                }}>
                                                    <FaPlus />
                                                </button>
                                                <button style={{ width: '35px', height: '35px', borderRadius: '8px', marginLeft: '2%', border: 'none', background: 'var(--color-error)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => {
                                                    
                                                    deleteProductShoppingCarButtonSubmit(row.original.resultID);
                                                }}>
                                                    <FaTrash />
                                                </button>
                                                <button style={{ width: '35px', height: '35px', borderRadius: '8px', marginLeft: '2%', border: 'none', background: 'var(--color-warning)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => {
                                                    
                                                    onSubmitLess({ producto: row.original.resultProductCode});
                                                }}>
                                                    <FaMinus />
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
                            <FaMoneyBillWave style={{fontSize: '2rem'}} />
                            <span className="textButton">Pago con efectivo</span>
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
                            <FaCreditCard style={{fontSize: '2rem'}} />
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