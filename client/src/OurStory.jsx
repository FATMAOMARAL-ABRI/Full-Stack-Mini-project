import React from 'react';
import { useNavigate } from 'react-router-dom';

const OurStory = () => {
  const navigate = useNavigate();

  return (
    <div style={{ 
      backgroundColor: '#FFFBE6', 
      minHeight: '95vh', 
      width: '110%',      
      fontFamily: 'Arial, sans-serif',
      color: '#4A2B4D',
      display: 'flex',
      alignItems: 'center' 

    }}>
      <div className="container-fluid px-lg-5"> 
        <div className="row align-items-center g-0"> 
          
          <div className="col-lg-6 px-5 py-5">
            <h1 style={{ 
              fontSize: '5rem', 
              fontWeight: 'bold', 
              fontStyle: 'italic', 
              lineHeight: '1',
              marginBottom: '30px'
            }}>
              Healthy Living <br /> 
              <span style={{ color: '#6D466B' }}>Starts Here</span>
            </h1>
            
            <p className="mb-5" style={{ fontSize: '1.5rem', color: '#555', maxWidth: '600px' }}>
              From nature to your hands, healthy snacks <br />
              made with care and full of goodness.
            </p>

            <div className="d-flex gap-4 mb-5">
              <button 
                onClick={() => navigate('/login')}
                className="btn py-3 px-5 shadow-sm" 
                style={{ 
                  backgroundColor: '#E6C097', 
                  borderRadius: '40px', 
                  fontWeight: 'bold',
                  border: 'none',
                  fontSize: '1.3rem',
                  color: '#4A2B4D'
                }}>
                Shop Now &gt;
              </button>
              <button 
                className="btn py-3 px-5 shadow-sm" 
                style={{ 
                  backgroundColor: '#E6C097', 
                  borderRadius: '40px', 
                  fontWeight: 'bold',
                  border: 'none',
                  fontSize: '1.3rem',
                  color: '#4A2B4D'
                }}>
                Learn More
              </button>
            </div>

            <div className="d-flex gap-5 mt-4">
              <div className="d-flex align-items-center">
                <div className="me-3 d-flex align-items-center justify-content-center" style={{
                  backgroundColor: '#E6C097',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  fontWeight: 'bold',
                  fontSize: '1.2rem'
                }}>✓</div>
                <span className="fw-bold fs-4">100% Natural</span>
              </div>
              <div className="d-flex align-items-center">
                <div className="me-3 d-flex align-items-center justify-content-center" style={{
                  backgroundColor: '#E6C097',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  fontWeight: 'bold',
                  fontSize: '1.2rem'
                }}>✓</div>
                <span className="fw-bold fs-4">Fast Delivery</span>
              </div>
            </div>
          </div>

          {/* Right Side: Hero Image (Bigger) */}
          <div className="col-lg-6 d-flex justify-content-center align-items-center">
            <div style={{ position: 'relative', width: '100%', textAlign: 'center' }}>
              <img 
                src={`${import.meta.env.VITE_SERVER_URL}/uploads/Raspberry_Granola_Bar.png`} 
                alt="Healthy Snacks" 
                className="img-fluid"
                style={{ 
                  width: '85%', // Increased image scale
                  borderRadius: '100px', 
                  transform: 'rotate(-3deg)',
                  boxShadow: '30px 30px 0px #D8C3B1' // Larger shadow for depth
                }} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurStory;