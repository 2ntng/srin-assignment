package com.library.librarymanagement.config;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;

import com.library.librarymanagement.model.Author;
import com.library.librarymanagement.model.Book;
import com.library.librarymanagement.model.BorrowedBook;
import com.library.librarymanagement.model.Member;
import com.library.librarymanagement.repository.AuthorRepository;
import com.library.librarymanagement.repository.BookRepository;
import com.library.librarymanagement.repository.BorrowedBookRepository;
import com.library.librarymanagement.repository.MemberRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private AuthorRepository authorRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private BorrowedBookRepository borrowedBookRepository;

    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public void run(String... args) throws Exception {
        // Check if collections exist; only initialize if not present
        boolean booksExist = mongoTemplate.collectionExists(Book.class);
        boolean authorsExist = mongoTemplate.collectionExists(Author.class);
        boolean membersExist = mongoTemplate.collectionExists(Member.class);
        boolean borrowedBooksExist = mongoTemplate.collectionExists(BorrowedBook.class);

        if (booksExist && authorsExist && membersExist && borrowedBooksExist) {
            System.out.println("Sample data already exists. Skipping initialization.");
            return;
        }

        // Create Authors
        Author author1 = new Author("F. Scott Fitzgerald",
                "Francis Scott Key Fitzgerald was an American novelist, essayist, short story writer, and screenwriter.",
                "American");
        Author author2 = new Author("Harper Lee",
                "Nelle Harper Lee was an American novelist best known for her 1960 novel To Kill a Mockingbird.",
                "American");
        Author author3 = new Author("George Orwell",
                "Eric Arthur Blair, known by his pen name George Orwell, was an English novelist and essayist.",
                "British");
        Author author4 = new Author("Jane Austen",
                "Jane Austen was an English novelist known primarily for her six major novels.",
                "British");
        Author author5 = new Author("J.K. Rowling",
                "Joanne Rowling, better known by her pen name J. K. Rowling, is a British author and screenwriter.",
                "British");

        authorRepository.save(author1);
        authorRepository.save(author2);
        authorRepository.save(author3);
        authorRepository.save(author4);
        authorRepository.save(author5);

        // Create Books
        Book book1 = new Book("The Great Gatsby", "Fiction", 1925, "978-0-7432-7356-5", 5, author1);
        Book book2 = new Book("To Kill a Mockingbird", "Fiction", 1960, "978-0-06-112008-4", 3, author2);
        Book book3 = new Book("1984", "Dystopian Fiction", 1949, "978-0-452-28423-4", 4, author3);
        Book book4 = new Book("Animal Farm", "Political Satire", 1945, "978-0-452-28424-1", 2, author3);
        Book book5 = new Book("Pride and Prejudice", "Romance", 1813, "978-0-14-143951-8", 3, author4);
        Book book6 = new Book("Harry Potter and the Philosopher's Stone", "Fantasy", 1997, "978-0-439-70818-8", 6, author5);

        bookRepository.save(book1);
        bookRepository.save(book2);
        bookRepository.save(book3);
        bookRepository.save(book4);
        bookRepository.save(book5);
        bookRepository.save(book6);

        // Create Members
        Member member1 = new Member("Jack Smith", "jack@email.com", "+1-555-0101", "123 Main St, New York, NY 10001");
        Member member2 = new Member("Emily Johnson", "emily.johnson@email.com", "+1-555-0102", "456 Oak Ave, Los Angeles, CA 90210");
        Member member3 = new Member("Michael Brown", "michael.brown@email.com", "+1-555-0103", "789 Pine Rd, Chicago, IL 60601");
        Member member4 = new Member("Sarah Davis", "sarah.davis@email.com", "+1-555-0104", "321 Elm St, Houston, TX 77001");
        Member member5 = new Member("David Wilson", "david.wilson@email.com", "+1-555-0105", "654 Maple Dr, Phoenix, AZ 85001");

        memberRepository.save(member1);
        memberRepository.save(member2);
        memberRepository.save(member3);
        memberRepository.save(member4);
        memberRepository.save(member5);

        // Create some borrowed books
        BorrowedBook borrowedBook1 = new BorrowedBook(book1, member1, LocalDate.now().minusDays(10), LocalDate.now().plusDays(4));
        BorrowedBook borrowedBook2 = new BorrowedBook(book2, member2, LocalDate.now().minusDays(5), LocalDate.now().plusDays(9));
        BorrowedBook borrowedBook3 = new BorrowedBook(book3, member3, LocalDate.now().minusDays(20), LocalDate.now().minusDays(6)); // Overdue
        BorrowedBook borrowedBook4 = new BorrowedBook(book5, member4, LocalDate.now().minusDays(3), LocalDate.now().plusDays(11));

        // One returned book
        BorrowedBook borrowedBook5 = new BorrowedBook(book4, member5, LocalDate.now().minusDays(15), LocalDate.now().minusDays(1));
        borrowedBook5.setReturnDate(LocalDate.now().minusDays(1));
        borrowedBook5.setStatus("RETURNED");

        borrowedBookRepository.save(borrowedBook1);
        borrowedBookRepository.save(borrowedBook2);
        borrowedBookRepository.save(borrowedBook3);
        borrowedBookRepository.save(borrowedBook4);
        borrowedBookRepository.save(borrowedBook5);

        // Update available copies for borrowed books
        book1.setAvailableCopies(book1.getAvailableCopies() - 1);
        book2.setAvailableCopies(book2.getAvailableCopies() - 1);
        book3.setAvailableCopies(book3.getAvailableCopies() - 1);
        book5.setAvailableCopies(book5.getAvailableCopies() - 1);
        // book4 was returned, so no change needed

        bookRepository.save(book1);
        bookRepository.save(book2);
        bookRepository.save(book3);
        bookRepository.save(book5);

        System.out.println("Sample data has been initialized!");
    }
}
