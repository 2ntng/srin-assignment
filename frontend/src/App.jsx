import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Books from './components/Books';
import Authors from './components/Authors';
import Members from './components/Members';
import BorrowedBooks from './components/BorrowedBooks';
import { LibraryProvider } from './context/LibraryContext';

function App() {
  return (
    <LibraryProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/books" element={<Books />} />
              <Route path="/authors" element={<Authors />} />
              <Route path="/members" element={<Members />} />
              <Route path="/borrowed-books" element={<BorrowedBooks />} />
            </Routes>
          </main>
        </div>
      </Router>
    </LibraryProvider>
  )
}

export default App
