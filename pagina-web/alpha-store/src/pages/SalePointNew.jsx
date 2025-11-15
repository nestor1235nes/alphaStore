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
    Container,
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
    ShoppingCartCheckout,
    AttachMoney,
} from '@mui/icons-material';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import { ToastContainer, toast } from 'react-toastify';
import { useAuth } from "../context/AuthContext";
import { useStore } from "../context/StoreContext";
import { useSale } from "../context/SaleContext";
import logoImage from "../components/logo.jpg";

function SalePoint() {
    const navigate = useNavigate();
    const { signout, user, signup } = useAuth();
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

    // Handlers de menú
    const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
    const handleCloseUserMenu = () => setAnchorElUser(null);

    // Inicialización
    useEffect(() => {
        setShowModalInit(true);
        const totalSalesAmountFromStorage = localStorage.getItem('totalSalesAmount');
        if (totalSalesAmountFromStorage) {
            setTotalSalesAmount(totalSalesAmountFromStorage);
        }
    }, []);

    useEffect(() => {
        window.addEventListener('keydown', handleBarcodeScan);
        return () => window.removeEventListener('keydown', handleBarcodeScan);
    }, []);

    useEffect(() => {
        let timer;
        if (showModalSaleSuccesful) {
            timer = setTimeout(() => setShowModalSaleSuccesful(false), 5000);
        }
        return () => clearTimeout(timer);
    }, [showModalSaleSuccesful]);

    // Scanner de código de barras
    let tempBarcode = '';
    const handleBarcodeScan = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            onSubmit({ producto: tempBarcode });
            tempBarcode = '';
        } else {
            tempBarcode += e.key;
        }
    };

    // Funciones de carrito
    const onSubmit = async (data) => {
        try {
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
                const updatedShoppingCar = [...dataShoppingCar];
                updatedShoppingCar[existingProductIndex].cont++;
                setDatashoppingCar(updatedShoppingCar);
            } else {
                setAuxStorage(prevData => [...prevData, newProduct]);
                setDatashoppingCar(prevData => [...prevData, newProduct]);
            }
        } catch (error) {
            toast.error('Producto no encontrado');
        }
    };

    const onSubmitLess = async (data) => {
        try {
            const result = await getProduct(data);
            const newProduct = {
                resultID: result._id,
                resultProductCode: result.productCode,
            };

            const existingProductIndex = dataShoppingCar.findIndex(item => item.resultID === newProduct.resultID);
            if (existingProductIndex !== -1) {
                const updatedShoppingCar = [...dataShoppingCar];
                updatedShoppingCar[existingProductIndex].cont--;

                if (updatedShoppingCar[existingProductIndex].cont === 0) {
                    deleteProductShoppingCarButtonSubmit(newProduct.resultID);
                } else {
                    setDatashoppingCar(updatedShoppingCar);
                }
            }
        } catch (error) {
            toast.error('Error al procesar');
        }
    };

    const deleteProductShoppingCarButtonSubmit = (productID) => {
        const updatedShoppingCar = dataShoppingCar.filter(product => product.resultID !== productID);
        setDatashoppingCar(updatedShoppingCar);
    };

    const handleAddToCart = (e) => {
        e.preventDefault();
        if (barcode.trim()) {
            onSubmit({ producto: barcode });
            setBarcode('');
        }
    };

    // Funciones de productos
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
            toast.error("Error al obtener datos");
        }
    };

    const handleOpenModalProduct = () => {
        setShowModalProduct(true);
        fetchDataModalProduct();
        handleCloseUserMenu();
    };

    const addProductSubmit = async () => {
        try {
            await createProduct(productForm);
            await fetchDataModalProduct();
            setProductForm({
                productName: '',
                productCode: '',
                productAmount: '',
                priceProvider: '',
                salePrice: ''
            });
            toast.success('Producto agregado exitosamente');
        } catch (error) {
            toast.error('Error al agregar producto');
        }
    };

    const editProductModalSubmit = async () => {
        try {
            await deleteProduct(selectedProduct.resultID);
            await createProduct(productForm);
            await fetchDataModalProduct();
            setShowModalEdit(false);
            toast.success('Producto editado exitosamente');
        } catch (error) {
            toast.error('Error al editar producto');
        }
    };

    const deleteProductButtonSubmit = async (productID) => {
        if (window.confirm('¿Estás seguro que quieres eliminar este producto?')) {
            try {
                await deleteProduct(productID);
                await fetchDataModalProduct();
                toast.success('Producto eliminado');
            } catch (error) {
                toast.error('Error al eliminar producto');
            }
        }
    };

    const handleEditProduct = (product) => {
        setSelectedProduct(product);
        setProductForm({
            productName: product.resultProductName,
            productCode: product.resultProductCode,
            productAmount: product.resultProductAmount,
            priceProvider: product.resultPriceProvider,
            salePrice: product.resultSalePrice
        });
        setShowModalEdit(true);
    };

    // Funciones de empleados
    const sendRegisterSubmit = async () => {
        try {
            await signup(employeeForm);
            setEmployeeForm({ username: '', email: '', password: '' });
            setShowModalEmployee(false);
            toast.success('Empleado agregado');
        } catch (error) {
            toast.error('Error al agregar empleado');
        }
    };

    // Funciones de pago
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

        sale.products.forEach(soldProduct => {
            const productInStorage = auxStorage.find(product => product.resultProductCode === soldProduct.productCode);
            if (productInStorage) {
                productInStorage.resultProductAmount -= parseInt(soldProduct.saleAmount);
            }
        });

        setAuxStorage([...auxStorage]);

        for (const product of auxStorage) {
            const editProduct = {
                productName: product.resultProductName,
                productCode: product.resultProductCode,
                productAmount: product.resultProductAmount.toString(),
                priceProvider: product.resultPriceProvider,
                salePrice: product.resultSalePrice,
            };
            await deleteProduct(product.resultID);
            await createProduct(editProduct);
        }
    };

    const calculatedTurned = (paid, totalp) => {
        const result = paid - totalp;
        if (result >= 0) {
            setTurned(result);
            updateProductStorage();
            confirmSale();
        } else {
            toast.error("Dinero inferior al monto total del carrito");
        }
    };

    const openModalPaid = () => {
        if (dataShoppingCar.length === 0) {
            toast.error('El carrito de compras está vacío');
            return;
        }
        const total = dataShoppingCar.reduce((total, product) => total + (product.resultSalePrice * product.cont), 0);
        setTotalPrice(total);
        setShowModalPayCash(true);
    };

    const handleCashPayment = (amount) => {
        calculatedTurned(amount, totalPrice);
    };

    const handleCashPaymentManual = () => {
        if (cashAmount) {
            calculatedTurned(Number(cashAmount), totalPrice);
            setCashAmount("");
        }
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
            await createSale(sale);
            toast.success('Venta realizada');
            setShowModalPayCash(false);
            setShowModalSaleSuccesful(true);
            setDatashoppingCar([]);
            setAuxStorage([]);
        } catch (error) {
            toast.error('Error al crear venta');
        }
    };

    const saveModalStartingAmount = () => {
        if (startingAmount) {
            setTotalSalesAmount(startingAmount);
            localStorage.setItem('totalSalesAmount', startingAmount);
            setShowModalInit(false);
        }
    };

    const logOutSubmit = async () => {
        localStorage.removeItem('totalSalesAmount');
        setTotalSalesAmount('');
        await signout();
        handleCloseUserMenu();
    };

    // Configuración de tablas
    const columnsShoppingCar = [
        { header: "Cantidad", accessorKey: 'cont' },
        { header: "Nombre", accessorKey: 'resultProductName' },
        { header: "Precio unitario", accessorKey: 'resultSalePrice' },
    ];

    const columnsProduct = [
        { header: "Cantidad", accessorKey: 'resultProductAmount' },
        { header: "Nombre", accessorKey: 'resultProductName' },
        { header: "Precio", accessorKey: 'resultSalePrice' },
    ];

    const shoppingCar = useReactTable({
        data: dataShoppingCar,
        columns: columnsShoppingCar,
        getCoreRowModel: getCoreRowModel(),
    });

    const tableAddEditDeleteProduct = useReactTable({
        data: dataModalProduct,
        columns: columnsProduct,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: '#f5f7fa' }}>
            {/* AppBar moderna */}
            <AppBar position="sticky" elevation={2} sx={{ bgcolor: 'white', color: 'text.primary' }}>
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar src={logoImage} sx={{ width: 48, height: 48 }} />
                        <Typography variant="h5" sx={{ fontWeight: 800, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            AlphaStore
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                            avatar={<Avatar sx={{ bgcolor: '#667eea' }}><Person /></Avatar>}
                            label={user?.username || 'Usuario'}
                            onClick={handleOpenUserMenu}
                            sx={{ cursor: 'pointer', py: 2.5, px: 1 }}
                        />
                        <Menu
                            anchorEl={anchorElUser}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            <MenuItem onClick={handleOpenModalProduct}>
                                <ListItemIcon><Inventory fontSize="small" /></ListItemIcon>
                                <ListItemText>Gestionar productos</ListItemText>
                            </MenuItem>
                            <MenuItem onClick={() => { setShowModalEmployee(true); handleCloseUserMenu(); }}>
                                <ListItemIcon><PeopleAlt fontSize="small" /></ListItemIcon>
                                <ListItemText>Gestionar empleados</ListItemText>
                            </MenuItem>
                            <MenuItem onClick={() => navigate('/graphicspage')}>
                                <ListItemIcon><BarChart fontSize="small" /></ListItemIcon>
                                <ListItemText>Gráficos</ListItemText>
                            </MenuItem>
                            <Divider />
                            <MenuItem onClick={logOutSubmit}>
                                <ListItemIcon><Logout fontSize="small" color="error" /></ListItemIcon>
                                <ListItemText>Cerrar Sesión</ListItemText>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>

            <Container maxWidth="xl" sx={{ mt: 3, mb: 4 }}>
                {/* Barra de búsqueda */}
                <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
                    <form onSubmit={handleAddToCart}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <TextField
                                fullWidth
                                placeholder="Código de barras del producto"
                                value={barcode}
                                onChange={(e) => setBarcode(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ flex: 1 }}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={<ShoppingCartCheckout />}
                                sx={{ minWidth: 200, py: 1.8, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                            >
                                Agregar al carrito
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                sx={{ minWidth: 150, py: 1.8 }}
                            >
                                Cerrar Caja
                            </Button>
                        </Stack>
                    </form>
                </Paper>

                {/* Contenido principal */}
                <Grid container spacing={3}>
                    {/* Carrito */}
                    <Grid item xs={12} lg={8}>
                        <Card elevation={3} sx={{ borderRadius: 2, minHeight: 500 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
                                    <ShoppingCart sx={{ mr: 1, verticalAlign: 'middle' }} />
                                    Carrito de Compras
                                </Typography>
                                <Divider sx={{ mb: 2 }} />

                                {shoppingCar.getRowModel().rows.length === 0 ? (
                                    <Box sx={{ textAlign: 'center', py: 8 }}>
                                        <ShoppingCart sx={{ fontSize: 100, color: 'text.disabled', opacity: 0.3 }} />
                                        <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
                                            Carrito vacío
                                        </Typography>
                                    </Box>
                                ) : (
                                    <TableContainer sx={{ maxHeight: 400 }}>
                                        <Table stickyHeader>
                                            <TableHead>
                                                {shoppingCar.getHeaderGroups().map((headerGroup) => (
                                                    <TableRow key={headerGroup.id}>
                                                        {headerGroup.headers.map((header) => (
                                                            <TableCell key={header.id} sx={{ fontWeight: 700, bgcolor: '#f5f5f5' }}>
                                                                {header.column.columnDef.header}
                                                            </TableCell>
                                                        ))}
                                                        <TableCell sx={{ fontWeight: 700, bgcolor: '#f5f5f5' }}>Acciones</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableHead>
                                            <TableBody>
                                                {shoppingCar.getRowModel().rows.map((row) => (
                                                    <TableRow key={row.id} hover>
                                                        {row.getVisibleCells().map((cell) => (
                                                            <TableCell key={cell.id}>
                                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                            </TableCell>
                                                        ))}
                                                        <TableCell>
                                                            <Stack direction="row" spacing={0.5}>
                                                                <IconButton
                                                                    size="small"
                                                                    color="success"
                                                                    onClick={() => onSubmit({ producto: row.original.resultProductCode })}
                                                                >
                                                                    <Add />
                                                                </IconButton>
                                                                <IconButton
                                                                    size="small"
                                                                    color="error"
                                                                    onClick={() => deleteProductShoppingCarButtonSubmit(row.original.resultID)}
                                                                >
                                                                    <Delete />
                                                                </IconButton>
                                                                <IconButton
                                                                    size="small"
                                                                    color="warning"
                                                                    onClick={() => onSubmitLess({ producto: row.original.resultProductCode })}
                                                                >
                                                                    <Remove />
                                                                </IconButton>
                                                            </Stack>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Panel derecho */}
                    <Grid item xs={12} lg={4}>
                        <Stack spacing={2}>
                            {/* Total */}
                            <Card elevation={3} sx={{ borderRadius: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                                    <Typography variant="h6" sx={{ opacity: 0.9 }}>
                                        Total:
                                    </Typography>
                                    <Typography variant="h3" sx={{ fontWeight: 800, my: 1 }}>
                                        ${dataShoppingCar.reduce((total, product) => total + (product.resultSalePrice * product.cont), 0)}
                                    </Typography>
                                </CardContent>
                            </Card>

                            {/* Botones de pago */}
                            <Card elevation={3} sx={{ borderRadius: 2 }}>
                                <CardContent>
                                    <Stack spacing={2}>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            size="large"
                                            startIcon={<Payments />}
                                            onClick={openModalPaid}
                                            sx={{ py: 2, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                                        >
                                            Pago con efectivo
                                        </Button>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            size="large"
                                            startIcon={<CreditCard />}
                                            sx={{ py: 2, background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}
                                        >
                                            Pago con tarjeta
                                        </Button>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Stack>
                    </Grid>
                </Grid>
            </Container>

            {/* Modal: Monto inicial */}
            <Dialog open={totalSalesAmount === ''} maxWidth="sm" fullWidth>
                <DialogTitle>Monto inicial de la caja</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Ingresa monto inicial"
                        type="number"
                        value={startingAmount}
                        onChange={(e) => setStartingAmount(e.target.value)}
                        sx={{ mt: 2 }}
                        autoFocus
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={saveModalStartingAmount} variant="contained">
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Modal: Gestionar productos */}
            <Dialog open={showModalProduct} onClose={() => setShowModalProduct(false)} maxWidth="lg" fullWidth>
                <DialogTitle>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        Gestiona tus productos
                        <IconButton onClick={() => setShowModalProduct(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>Agregar Producto</Typography>
                                    <Stack spacing={2} sx={{ mt: 2 }}>
                                        <TextField
                                            label="Nombre del producto"
                                            value={productForm.productName}
                                            onChange={(e) => setProductForm({ ...productForm, productName: e.target.value })}
                                            fullWidth
                                        />
                                        <TextField
                                            label="Código de barras"
                                            value={productForm.productCode}
                                            onChange={(e) => setProductForm({ ...productForm, productCode: e.target.value })}
                                            fullWidth
                                        />
                                        <TextField
                                            label="Cantidad"
                                            type="number"
                                            value={productForm.productAmount}
                                            onChange={(e) => setProductForm({ ...productForm, productAmount: e.target.value })}
                                            fullWidth
                                        />
                                        <TextField
                                            label="Precio del proveedor"
                                            type="number"
                                            value={productForm.priceProvider}
                                            onChange={(e) => setProductForm({ ...productForm, priceProvider: e.target.value })}
                                            fullWidth
                                        />
                                        <TextField
                                            label="Precio de venta"
                                            type="number"
                                            value={productForm.salePrice}
                                            onChange={(e) => setProductForm({ ...productForm, salePrice: e.target.value })}
                                            fullWidth
                                        />
                                        <Button variant="contained" onClick={addProductSubmit} fullWidth>
                                            Agregar producto
                                        </Button>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <TableContainer component={Paper} variant="outlined">
                                <Table>
                                    <TableHead>
                                        {tableAddEditDeleteProduct.getHeaderGroups().map((headerGroup) => (
                                            <TableRow key={headerGroup.id}>
                                                {headerGroup.headers.map((header) => (
                                                    <TableCell key={header.id} sx={{ fontWeight: 700, bgcolor: '#f5f5f5' }}>
                                                        {header.column.columnDef.header}
                                                    </TableCell>
                                                ))}
                                                <TableCell sx={{ fontWeight: 700, bgcolor: '#f5f5f5' }}>Acciones</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableHead>
                                    <TableBody>
                                        {tableAddEditDeleteProduct.getRowModel().rows.map((row) => (
                                            <TableRow key={row.id} hover>
                                                {row.getVisibleCells().map((cell) => (
                                                    <TableCell key={cell.id}>
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </TableCell>
                                                ))}
                                                <TableCell>
                                                    <Stack direction="row" spacing={1}>
                                                        <IconButton size="small" color="error" onClick={() => deleteProductButtonSubmit(row.original.resultID)}>
                                                            <Delete />
                                                        </IconButton>
                                                        <IconButton size="small" color="primary" onClick={() => handleEditProduct(row.original)}>
                                                            <Edit />
                                                        </IconButton>
                                                    </Stack>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>

            {/* Modal: Editar producto */}
            <Dialog open={showModalEdit} onClose={() => setShowModalEdit(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Editar Producto</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 2 }}>
                        <TextField
                            label="Nombre del producto"
                            value={productForm.productName}
                            onChange={(e) => setProductForm({ ...productForm, productName: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Código de barras"
                            value={productForm.productCode}
                            onChange={(e) => setProductForm({ ...productForm, productCode: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Cantidad"
                            type="number"
                            value={productForm.productAmount}
                            onChange={(e) => setProductForm({ ...productForm, productAmount: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Precio del proveedor"
                            type="number"
                            value={productForm.priceProvider}
                            onChange={(e) => setProductForm({ ...productForm, priceProvider: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Precio de venta"
                            type="number"
                            value={productForm.salePrice}
                            onChange={(e) => setProductForm({ ...productForm, salePrice: e.target.value })}
                            fullWidth
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowModalEdit(false)}>Cancelar</Button>
                    <Button onClick={editProductModalSubmit} variant="contained">Guardar</Button>
                </DialogActions>
            </Dialog>

            {/* Modal: Gestionar empleados */}
            <Dialog open={showModalEmployee} onClose={() => setShowModalEmployee(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Gestionar empleados</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 2 }}>
                        <TextField
                            label="Nombre"
                            value={employeeForm.username}
                            onChange={(e) => setEmployeeForm({ ...employeeForm, username: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Email"
                            type="email"
                            value={employeeForm.email}
                            onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Contraseña"
                            type="password"
                            value={employeeForm.password}
                            onChange={(e) => setEmployeeForm({ ...employeeForm, password: e.target.value })}
                            fullWidth
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowModalEmployee(false)}>Cancelar</Button>
                    <Button onClick={sendRegisterSubmit} variant="contained">Agregar</Button>
                </DialogActions>
            </Dialog>

            {/* Modal: Pago en efectivo */}
            <Dialog open={showModalPayCash} onClose={() => setShowModalPayCash(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Pago en Efectivo</DialogTitle>
                <DialogContent>
                    <Typography variant="h6" gutterBottom sx={{ mt: 2, textAlign: 'center' }}>
                        Seleccione opción rápida
                    </Typography>
                    <Grid container spacing={1} sx={{ mb: 3 }}>
                        {[1000, 2000, 5000, 10000, 20000].map((amount) => (
                            <Grid item xs={6} sm={4} key={amount}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    onClick={() => handleCashPayment(amount)}
                                    sx={{ py: 1.5 }}
                                >
                                    ${amount.toLocaleString()}
                                </Button>
                            </Grid>
                        ))}
                    </Grid>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
                        O ingrese dinero recibido
                    </Typography>
                    <TextField
                        fullWidth
                        label="Ingresa monto"
                        type="number"
                        value={cashAmount}
                        onChange={(e) => setCashAmount(e.target.value)}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowModalPayCash(false)}>Cancelar</Button>
                    <Button onClick={handleCashPaymentManual} variant="contained">Confirmar</Button>
                </DialogActions>
            </Dialog>

            {/* Modal: Venta exitosa */}
            <Dialog open={showModalSaleSuccesful} onClose={() => setShowModalSaleSuccesful(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ textAlign: 'center' }}>
                    <CheckCircle color="success" sx={{ fontSize: 60, mb: 1 }} />
                    <Typography variant="h5">¡Gracias por su compra!</Typography>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ textAlign: 'center', py: 2 }}>
                        <Typography variant="h6" gutterBottom>Su vuelto es de</Typography>
                        <Typography variant="h3" sx={{ fontWeight: 700, color: 'success.main' }}>
                            ${turned}
                        </Typography>
                    </Box>
                </DialogContent>
            </Dialog>

            <ToastContainer position="bottom-right" autoClose={3000} />
        </Box>
    );
}

export default SalePoint;
