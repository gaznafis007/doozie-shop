import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/common/Layout';
// import ProductDetailPage from './pages/ProductDetailPage';

import Home from './pages/Home';
import { SearchProvider } from './context/SearchContext';

/**
 * Main App component
 * @returns {JSX.Element} - App component
 */
const App = () => {
  return (
    <SearchProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route path="/item/:platform/:itemId" element={<ProductDetailPage />} /> */}
          </Routes>
        </Layout>
      </Router>
    </SearchProvider>
  );
};

export default App;
