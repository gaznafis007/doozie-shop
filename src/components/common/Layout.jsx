import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';


/**
 * Layout component for the e-commerce application
 */
const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="container mx-auto p-4 flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
