package com.library.librarymanagement.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.library.librarymanagement.model.Author;
import com.library.librarymanagement.model.Book;
import com.library.librarymanagement.repository.AuthorRepository;
import com.library.librarymanagement.repository.BookRepository;

@Service
public class AuthorService {

    @Autowired
    private AuthorRepository authorRepository;

    @Autowired
    private BookRepository bookRepository;

    public List<Author> findAll() {
        List<Author> authors = authorRepository.findAll();
        // Populate books for each author
        for (Author author : authors) {
            populateBooks(author);
        }
        return authors;
    }

    public Optional<Author> findById(String id) {
        Optional<Author> authorOpt = authorRepository.findById(id);
        if (authorOpt.isPresent()) {
            Author author = authorOpt.get();
            populateBooks(author);
            return Optional.of(author);
        }
        return Optional.empty();
    }

    public Author save(Author author) {
        return authorRepository.save(author);
    }

    public void deleteById(String id) {
        authorRepository.deleteById(id);
    }

    public List<Author> searchAuthors(String keyword) {
        List<Author> authors = authorRepository.findByNameContainingIgnoreCaseOrNationalityContainingIgnoreCase(keyword,
                keyword);
        // Populate books for each author
        for (Author author : authors) {
            populateBooks(author);
        }
        return authors;
    }

    public Optional<Author> findByIdWithBooks(String id) {
        Optional<Author> authorOpt = authorRepository.findById(id);
        if (authorOpt.isPresent()) {
            Author author = authorOpt.get();
            populateBooks(author);
            return Optional.of(author);
        }
        return Optional.empty();
    }

    private void populateBooks(Author author) {
        if (author != null && author.getId() != null) {
            // Find books by author using existing repository method
            List<Book> books = bookRepository.findByAuthorId(author.getId());
            author.setBooks(books);
        }
    }
}
