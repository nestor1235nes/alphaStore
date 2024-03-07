import React, { Component, useState} from "react";
import { useForm } from 'react-hook-form';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { Link } from 'react-router-dom';
import { useNotification } from "../context/NotificationContext";

import "./HomePage.css";



function HomePage () {


    const {register, handleSubmit} = useForm();
    const { sendMessage } = useNotification();

    const onSubmit = handleSubmit((data) => {
        sendMessage(data);
        
    })

    const settings = {
        dots: true,     
        fade: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        speed: 1000,
        autoplaySpeed: 5000,
        cssEase: "linear"
        
      };

      var settingss = {
        dots: true,
        infinite: true,
        cssEase: "linear",
        autoplay: true,
        autoplaySpeed: 4000,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 4,
        initialSlide: 0,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
              infinite: true,
              dots: true
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2,
              initialSlide: 2
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
        ]
      };

    return(
        <div className="all-container">
            <img
                src="https://cloud.alphanetcurico.com/s/WgTq9kGcCfCceYs/download?path=%2FImagen%20varias&files=Avatar_upscayl_4x_realesrgan-x4plus.png"
                alt="Logo"
                className="logo-home"
            />
            <div className="menu-container">
                <a href="#alphanet" className="menu-item">AlphaNet</a>
                <a href="#alphastore" className="menu-item">AlphaStore</a>
                <a href="#enviar-mensaje" className="menu-item">Enviar Mensaje</a>
            </div>
            <Slider {...settings}>
                <div className="container-carrusel">
                    <img className= 'imagen-carrusel' src="https://scontent-scl2-1.xx.fbcdn.net/v/t39.30808-6/300009909_489106809887753_4860842056507111404_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=9534ce&_nc_eui2=AeGAfSu23Z5XI3Fhb82mNIjAIT8HFsooLZMhPwcWyigtkz0NNfZda_c2ftQisNAyBPOuVKNh7M7v6MRGWVBB4mr2&_nc_ohc=7oSJPMeQe5QAX9m05Cb&_nc_ht=scontent-scl2-1.xx&oh=00_AfBjCTAFG0d2bVjt-ypvcpwMzlhYtvo7ahPjgY4azOWihA&oe=65A47374" alt="Logo-Alphanet" />
                </div>
                <div className="container-carrusel">
                    <img className= 'imagen-carrusel' src="https://scontent-scl2-1.xx.fbcdn.net/v/t39.30808-6/345596053_3147604788717599_838139558782195314_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=9534ce&_nc_eui2=AeE6U2rBGuz0AMzOjeV5mladkT2s9kxJVM-RPaz2TElUz0JhgQ_JYjt6J0PT-aO-jwPTuWCfbT2RV_8vy0Yo5bkE&_nc_ohc=GlehmdVl5sQAX_FMgn4&_nc_ht=scontent-scl2-1.xx&oh=00_AfD7HRB0IOB1BrrD7eiLUK5Whwb07xuOPhdJQKgkKVs8eg&oe=65A50A20" alt="Facebook-01" />
                    
                </div>
                <div className="container-carrusel">
                    <img className= 'imagen-carrusel' src="https://scontent-scl2-1.xx.fbcdn.net/v/t39.30808-6/343921625_980563982937090_4660175409229311949_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=9534ce&_nc_eui2=AeERp2Y5E9B16nL8jCeNVg0-d8BQAknA0Ap3wFACScDQCkNrGU5ny-8NF2Trd6a0MfGpx23oS-v0lwwTk0F2hR1O&_nc_ohc=SEa49wUzYjAAX_YD3jE&_nc_ht=scontent-scl2-1.xx&oh=00_AfB5W1mZohRrCpo8PdXDNJznDz_IF2lfKqw5z7_JSDkChg&oe=65A4489B" alt="Facebook-01" />
                    
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
            
            <div className="card-container"> 
                
                <div className="card">
                
                    <h1 className="servicios"><strong>Servicios</strong></h1>
                    
                    <ul className="servicios-lista">
                        <li><img className="tick" src="https://cdn-icons-png.flaticon.com/512/1828/1828640.png" alt="Recuperación de datos"/> Recuperación de datos.</li>
                        <li><img className="tick" src="https://cdn-icons-png.flaticon.com/512/1828/1828640.png" alt="Formateo profundo"/> Formateo profundo.</li>
                        <li><img className="tick" src="https://cdn-icons-png.flaticon.com/512/1828/1828640.png" alt="Asesorías"/> Asesorías.</li>
                        <li><img className="tick" src="https://cdn-icons-png.flaticon.com/512/1828/1828640.png" alt="Cambio y mejora de equipos"/> Cambio y mejora de equipos.</li>
                        <li><img className="tick" src="https://cdn-icons-png.flaticon.com/512/1828/1828640.png" alt="Instalación de puntos de ventas"/> Instalación de puntos de ventas.</li>
                        <li><img className="tick" src="https://cdn-icons-png.flaticon.com/512/1828/1828640.png" alt="Instalación de servidores"/> Instalación de servidores.</li>
                        <li><img className="tick" src="https://cdn-icons-png.flaticon.com/512/1828/1828640.png" alt="Restauración de fotos"/> Restauración de fotos.</li>
                    </ul>
                    
                </div>
                <div className="card">
               
                    <h1 className="servicios-contacto"><strong>Contacto</strong></h1>

                    <ul className="servicios-lista">
                        <li><img className="tick" src="https://static-00.iconduck.com/assets.00/whatsapp-fill-logo-icon-512x512-gg76jrxj.png" alt="Recuperación de datos"/> +56 9 5252 5658</li>
                        <li><img className="tick" src="https://www.pngitem.com/pimgs/m/173-1737238_computer-icons-email-telephone-circle-email-icon-png.png" alt="Formateo profundo"/> contacto@alphanetcurico.cl</li>
                        <li><img className="tick" src="https://cdn-icons-png.flaticon.com/512/4494/4494479.png" alt="Asesorías"/> <a href="https://www.facebook.com/alphanet.s.t" className="facebook">Alphanet Curico</a></li>
                        <li><img className="tick" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROd6Bj7hnqwvQO_dZFBHIyAbKISb4Z-3ySUg&usqp=CAU" alt="Asesorías"/> <a href="https://www.instagram.com/alphanet_curico?igsh=ZXJ2Z244aW14anVl" className="facebook">alphanet_curico</a></li>
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
                    <h1 className="referencial">Imagen Referencial 
                    <img
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

            <hr  className="line"></hr>

            <Slider {...settingss}>
                <div className="container-carrusel">
                    <img className= 'imagen-carrusel' src="https://cloud.alphanetcurico.com/s/WgTq9kGcCfCceYs/download?path=%2FNuevo%20dise%C3%B1o%20GAMER&files=Aviso-1.jpg" alt="Logo-Alphanet" />
                </div>
                <div className="container-carrusel">
                    <img className= 'imagen-carrusel' src="https://cloud.alphanetcurico.com/s/WgTq9kGcCfCceYs/download?path=%2FNuevo%20dise%C3%B1o%20GAMER&files=Aviso-2.jpg" alt="Facebook-01" />
                    
                </div>
                <div className="container-carrusel">
                    <img className= 'imagen-carrusel' src="https://cloud.alphanetcurico.com/s/WgTq9kGcCfCceYs/download?path=%2FNuevo%20dise%C3%B1o%20GAMER&files=Aviso-3.jpg" alt="Facebook-01" />
                    
                </div>
                <div className="container-carrusel">
                    <img className= 'imagen-carrusel' src="https://cloud.alphanetcurico.com/s/WgTq9kGcCfCceYs/download?path=%2FNuevo%20dise%C3%B1o%20GAMER&files=Aviso-4.jpg" alt="Facebook-01" />
                    
                </div>
                <div className="container-carrusel">
                    <img className= 'imagen-carrusel' src="https://cloud.alphanetcurico.com/index.php/apps/files_sharing/ajax/publicpreview.php?file=%2FNuevo%20dise%C3%B1o%20GAMER%2Fpublicidad%20pagina%20web%202023.png&c=a1021deab4b695ff4131ed3a01a2de3e&x=1920&y=1920&a=1&t=WgTq9kGcCfCceYs" alt="Facebook-01" />
                    
                </div>
                <div className="container-carrusel">
                    <img className= 'imagen-carrusel' src="https://cloud.alphanetcurico.com/index.php/apps/files_sharing/ajax/publicpreview.php?file=%2FNuevo%20dise%C3%B1o%20GAMER%2FVenta%20de%20licencias.JPG&c=c0b821b1025f3c3aaef27a44a14d3e89&x=1920&y=1920&a=1&t=WgTq9kGcCfCceYs" alt="Facebook-01" />
                    
                </div>
                
            </Slider>

            <hr id="enviar-mensaje" className="line"></hr>

            <div  className="container-form">
                <div className="formulario">
                    <form onSubmit={onSubmit}>
                        

                        <label htmlFor="name" className='name-email'>Nombre</label>
                        <input
                            type="text"
                            className='inputs-form'
                            placeholder='Juan Perez'
                            {...register("name")}
                            autoFocus
                        />

                        <label htmlFor="email" className='name-email'>Email</label>
                        <input
                            type="email"
                            className='inputs-form'
                            placeholder='juanperez@gmail.com'
                            {...register("email")}
                        />

                        <label htmlFor="phone" className='name-email'>Teléfono</label>
                        <input
                            type="number"
                            className='inputs-form'
                            placeholder='912332122'
                            {...register("phone")}
                        />

                        <label htmlFor="message" className='name-email'>Mensaje</label>
                        <input
                            type="text"
                            className='inputs-message'
                            placeholder='Hola, soy Juan Perez, necesito que se comunique conmigo por favor.'
                            {...register("message")}
                        />

                            <button className='boton-send'>Enviar
                                
                            
                            </button>
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