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

import com.library.librarymanagement.model.Book;
import com.library.librarymanagement.service.BookService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "https://2ntng.github.io", "https://backend-service-1rrm.onrender.com"}, 
             allowCredentials = "true",
             maxAge = 3600)
public class BookController {

    @Autowired
    private BookService bookService;

    @GetMapping
    public ResponseEntity<List<Book>> getAllBooks() {
        try {
            List<Book> books = bookService.findAll();
            return ResponseEntity.ok(books);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable String id) {
        try {
            Optional<Book> book = bookService.findById(id);
            return book.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping(consumes = "application/json", produces = "application/json")
    public ResponseEntity<Book> createBook(@Valid @RequestBody Book book, HttpServletRequest request) {
        System.out.println("[DEBUG] POST /api/books Content-Type: " + request.getContentType());
        try {
            Book savedBook = bookService.save(book);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedBook);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping(value = "/{id}", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Book> updateBook(@PathVariable String id, @Valid @RequestBody Book bookDetails,
            HttpServletRequest request) {
        System.out.println("[DEBUG] PUT /api/books/" + id + " Content-Type: " + request.getContentType());
        try {
            Optional<Book> existingBook = bookService.findById(id);
            if (existingBook.isPresent()) {
                Book book = existingBook.get();
                book.setTitle(bookDetails.getTitle());
                book.setCategory(bookDetails.getCategory());
                book.setPublishingYear(bookDetails.getPublishingYear());
                book.setIsbn(bookDetails.getIsbn());
                book.setTotalCopies(bookDetails.getTotalCopies());
                book.setAvailableCopies(bookDetails.getAvailableCopies());
                book.setAuthor(bookDetails.getAuthor());

                Book updatedBook = bookService.save(book);
                return ResponseEntity.ok(updatedBook);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable String id) {
        try {
            Optional<Book> book = bookService.findById(id);
            if (book.isPresent()) {
                bookService.deleteById(id);
                return ResponseEntity.noContent().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Book>> searchBooks(@RequestParam String q) {
        try {
            List<Book> books = bookService.searchBooks(q);
            return ResponseEntity.ok(books);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/available")
    public ResponseEntity<List<Book>> getAvailableBooks() {
        try {
            List<Book> books = bookService.findAvailableBooks();
            return ResponseEntity.ok(books);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
