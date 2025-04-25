import React from 'react';

/**
 * Navbar component for the e-commerce application
 */
const Navbar = () => {
  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">E-Commerce Shop</h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <a href="/" className="hover:underline">Home</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
