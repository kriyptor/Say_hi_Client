import React from 'react';
import { Navbar as BootstrapNavbar, Button } from 'react-bootstrap';


const Navbar = ({ handleLogout }) => (
  <BootstrapNavbar bg="dark" data-bs-theme="dark" expand="lg" className="p-2">
    <BootstrapNavbar.Brand className='p-2 '>Say.Hi!</BootstrapNavbar.Brand>
    <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
    <BootstrapNavbar.Collapse className="justify-content-end">
      <Button variant="danger" onClick={handleLogout}>Logout</Button>
    </BootstrapNavbar.Collapse>
  </BootstrapNavbar>
);

export default Navbar;