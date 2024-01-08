import React, { Component } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { Link } from 'react-router-dom';

import "./HomePage.css";



const HomePage = () => {

    const settings = {
        dots: true,     
        fade: true,
        infinite: true,
        slidesToShow: 2,
        slidesToScroll: 1,
        autoplay: true,
        speed: 1000,
        autoplaySpeed: 5000,
        
      };

    return(
        <div>
            <img
                src="https://cloud.alphanetcurico.com/s/WgTq9kGcCfCceYs/download?path=%2FImagen%20varias&files=Avatar_upscayl_4x_realesrgan-x4plus.png"
                alt="Logo"
                className="logo-home"
            />
            <div class="menu-container">
                <a href="#alphanet" class="menu-item">AlphaNet</a>
                <a href="#alphastore" class="menu-item">AlphaStore</a>
                <a href="#enviar-mensaje" class="menu-item">Enviar Mensaje</a>
            </div>
            <Slider {...settings}>
                <div className="container-carrusel">
                    <img className= 'imagen-carrusel' src="https://cloud.alphanetcurico.com/index.php/apps/files_sharing/ajax/publicpreview.php?file=%2FAN%204%2FFacebook-01.jpg&c=4453350cec9e335ef5d5b7f8bcd10650&x=1920&y=1920&a=1&t=WgTq9kGcCfCceYs" alt="Logo-Alphanet" />
                </div>
                <div className="container-carrusel">
                    <img className= 'imagen-carrusel' src="https://img.freepik.com/vector-premium/codificacion-programacion-software-desarrollo-web-aplicacion-dispositivos-computadora-portatil_251139-154.jpg?size=626&ext=jpg" alt="Facebook-01" />
                    <div className="second-image">
                        <h1 className="tittle-second-images">Optimiza al <strong>MÁXIMO</strong></h1>
                        <h1 className="tittle-second-images" >tú negocio</h1>
                        <h1 className="tittle-second-image">Alpha<strong>Store</strong></h1>
                        <div>
                            <img className= 'icon-second-image' src="https://cdn-icons-png.flaticon.com/512/5136/5136521.png" alt="Facebook-01" />
                        </div>
                    </div>
                </div>
            </Slider>
            <hr className="line"></hr>
            <h1 id="alphanet" className="quienes-somos">¿Quiénes somos?</h1>
            <p className="quienes-somos-parrafo">¡Bienvenidos a <strong>AlphaNet</strong>! Somos una empresa especializada en servicio técnico de computación,
                comprometidos con brindar soluciones eficientes y confiables para satisfacer las necesidades 
                tecnológicas de nuestros clientes. Nuestro equipo de expertos en informática está dedicado a 
                ofrecer un servicio de alta calidad, desde la reparación y mantenimiento de equipos hasta la 
                optimización de sistemas.
            </p>
            
            <div class="card-container">
                
                <div class="card">
                <img className="card-image-service " src="https://cdn-icons-png.flaticon.com/512/2345/2345548.png"></img>
                    <h1 className="servicios"><strong>Servicios</strong></h1>
                    
                    <ul class="servicios-lista">
                        <li><img className="tick" src="https://cdn-icons-png.flaticon.com/512/1828/1828640.png" alt="Recuperación de datos"/> Recuperación de datos.</li>
                        <li><img className="tick" src="https://cdn-icons-png.flaticon.com/512/1828/1828640.png" alt="Formateo profundo"/> Formateo profundo.</li>
                        <li><img className="tick" src="https://cdn-icons-png.flaticon.com/512/1828/1828640.png" alt="Asesorías"/> Asesorías.</li>
                        <li><img className="tick" src="https://cdn-icons-png.flaticon.com/512/1828/1828640.png" alt="Cambio y mejora de equipos"/> Cambio y mejora de equipos.</li>
                        <li><img className="tick" src="https://cdn-icons-png.flaticon.com/512/1828/1828640.png" alt="Instalación de puntos de ventas"/> Instalación de puntos de ventas.</li>
                        <li><img className="tick" src="https://cdn-icons-png.flaticon.com/512/1828/1828640.png" alt="Instalación de servidores"/> Instalación de servidores.</li>
                        <li><img className="tick" src="https://cdn-icons-png.flaticon.com/512/1828/1828640.png" alt="Restauración de fotos"/> Restauración de fotos.</li>
                    </ul>
                    
                </div>
                <div class="card">
                <img className="card-image-service " src="https://assets.stickpng.com/images/5a452570546ddca7e1fcbc7d.png"></img>
                    <h1 className="servicios"><strong>Contacto</strong></h1>

                    <ul class="servicios-lista">
                        <li><img className="tick" src="https://static-00.iconduck.com/assets.00/whatsapp-fill-logo-icon-512x512-gg76jrxj.png" alt="Recuperación de datos"/> +56 9 5252 5658</li>
                        <li><img className="tick" src="https://www.pngitem.com/pimgs/m/173-1737238_computer-icons-email-telephone-circle-email-icon-png.png" alt="Formateo profundo"/> contacto@alphanetcurico.cl</li>
                        <li><img className="tick" src="https://cdn-icons-png.flaticon.com/512/4494/4494479.png" alt="Asesorías"/> <a href="https://www.facebook.com/alphanet.s.t" class="facebook">Alphanet Curico</a></li>
                        <li><img className="tick" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROd6Bj7hnqwvQO_dZFBHIyAbKISb4Z-3ySUg&usqp=CAU" alt="Asesorías"/> <a href="https://www.instagram.com/alphanet_curico?igsh=ZXJ2Z244aW14anVl" class="facebook">alphanet_curico</a></li>
                    </ul>

                </div>
                
            </div>
            <hr id ="alphastore" className="line"></hr>

            <div  className="container-alphastore">
                <div className="alphastore-card">
                    <h1 id="alphastore" className="quienes-somos">¿Qué es AlphaStore?</h1>
                    <p className="alphastore-parrafo">
                        Nos enorgullece presentar nuestra página web especializada en sistemas de punto de ventas. 
                        En <strong>AlphaStore</strong> potenciarás al máximo tu negocio,
                        podrás ver gráficamente tus ganancias, tendrás un conteo y registro de cada producto que tengas y más!
                    </p>
                    <h1 className="referencial">Imagen Referencial <img
                    src="https://cdn-icons-png.flaticon.com/512/12071/12071354.png"
                    className="right-image"
                /></h1>
                    
                </div>
                <img
                    src="https://www.clami.cl/static/main_site/img/punto-de-venta.png"
                    className="alphastore-image"
                />

                
                
            </div>
            <button className="button-gopage">
                    <Link to= "/login" >Ir a la página</Link>
                </button>

            <hr id="enviar-mensaje" className="line"></hr>

            <div  className="container-form">
                <div className="formulario">
                    <form >
                        <label htmlFor="username" className='name-email'>Nombre</label>
                        <input type="text" className='inputs-form' placeholder='Juan Perez'  id="username" />
                        

                        <label htmlFor="email" className='name-email'>Email</label>
                        <input type="email" className='inputs-form' placeholder='juanperez@gmail.com'  id="email" />

                        <label htmlFor="email" className='name-email'>Email</label>
                        <input type="text" className='inputs-form' placeholder='912332122'  id="email" />
                    

                        <label htmlFor="password" className='name-email'>Mensaje</label>
                        <input type="text" className='inputs-message' placeholder='Hola, soy Juan Perez, necesito que se comunique conmigo por favor.'  id="password" />
                        
                        <div>
                            <button className='boton-send'>Enviar
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/929/929926.png"
                                className="send"
                            />
                            
                            </button>
                            
                        </div>
                        
                    </form>
                </div>
            </div>
            <div className="footer">
                <div className="container">
                    <div className="footer-content">
                        <p>&copy; 2024 AlphaNet Curico</p>
                        
                    </div>
                </div>
            </div>
            
        </div>

    )
}

export default HomePage