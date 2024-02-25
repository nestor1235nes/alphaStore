import {useReactTable, getCoreRowModel, flexRender} from '@tanstack/react-table';
import { useNotification } from "../context/NotificationContext";
import { useEffect, useState } from 'react';
import './AdminPage.css';

function AdminPage(){

    const { getMessage } = useNotification();
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const result = await getMessage();
            console.log(result);
            setData(result);
            
        };

        fetchData();
    }, []);

    const columns = [
        {
            header: "Nombre",
            accessorKey: 'name'
        },
        {
            header: "Email",
            accessorKey: 'email'
        },
        {
            header: "Telefono",
            accessorKey: 'phone'
        },
        {
            header: "Mensaje",
            accessorKey: 'message'
        },
    ]
    
    const table = useReactTable({data, columns, getCoreRowModel: getCoreRowModel(),});
    
    return (
        <div className='notification-container'>
            <h1 className='notification-tittle'>
                Notificaciones
            </h1>
            <div className='table-container'>
                <table className='table-table'>
                    <thead className='head-table'>
                        {
                            table.getHeaderGroups().map((headerGroup, i) =>(
                                <tr key={i}>
                                    {
                                        headerGroup.headers.map((headers, i) =>(
                                            <th key={i}>
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
                            table.getRowModel().rows.map((row, i) =>(
                                <tr key={i}>
                                    {row.getVisibleCells().map((cell,i) =>(
                                        <td key={i} className='celdas'>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        }
                    </tbody>

                    <tfoot>

                    </tfoot>
                </table>
            </div>
            
        </div>
    )
}

export default AdminPage;