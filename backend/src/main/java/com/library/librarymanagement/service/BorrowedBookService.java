package com.library.librarymanagement.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.library.librarymanagement.model.Book;
import com.library.librarymanagement.model.BorrowedBook;
import com.library.librarymanagement.model.Member;
import com.library.librarymanagement.repository.BookRepository;
import com.library.librarymanagement.repository.BorrowedBookRepository;
import com.library.librarymanagement.repository.MemberRepository;

@Service
public class BorrowedBookService {

    @Autowired
    private BorrowedBookRepository borrowedBookRepository;

    @Autowired
    private BookService bookService;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private MemberRepository memberRepository;

    public List<BorrowedBook> findAll() {
        List<BorrowedBook> borrowedBooks = borrowedBookRepository.findAll();
        // Populate book and member for each borrowed book
        for (BorrowedBook borrowedBook : borrowedBooks) {
            populateRelationships(borrowedBook);
        }
        return borrowedBooks;
    }

    public Optional<BorrowedBook> findById(String id) {
        Optional<BorrowedBook> borrowedBookOpt = borrowedBookRepository.findById(id);
        if (borrowedBookOpt.isPresent()) {
            BorrowedBook borrowedBook = borrowedBookOpt.get();
            populateRelationships(borrowedBook);
            return Optional.of(borrowedBook);
        }
        return Optional.empty();
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
        List<BorrowedBook> borrowedBooks = borrowedBookRepository
                .findByBookTitleContainingIgnoreCaseOrMemberNameContainingIgnoreCaseOrBorrowDate(keyword);
        // Populate relationships for each borrowed book
        for (BorrowedBook borrowedBook : borrowedBooks) {
            populateRelationships(borrowedBook);
        }
        return borrowedBooks;
    }

    public List<BorrowedBook> findActiveBorrowings() {
        List<BorrowedBook> borrowedBooks = borrowedBookRepository.findByReturnDateIsNull();
        // Populate relationships for each borrowed book
        for (BorrowedBook borrowedBook : borrowedBooks) {
            populateRelationships(borrowedBook);
        }
        return borrowedBooks;
    }

    public List<BorrowedBook> findOverdueBooks() {
        List<BorrowedBook> borrowedBooks = borrowedBookRepository
                .findByDueDateBeforeAndReturnDateIsNull(LocalDate.now());
        // Populate relationships for each borrowed book
        for (BorrowedBook borrowedBook : borrowedBooks) {
            populateRelationships(borrowedBook);
        }
        return borrowedBooks;
    }

    public List<BorrowedBook> findByMemberId(String memberId) {
        List<BorrowedBook> borrowedBooks = borrowedBookRepository.findByMemberId(memberId);
        // Populate relationships for each borrowed book
        for (BorrowedBook borrowedBook : borrowedBooks) {
            populateRelationships(borrowedBook);
        }
        return borrowedBooks;
    }

    public List<BorrowedBook> findByBookId(String bookId) {
        List<BorrowedBook> borrowedBooks = borrowedBookRepository.findByBookId(bookId);
        // Populate relationships for each borrowed book
        for (BorrowedBook borrowedBook : borrowedBooks) {
            populateRelationships(borrowedBook);
        }
        return borrowedBooks;
    }

    private void populateRelationships(BorrowedBook borrowedBook) {
        if (borrowedBook != null) {
            // Use existing repository methods to find and populate relationships
            if (borrowedBook.getBook() != null && borrowedBook.getBook().getId() != null) {
                Optional<Book> bookOpt = bookRepository.findById(borrowedBook.getBook().getId());
                bookOpt.ifPresent(borrowedBook::setBook);
            }

            if (borrowedBook.getMember() != null && borrowedBook.getMember().getId() != null) {
                Optional<Member> memberOpt = memberRepository.findById(borrowedBook.getMember().getId());
                memberOpt.ifPresent(borrowedBook::setMember);
            }
        }
    }
}
