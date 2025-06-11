package com.library.librarymanagement.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.library.librarymanagement.model.BorrowedBook;

@Repository
public interface BorrowedBookRepository extends MongoRepository<BorrowedBook, String> {

    List<BorrowedBook> findByMemberId(String memberId);

    List<BorrowedBook> findByBookId(String bookId);

    List<BorrowedBook> findByReturnDateIsNull();

    List<BorrowedBook> findByDueDateBeforeAndReturnDateIsNull(LocalDate date);

    @Query("{ $or: [ { 'book.title': { $regex: ?0, $options: 'i' } }, { 'member.name': { $regex: ?0, $options: 'i' } } ] }")
    List<BorrowedBook> findByBookTitleContainingIgnoreCaseOrMemberNameContainingIgnoreCaseOrBorrowDate(String keyword);

    @Query("{ 'borrowDate': { $gte: ?0, $lte: ?1 } }")
    List<BorrowedBook> findByBorrowDateBetween(LocalDate startDate, LocalDate endDate);
}
