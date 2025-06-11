package com.library.librarymanagement.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.library.librarymanagement.model.Book;

@Repository
public interface BookRepository extends MongoRepository<Book, String> {

    List<Book> findByTitleContainingIgnoreCase(String title);

    List<Book> findByCategoryContainingIgnoreCase(String category);

    List<Book> findByAuthorId(String authorId);

    List<Book> findByAvailableCopiesGreaterThan(Integer copies);

    @Query("{ $or: [ { 'title': { $regex: ?0, $options: 'i' } }, { 'category': { $regex: ?0, $options: 'i' } }, { 'author.name': { $regex: ?0, $options: 'i' } } ] }")
    List<Book> findByKeyword(String keyword);
}
