import { useForm } from 'react-hook-form';
import './RegisPage.css';
import { useAuth } from '../context/AuthContext.jsx';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Link } from 'react-router-dom';


const PageLogin = () => {
  
    const { register, handleSubmit, formState: { errors } }= useForm();
    const {signin, errors: signinErrors, isAuthenticated} = useAuth();
    const navigate = useNavigate();

    const onSubmit = handleSubmit((data) =>{
      signin(data);
    })

    useEffect(()=>{
      if(isAuthenticated) navigate("/salepoint")
    },[isAuthenticated]) 

    return (
      <div className="registration-page">
      
      
      <div className="registration-container">
        <div className='logo-container'>
            <img
                src="https://cloud.alphanetcurico.com/s/WgTq9kGcCfCceYs/download?path=%2FImagen%20varias&files=Avatar_upscayl_4x_realesrgan-x4plus.png"
                alt="Logo"
                className="logo"
            />
        </div>
        
            <h1 className='tittle'>LOGIN</h1>
        
            
        <form onSubmit={onSubmit}>

          <label htmlFor="email" className='tittle-register'>Email</label>
          <input type="email" className='inputs' placeholder='juanperez@gmail.com' {...register('email', { required: true })} id="email" />
          {errors.email && <p className="text-red-500"> Email es requerido</p>}

          <label htmlFor="password" className='tittle-register'>Contraseña</label>
          <input type="password" className='inputs' placeholder='*********' {...register('password', { required: true })} id="password" />
          {errors.password && <p className="text-red-500"> La contraseña es requerida</p>}

          {
              signinErrors.map((error, i) => (
                <div className= 'already' key={i}>
                  {error}
                </div>
              ))
            }
         
          <div>
            <button className='boton'>Iniciar</button>
          </div>
          
        </form>

        <p className='contactF'>¿No tienes una cuenta? <Link to ='/#' className='contact'>Contáctanos! </Link></p>

        
      </div>
    </div>
    )
  }
  
  export default PageLogin