package com.library.librarymanagement.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.library.librarymanagement.model.Author;
import com.library.librarymanagement.repository.AuthorRepository;

@Service
public class AuthorService {

    @Autowired
    private AuthorRepository authorRepository;

    public List<Author> findAll() {
        return authorRepository.findAll();
    }

    public Optional<Author> findById(String id) {
        return authorRepository.findById(id);
    }

    public Author save(Author author) {
        return authorRepository.save(author);
    }

    public void deleteById(String id) {
        authorRepository.deleteById(id);
    }

    public List<Author> searchAuthors(String keyword) {
        return authorRepository.findByNameContainingIgnoreCaseOrNationalityContainingIgnoreCase(keyword, keyword);
    }

    public Optional<Author> findByIdWithBooks(String id) {
        return authorRepository.findByIdWithBooks(id);
    }
}
