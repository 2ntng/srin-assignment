import React, { useEffect } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { BookOpen, Users, UserCheck, BookMarked, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const { 
    books, 
    authors, 
    members, 
    borrowedBooks, 
    fetchBooks, 
    fetchAuthors, 
    fetchMembers, 
    fetchBorrowedBooks,
    loading,
    error 
  } = useLibrary();

  useEffect(() => {
    fetchBooks();
    fetchAuthors();
    fetchMembers();
    fetchBorrowedBooks();
  }, []);

  const stats = [
    {
      title: 'Total Books',
      value: books.length,
      icon: BookOpen,
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'Total Authors',
      value: authors.length,
      icon: Users,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      title: 'Total Members',
      value: members.length,
      icon: UserCheck,
      color: 'bg-purple-500',
      textColor: 'text-purple-600'
    },
    {
      title: 'Borrowed Books',
      value: borrowedBooks.filter(book => !book.returnDate).length,
      icon: BookMarked,
      color: 'bg-orange-500',
      textColor: 'text-orange-600'
    }
  ];

  const recentBorrowedBooks = borrowedBooks
    .filter(book => !book.returnDate)
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to the Library Management System</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <span className="text-red-800">{error}</span>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Borrowed Books */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Recently Borrowed Books</h2>
          </div>
          <div className="p-6">
            {recentBorrowedBooks.length > 0 ? (
              <div className="space-y-4">
                {recentBorrowedBooks.map((borrowedBook, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-800">
                        {borrowedBook.book?.title || 'Unknown Book'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Borrowed by: {borrowedBook.member?.name || 'Unknown Member'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {borrowedBook.borrowDate ? new Date(borrowedBook.borrowDate).toLocaleDateString() : 'Unknown Date'}
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No books currently borrowed</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <a
                href="/books"
                className="block w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <BookOpen className="h-5 w-5" />
                  <span className="font-medium">Manage Books</span>
                </div>
              </a>
              <a
                href="/authors"
                className="block w-full text-left px-4 py-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5" />
                  <span className="font-medium">Manage Authors</span>
                </div>
              </a>
              <a
                href="/members"
                className="block w-full text-left px-4 py-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <UserCheck className="h-5 w-5" />
                  <span className="font-medium">Manage Members</span>
                </div>
              </a>
              <a
                href="/borrowed-books"
                className="block w-full text-left px-4 py-3 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <BookMarked className="h-5 w-5" />
                  <span className="font-medium">Manage Borrowed Books</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
