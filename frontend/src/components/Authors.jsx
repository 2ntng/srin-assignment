import React, { useState, useEffect } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { Plus, Edit, Trash2, Search, X, BookOpen } from 'lucide-react';

const Authors = () => {
  const { 
    authors, 
    fetchAuthors, 
    addAuthor, 
    updateAuthor, 
    deleteAuthor, 
    loading, 
    error 
  } = useLibrary();

  const [showModal, setShowModal] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    biography: '',
    nationality: ''
  });

  useEffect(() => {
    fetchAuthors();
  }, []);

  const filteredAuthors = authors.filter(author =>
    author.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    author.nationality?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      name: '',
      biography: '',
      nationality: ''
    });
    setEditingAuthor(null);
    setShowModal(false);
  };

  const handleEdit = (author) => {
    setEditingAuthor(author);
    setFormData({
      name: author.name || '',
      biography: author.biography || '',
      nationality: author.nationality || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAuthor) {
        await updateAuthor(editingAuthor.id, formData);
      } else {
        await addAuthor(formData);
      }
      resetForm();
    } catch (err) {
      console.error('Error saving author:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this author? This will also affect related books.')) {
      try {
        await deleteAuthor(id);
      } catch (err) {
        console.error('Error deleting author:', err);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Authors Management</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Author</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search authors by name or nationality..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Authors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAuthors.map((author) => (
          <div key={author.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{author.name}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(author)}
                    className="text-green-600 hover:text-green-800"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(author.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                {author.nationality && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Nationality:</span> {author.nationality}
                  </p>
                )}
                
                {author.biography && (
                  <p className="text-sm text-gray-600 line-clamp-3">
                    <span className="font-medium">Biography:</span> {author.biography}
                  </p>
                )}
                
                <div className="flex items-center space-x-2 text-sm text-gray-500 mt-3">
                  <BookOpen className="h-4 w-4" />
                  <span>{author.books?.length || 0} book(s)</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAuthors.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg">No authors found</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">
                {editingAuthor ? 'Edit Author' : 'Add New Author'}
              </h2>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., F. Scott Fitzgerald"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nationality
                </label>
                <input
                  type="text"
                  value={formData.nationality}
                  onChange={(e) => setFormData({...formData, nationality: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., American"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Biography
                </label>
                <textarea
                  rows="4"
                  value={formData.biography}
                  onChange={(e) => setFormData({...formData, biography: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Brief biography of the author..."
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  {editingAuthor ? 'Update Author' : 'Add Author'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Authors;
