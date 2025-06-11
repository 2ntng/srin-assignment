package com.library.librarymanagement.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.library.librarymanagement.model.BorrowedBook;
import com.library.librarymanagement.repository.BorrowedBookRepository;

@Service
public class BorrowedBookService {

    @Autowired
    private BorrowedBookRepository borrowedBookRepository;

    @Autowired
    private BookService bookService;

    public List<BorrowedBook> findAll() {
        return borrowedBookRepository.findAll();
    }

    public Optional<BorrowedBook> findById(String id) {
        return borrowedBookRepository.findById(id);
    }

    public BorrowedBook save(BorrowedBook borrowedBook) {
        return borrowedBookRepository.save(borrowedBook);
    }

    public BorrowedBook borrowBook(BorrowedBook borrowedBook) {
        // Decrease available copies when borrowing
        bookService.decreaseAvailableCopies(borrowedBook.getBook().getId());
        return borrowedBookRepository.save(borrowedBook);
    }

    public Optional<BorrowedBook> returnBook(String borrowedBookId) {
        Optional<BorrowedBook> borrowedBookOpt = borrowedBookRepository.findById(borrowedBookId);
        if (borrowedBookOpt.isPresent()) {
            BorrowedBook borrowedBook = borrowedBookOpt.get();
            if (borrowedBook.getReturnDate() == null) {
                borrowedBook.setReturnDate(LocalDate.now());
                // Increase available copies when returning
                bookService.increaseAvailableCopies(borrowedBook.getBook().getId());
                return Optional.of(borrowedBookRepository.save(borrowedBook));
            }
        }
        return Optional.empty();
    }

    public void deleteById(String id) {
        Optional<BorrowedBook> borrowedBookOpt = borrowedBookRepository.findById(id);
        if (borrowedBookOpt.isPresent()) {
            BorrowedBook borrowedBook = borrowedBookOpt.get();
            // If book was not returned, increase available copies
            if (borrowedBook.getReturnDate() == null) {
                bookService.increaseAvailableCopies(borrowedBook.getBook().getId());
            }
        }
        borrowedBookRepository.deleteById(id);
    }

    public List<BorrowedBook> searchBorrowedBooks(String keyword) {
        return borrowedBookRepository.findByBookTitleContainingIgnoreCaseOrMemberNameContainingIgnoreCaseOrBorrowDate(keyword);
    }

    public List<BorrowedBook> findActiveBorrowings() {
        return borrowedBookRepository.findByReturnDateIsNull();
    }

    public List<BorrowedBook> findOverdueBooks() {
        return borrowedBookRepository.findByDueDateBeforeAndReturnDateIsNull(LocalDate.now());
    }

    public List<BorrowedBook> findByMemberId(String memberId) {
        return borrowedBookRepository.findByMemberId(memberId);
    }

    public List<BorrowedBook> findByBookId(String bookId) {
        return borrowedBookRepository.findByBookId(bookId);
    }
}
