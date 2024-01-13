import { useStore } from '../context/storeContext';
import {useReactTable} from '@tanstack/react-table';



function AdminPage(){
    
    const { createProduct } = useStore();

    

    return (
        <div>
            <button>
                Notificaciones
            </button>
        </div>
        
        
    )
}

export default AdminPage;