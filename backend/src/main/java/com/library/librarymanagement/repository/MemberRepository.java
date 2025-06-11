package com.library.librarymanagement.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.library.librarymanagement.model.Member;

@Repository
public interface MemberRepository extends MongoRepository<Member, String> {

    Optional<Member> findByEmail(String email);

    List<Member> findByNameContainingIgnoreCase(String name);

    @Query("{ $or: [ { 'name': { $regex: ?0, $options: 'i' } }, { 'email': { $regex: ?1, $options: 'i' } }, { 'phone': { $regex: ?2 } } ] }")
    List<Member> findByNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrPhoneContaining(
            String name, String email, String phone);

    @Query("{ 'id' : ?0 }")
    Optional<Member> findByIdWithBorrowedBooks(String id);
}
