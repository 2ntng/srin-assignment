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

import com.library.librarymanagement.model.BorrowedBook;
import com.library.librarymanagement.service.BorrowedBookService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/borrowed-books")
@CrossOrigin(origins = { "http://localhost:5173",
        "http://localhost:3000" }, allowedHeaders = "*", allowCredentials = "true")
public class BorrowedBookController {

    @Autowired
    private BorrowedBookService borrowedBookService;

    @GetMapping
    public ResponseEntity<List<BorrowedBook>> getAllBorrowedBooks() {
        try {
            List<BorrowedBook> borrowedBooks = borrowedBookService.findAll();
            return ResponseEntity.ok(borrowedBooks);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<BorrowedBook> getBorrowedBookById(@PathVariable String id) {
        try {
            Optional<BorrowedBook> borrowedBook = borrowedBookService.findById(id);
            return borrowedBook.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping(consumes = "application/json", produces = "application/json")
    public ResponseEntity<BorrowedBook> createBorrowedBook(@Valid @RequestBody BorrowedBook borrowedBook,
            HttpServletRequest request) {
        System.out.println("[DEBUG] POST /api/borrowed-books Content-Type: " + request.getContentType());
        try {
            BorrowedBook savedBorrowedBook = borrowedBookService.borrowBook(borrowedBook);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedBorrowedBook);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping(value = "/{id}", consumes = "application/json", produces = "application/json")
    public ResponseEntity<BorrowedBook> updateBorrowedBook(@PathVariable String id,
            @Valid @RequestBody BorrowedBook borrowedBookDetails, HttpServletRequest request) {
        System.out.println("[DEBUG] PUT /api/borrowed-books/" + id + " Content-Type: " + request.getContentType());
        try {
            Optional<BorrowedBook> existingBorrowedBook = borrowedBookService.findById(id);
            if (existingBorrowedBook.isPresent()) {
                BorrowedBook borrowedBook = existingBorrowedBook.get();
                borrowedBook.setBorrowDate(borrowedBookDetails.getBorrowDate());
                borrowedBook.setDueDate(borrowedBookDetails.getDueDate());
                borrowedBook.setReturnDate(borrowedBookDetails.getReturnDate());

                BorrowedBook updatedBorrowedBook = borrowedBookService.save(borrowedBook);
                return ResponseEntity.ok(updatedBorrowedBook);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping(value = "/{id}/return", produces = "application/json")
    public ResponseEntity<BorrowedBook> returnBook(@PathVariable String id) {
        try {
            Optional<BorrowedBook> borrowedBook = borrowedBookService.returnBook(id);
            return borrowedBook.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBorrowedBook(@PathVariable String id) {
        try {
            Optional<BorrowedBook> borrowedBook = borrowedBookService.findById(id);
            if (borrowedBook.isPresent()) {
                borrowedBookService.deleteById(id);
                return ResponseEntity.noContent().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<BorrowedBook>> searchBorrowedBooks(@RequestParam String q) {
        try {
            List<BorrowedBook> borrowedBooks = borrowedBookService.searchBorrowedBooks(q);
            return ResponseEntity.ok(borrowedBooks);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/active")
    public ResponseEntity<List<BorrowedBook>> getActiveBorrowings() {
        try {
            List<BorrowedBook> activeBorrowings = borrowedBookService.findActiveBorrowings();
            return ResponseEntity.ok(activeBorrowings);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/overdue")
    public ResponseEntity<List<BorrowedBook>> getOverdueBooks() {
        try {
            List<BorrowedBook> overdueBooks = borrowedBookService.findOverdueBooks();
            return ResponseEntity.ok(overdueBooks);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<BorrowedBook>> getBorrowedBooksByMember(@PathVariable String memberId) {
        try {
            List<BorrowedBook> borrowedBooks = borrowedBookService.findByMemberId(memberId);
            return ResponseEntity.ok(borrowedBooks);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/book/{bookId}")
    public ResponseEntity<List<BorrowedBook>> getBorrowedBooksByBook(@PathVariable String bookId) {
        try {
            List<BorrowedBook> borrowedBooks = borrowedBookService.findByBookId(bookId);
            return ResponseEntity.ok(borrowedBooks);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
