import React from 'react';
import "./Footer.css";
import { FaGithub, FaLinkedin, FaMailBulk, FaPhone } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <div className='footer'>
      <div className='footer-container'>
        <div className='left'>
          <div className='email'>
            <FaMailBulk size={20} style={{ color: "#fff", marginRight: "2rem" }} />
            <div>
              <p>mizaanurrehman2@gmail.com</p>
            </div>
          </div>
          <div className='phone'>
            <FaPhone size={20} style={{ color: "#fff", marginRight: "2rem" }} />
            <div>
              <p>+91 7983464480</p>
            </div>
          </div>
        </div>
        <div className='right'>
          <h4>About Myself</h4>
          <p>
            Hi! I'm Mizaan ur Rehman, an enthusiastic and committed student working towards a Bachelor of Technology in Computer Science and Engineering at DIT University, Dehradun, India. With a robust understanding of computer science principles and a fervent passion for technology,
            I'm excited to innovate and contribute to the tech industry.
          </p>
          <div className='social'>
            <a href="https://www.linkedin.com/in/mizaan-ur-rehman-278706249/" target="_blank" rel="noopener noreferrer">
              <FaLinkedin size={20} style={{ color: "#fff", marginRight: "2rem" }} />
            </a>
            <a href="https://github.com/miz2" target="_blank" rel="noopener noreferrer">
              <FaGithub size={20} style={{ color: "#fff", marginRight: "2rem" }} />
            </a>
          </div>
        </div>
      </div>
      <div className='footer-bottom'>
        <p>&copy; {new Date().getFullYear()} Mizaan ur Rehman. All rights reserved.</p>
      </div>
    </div>
  );
}

export default Footer;
