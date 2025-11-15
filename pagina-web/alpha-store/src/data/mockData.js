// Datos de demostración para el proyecto AlphaStore

export const mockUsers = [
    {
        _id: '1',
        username: 'admin',
        email: 'admin@alphastore.com',
        createdAt: new Date().toISOString()
    },
    {
        _id: '2',
        username: 'vendedor1',
        email: 'vendedor1@alphastore.com',
        createdAt: new Date().toISOString()
    }
];

export const mockProducts = [
    {
        _id: '1',
        productName: 'Coca Cola 2L',
        productCode: '1',
        productAmount: 50,
        priceProvider: 2500,
        salePrice: 4000,
        createdAt: new Date().toISOString()
    },
    {
        _id: '2',
        productName: 'Pan Tajado Bimbo',
        productCode: '2',
        productAmount: 30,
        priceProvider: 3500,
        salePrice: 5500,
        createdAt: new Date().toISOString()
    },
    {
        _id: '3',
        productName: 'Leche Entera 1L',
        productCode: '3',
        productAmount: 40,
        priceProvider: 3000,
        salePrice: 4500,
        createdAt: new Date().toISOString()
    },
    {
        _id: '4',
        productName: 'Arroz Diana 500g',
        productCode: '4',
        productAmount: 60,
        priceProvider: 2000,
        salePrice: 3200,
        createdAt: new Date().toISOString()
    },
    {
        _id: '5',
        productName: 'Aceite Girasol 1L',
        productCode: '5',
        productAmount: 25,
        priceProvider: 8000,
        salePrice: 12000,
        createdAt: new Date().toISOString()
    },
    {
        _id: '6',
        productName: 'Azúcar 1kg',
        productCode: '6',
        productAmount: 45,
        priceProvider: 2500,
        salePrice: 4000,
        createdAt: new Date().toISOString()
    },
    {
        _id: '7',
        productName: 'Café Aguila Roja 250g',
        productCode: '7',
        productAmount: 20,
        priceProvider: 7000,
        salePrice: 10500,
        createdAt: new Date().toISOString()
    },
    {
        _id: '8',
        productName: 'Huevos x30',
        productCode: '8',
        productAmount: 15,
        priceProvider: 12000,
        salePrice: 18000,
        createdAt: new Date().toISOString()
    },
    {
        _id: '9',
        productName: 'Pasta Doria 500g',
        productCode: '9',
        productAmount: 35,
        priceProvider: 2800,
        salePrice: 4500,
        createdAt: new Date().toISOString()
    },
    {
        _id: '10',
        productName: 'Jabón Rey 500g',
        productCode: '10',
        productAmount: 40,
        priceProvider: 3500,
        salePrice: 5500,
        createdAt: new Date().toISOString()
    }
];

export const mockSales = [
    {
        _id: '1',
        products: [
            {
                productName: 'Coca Cola 2L',
                productCode: '1',
                saleAmount: '2',
                priceProvider: 2500,
                salePrice: 4000,
                saleTotal: '8000'
            }
        ],
        user: '1',
        createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hora atrás
        total: 8000
    },
    {
        _id: '2',
        products: [
            {
                productName: 'Pan Tajado Bimbo',
                productCode: '2',
                saleAmount: '1',
                priceProvider: 3500,
                salePrice: 5500,
                saleTotal: '5500'
            },
            {
                productName: 'Leche Entera 1L',
                productCode: '3',
                saleAmount: '2',
                priceProvider: 3000,
                salePrice: 4500,
                saleTotal: '9000'
            }
        ],
        user: '1',
        createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 horas atrás
        total: 14500
    },
    {
        _id: '3',
        products: [
            {
                productName: 'Arroz Diana 500g',
                productCode: '4',
                saleAmount: '3',
                priceProvider: 2000,
                salePrice: 3200,
                saleTotal: '9600'
            }
        ],
        user: '2',
        createdAt: new Date(Date.now() - 10800000).toISOString(), // 3 horas atrás
        total: 9600
    },
    {
        _id: '4',
        products: [
            {
                productName: 'Aceite Girasol 1L',
                productCode: '5',
                saleAmount: '1',
                priceProvider: 8000,
                salePrice: 12000,
                saleTotal: '12000'
            },
            {
                productName: 'Azúcar 1kg',
                productCode: '6',
                saleAmount: '2',
                priceProvider: 2500,
                salePrice: 4000,
                saleTotal: '8000'
            },
            {
                productName: 'Café Aguila Roja 250g',
                productCode: '7',
                saleAmount: '1',
                priceProvider: 7000,
                salePrice: 10500,
                saleTotal: '10500'
            }
        ],
        user: '1',
        createdAt: new Date(Date.now() - 14400000).toISOString(), // 4 horas atrás
        total: 30500
    },
    {
        _id: '5',
        products: [
            {
                productName: 'Huevos x30',
                productCode: '8',
                saleAmount: '1',
                priceProvider: 12000,
                salePrice: 18000,
                saleTotal: '18000'
            }
        ],
        user: '1',
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 día atrás
        total: 18000
    }
];

export const mockNotifications = [
    {
        _id: '1',
        message: 'Producto "Leche Entera 1L" con stock bajo (10 unidades)',
        type: 'warning',
        read: false,
        createdAt: new Date(Date.now() - 3600000).toISOString()
    },
    {
        _id: '2',
        message: 'Nueva venta registrada por $30,500',
        type: 'success',
        read: false,
        createdAt: new Date(Date.now() - 7200000).toISOString()
    },
    {
        _id: '3',
        message: 'Producto "Huevos x30" agregado al inventario',
        type: 'info',
        read: true,
        createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
        _id: '4',
        message: 'Venta exitosa - Total: $14,500',
        type: 'success',
        read: true,
        createdAt: new Date(Date.now() - 172800000).toISOString()
    }
];

// Función helper para generar ID único
export const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};
