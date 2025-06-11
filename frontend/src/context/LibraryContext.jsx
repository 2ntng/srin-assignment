import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const LibraryContext = createContext();

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const LibraryProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [members, setMembers] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // API Service functions
  const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Add request interceptor to ensure headers are set correctly
  api.interceptors.request.use(
    (config) => {
      // Ensure Content-Type header is set for POST and PUT requests
      if (config.method === 'post' || config.method === 'put') {
        config.headers['Content-Type'] = 'application/json';
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor for better error handling
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 415) {
        console.error('Unsupported Media Type error:', {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
          data: error.config?.data,
        });
      }
      return Promise.reject(error);
    }
  );

  // Books API
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/books');
      setBooks(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch books');
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  };

  const addBook = async (bookData) => {
    try {
      const response = await api.post('/books', bookData);
      setBooks(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError('Failed to add book');
      throw err;
    }
  };

  const updateBook = async (id, bookData) => {
    try {
      const response = await api.put(`/books/${id}`, bookData);
      setBooks(prev => prev.map(book => book.id === id ? response.data : book));
      return response.data;
    } catch (err) {
      setError('Failed to update book');
      throw err;
    }
  };

  const deleteBook = async (id) => {
    try {
      await api.delete(`/books/${id}`);
      setBooks(prev => prev.filter(book => book.id !== id));
    } catch (err) {
      setError('Failed to delete book');
      throw err;
    }
  };

  // Authors API
  const fetchAuthors = async () => {
    try {
      setLoading(true);
      const response = await api.get('/authors');
      setAuthors(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch authors');
      console.error('Error fetching authors:', err);
    } finally {
      setLoading(false);
    }
  };

  const addAuthor = async (authorData) => {
    try {
      const response = await api.post('/authors', authorData);
      setAuthors(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError('Failed to add author');
      throw err;
    }
  };

  const updateAuthor = async (id, authorData) => {
    try {
      const response = await api.put(`/authors/${id}`, authorData);
      setAuthors(prev => prev.map(author => author.id === id ? response.data : author));
      return response.data;
    } catch (err) {
      setError('Failed to update author');
      throw err;
    }
  };

  const deleteAuthor = async (id) => {
    try {
      await api.delete(`/authors/${id}`);
      setAuthors(prev => prev.filter(author => author.id !== id));
    } catch (err) {
      setError('Failed to delete author');
      throw err;
    }
  };

  // Members API
  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/members');
      setMembers(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch members');
      console.error('Error fetching members:', err);
    } finally {
      setLoading(false);
    }
  };

  const addMember = async (memberData) => {
    try {
      const response = await api.post('/members', memberData);
      setMembers(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError('Failed to add member');
      throw err;
    }
  };

  const updateMember = async (id, memberData) => {
    try {
      const response = await api.put(`/members/${id}`, memberData);
      setMembers(prev => prev.map(member => member.id === id ? response.data : member));
      return response.data;
    } catch (err) {
      setError('Failed to update member');
      throw err;
    }
  };

  const deleteMember = async (id) => {
    try {
      await api.delete(`/members/${id}`);
      setMembers(prev => prev.filter(member => member.id !== id));
    } catch (err) {
      setError('Failed to delete member');
      throw err;
    }
  };

  // Borrowed Books API
  const fetchBorrowedBooks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/borrowed-books');
      setBorrowedBooks(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch borrowed books');
      console.error('Error fetching borrowed books:', err);
    } finally {
      setLoading(false);
    }
  };

  const addBorrowedBook = async (borrowData) => {
    try {
      const response = await api.post('/borrowed-books', borrowData);
      setBorrowedBooks(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError('Failed to borrow book');
      throw err;
    }
  };

  const returnBook = async (id) => {
    try {
      const response = await api.put(`/borrowed-books/${id}/return`);
      setBorrowedBooks(prev => prev.map(item => item.id === id ? response.data : item));
      return response.data;
    } catch (err) {
      setError('Failed to return book');
      throw err;
    }
  };

  const deleteBorrowedBook = async (id) => {
    try {
      await api.delete(`/borrowed-books/${id}`);
      setBorrowedBooks(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError('Failed to delete borrowed book record');
      throw err;
    }
  };

  // Search function
  const searchBorrowedBooks = async (query) => {
    try {
      const response = await api.get(`/borrowed-books/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (err) {
      setError('Failed to search borrowed books');
      throw err;
    }
  };

  const value = {
    // State
    books,
    authors,
    members,
    borrowedBooks,
    loading,
    error,
    
    // Books
    fetchBooks,
    addBook,
    updateBook,
    deleteBook,
    
    // Authors
    fetchAuthors,
    addAuthor,
    updateAuthor,
    deleteAuthor,
    
    // Members
    fetchMembers,
    addMember,
    updateMember,
    deleteMember,
    
    // Borrowed Books
    fetchBorrowedBooks,
    addBorrowedBook,
    returnBook,
    deleteBorrowedBook,
    searchBorrowedBooks,
    
    // Utility
    setError,
  };

  return (
    <LibraryContext.Provider value={value}>
      {children}
    </LibraryContext.Provider>
  );
};
