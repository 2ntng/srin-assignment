package com.library.librarymanagement.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.library.librarymanagement.model.Author;
import com.library.librarymanagement.service.AuthorService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/authors")
@CrossOrigin(origins = { "http://localhost:5173",
        "http://localhost:3000" }, allowedHeaders = "*", allowCredentials = "true")
public class AuthorController {

    @Autowired
    private AuthorService authorService;

    @GetMapping
    public ResponseEntity<List<Author>> getAllAuthors() {
        try {
            List<Author> authors = authorService.findAll();
            return ResponseEntity.ok(authors);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Author> getAuthorById(@PathVariable String id) {
        try {
            Optional<Author> author = authorService.findById(id);
            return author.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping(consumes = "application/json", produces = "application/json")
    public ResponseEntity<Author> createAuthor(@Valid @RequestBody Author author, HttpServletRequest request) {
        System.out.println("[DEBUG] POST /api/authors Content-Type: " + request.getContentType());
        try {
            Author savedAuthor = authorService.save(author);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedAuthor);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping(value = "/{id}", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Author> updateAuthor(@PathVariable String id, @Valid @RequestBody Author authorDetails,
            HttpServletRequest request) {
        System.out.println("[DEBUG] PUT /api/authors/" + id + " Content-Type: " + request.getContentType());
        try {
            Optional<Author> existingAuthor = authorService.findById(id);
            if (existingAuthor.isPresent()) {
                Author author = existingAuthor.get();
                author.setName(authorDetails.getName());
                author.setBiography(authorDetails.getBiography());
                author.setNationality(authorDetails.getNationality());

                Author updatedAuthor = authorService.save(author);
                return ResponseEntity.ok(updatedAuthor);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAuthor(@PathVariable String id) {
        try {
            Optional<Author> author = authorService.findById(id);
            if (author.isPresent()) {
                authorService.deleteById(id);
                return ResponseEntity.noContent().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Author>> searchAuthors(@RequestParam String q) {
        try {
            List<Author> authors = authorService.searchAuthors(q);
            return ResponseEntity.ok(authors);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}/books")
    public ResponseEntity<Author> getAuthorWithBooks(@PathVariable String id) {
        try {
            Optional<Author> author = authorService.findByIdWithBooks(id);
            return author.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
