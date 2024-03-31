import { useForm } from 'react-hook-form';
import './RegisPage.css';
import { useAuth } from '../context/AuthContext.jsx';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from "../components/logo.jpg";

const RegisPage = () => {
  const { register, handleSubmit, formState: {errors}, } = useForm();
  const { signup, isAuthenticated, errors: registerErrors } = useAuth();
  const navigate = useNavigate();

  useEffect(()=>{
    if(isAuthenticated) navigate('/login');
  }, [isAuthenticated])

  const onSubmit = handleSubmit( async (values) => {
    signup(values);
  });

  return (
    <div className="registration-page">
      
      
      <div className="registration-container">
        <div className='logo-container'>
            <img
                src={logoImage}
                alt="Logo"
                className="logo"
            />
        </div>
        
            <h1 className='tittle'>REGISTRO</h1>
        
            
        <form onSubmit={onSubmit}>
          <label htmlFor="username" className='tittle-register'>Nombre</label> 
          <input type="text" className='inputs' placeholder='Juan Perez' {... register('username', { required: true })} id="username" />
          {errors.username && <p className="text-red-500"> Username es requerido</p>}

          <label htmlFor="email" className='tittle-register'>Email</label>
          <input type="email" className='inputs' placeholder='juanperez@gmail.com' {...register('email', { required: true })} id="email" />
          {errors.email && <p className="text-red-500"> email es requerido</p>}

          <label htmlFor="password" className='tittle-register'>Contraseña</label>
          <input type="password" className='inputs' placeholder='*********' {...register('password', { required: true })} id="password" />
          {errors.password && <p className="text-red-500"> pass es requerido</p>}

          {
              registerErrors.map((error, i) => (
                <div className= 'already' key={i}>
                  {error}
                </div>
              ))
            }
          <div>
            <button className='boton'>Registrar</button>
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default RegisPage;
