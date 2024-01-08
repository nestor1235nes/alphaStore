import { BrowserRouter, Route, Routes } from "react-router-dom"
import PageLogin from "./pages/PageLogin.jsx"
import RegisPage from "./pages/RegisPage.jsx"
import HomePage from "./pages/HomePage.jsx"
import { AuthProvider } from "./context/AuthContext.jsx"



function App(){
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<HomePage />}></Route>
          <Route path="/login" element={<PageLogin />}></Route>
          <Route path="/register" element={<RegisPage />}></Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
export default App