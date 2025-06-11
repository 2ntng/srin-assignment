package com.library.librarymanagement.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.library.librarymanagement.model.Author;

@Repository
public interface AuthorRepository extends MongoRepository<Author, String> {

    List<Author> findByNameContainingIgnoreCase(String name);

    List<Author> findByNameContainingIgnoreCaseOrNationalityContainingIgnoreCase(String name, String nationality);

    @Query("{ 'id' : ?0 }")
    Optional<Author> findByIdWithBooks(String id);
}
