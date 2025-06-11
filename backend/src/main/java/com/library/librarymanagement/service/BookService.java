package com.library.librarymanagement.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.library.librarymanagement.model.Author;
import com.library.librarymanagement.model.Book;
import com.library.librarymanagement.model.BorrowedBook;
import com.library.librarymanagement.repository.AuthorRepository;
import com.library.librarymanagement.repository.BookRepository;
import com.library.librarymanagement.repository.BorrowedBookRepository;

@Service
public class BookService {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private AuthorRepository authorRepository;

    @Autowired
    private BorrowedBookRepository borrowedBookRepository;

    public List<Book> findAll() {
        List<Book> books = bookRepository.findAll();
        // Populate author and borrowed books for each book
        for (Book book : books) {
            populateRelationships(book);
        }
        return books;
    }

    public Optional<Book> findById(String id) {
        Optional<Book> bookOpt = bookRepository.findById(id);
        if (bookOpt.isPresent()) {
            Book book = bookOpt.get();
            populateRelationships(book);
            return Optional.of(book);
        }
        return Optional.empty();
    }

    public Book save(Book book) {
        if (book.getAvailableCopies() == null) {
            book.setAvailableCopies(book.getTotalCopies());
        }
        return bookRepository.save(book);
    }

    public void deleteById(String id) {
        bookRepository.deleteById(id);
    }

    public List<Book> searchBooks(String keyword) {
        List<Book> books = bookRepository.findByKeyword(keyword);
        // Populate relationships for each book
        for (Book book : books) {
            populateRelationships(book);
        }
        return books;
    }

    public List<Book> findAvailableBooks() {
        List<Book> books = bookRepository.findByAvailableCopiesGreaterThan(0);
        // Populate relationships for each book
        for (Book book : books) {
            populateRelationships(book);
        }
        return books;
    }

    public List<Book> findByAuthorId(String authorId) {
        List<Book> books = bookRepository.findByAuthorId(authorId);
        // Populate relationships for each book
        for (Book book : books) {
            populateRelationships(book);
        }
        return books;
    }

    public void decreaseAvailableCopies(String bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + bookId));

        if (book.getAvailableCopies() > 0) {
            book.setAvailableCopies(book.getAvailableCopies() - 1);
            bookRepository.save(book);
        } else {
            throw new RuntimeException("No available copies for this book");
        }
    }

    public void increaseAvailableCopies(String bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + bookId));

        if (book.getAvailableCopies() < book.getTotalCopies()) {
            book.setAvailableCopies(book.getAvailableCopies() + 1);
            bookRepository.save(book);
        }
    }

    private void populateRelationships(Book book) {
        if (book != null) {
            // Populate author using repository
            if (book.getAuthor() != null && book.getAuthor().getId() != null) {
                Optional<Author> authorOpt = authorRepository.findById(book.getAuthor().getId());
                authorOpt.ifPresent(book::setAuthor);
            }

            // Populate borrowed books using repository
            List<BorrowedBook> borrowedBooks = borrowedBookRepository.findByBookId(book.getId());
            book.setBorrowedBooks(borrowedBooks);
        }
    }
}
