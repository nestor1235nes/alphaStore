import { BrowserRouter, Route, Routes } from "react-router-dom"
import PageLogin from "./pages/PageLogin.jsx"
import RegisPage from "./pages/RegisPage.jsx"
import HomePage from "./pages/HomePage.jsx"
import { AuthProvider } from "./context/AuthContext.jsx"
import SalePoint from "./pages/SalePoint.jsx"
import AdminPage from "./pages/AdminPage.jsx"

import ProtectedRoute from "./ProtectedRoute.jsx"

import { NotificationProvider } from "./context/NotificationContext.jsx"
import { StoreProvider } from "./context/StoreContext.jsx"



function App(){
  return (
    <AuthProvider>
      <NotificationProvider>
        <StoreProvider>
          <BrowserRouter>
            <Routes>
            <Route path="/" element={<HomePage />}></Route>
              <Route path="/login" element={<PageLogin />}></Route>
              <Route path="/register" element={<RegisPage />}></Route>


              <Route element={<ProtectedRoute/>}>
                <Route path="/salepoint" element={<SalePoint />}></Route>
                <Route path="/adminpage" element={<AdminPage />}></Route>
              
              </Route>
            </Routes>
          </BrowserRouter>
        </StoreProvider>
      </NotificationProvider>
    </AuthProvider>
  )
}
export default App