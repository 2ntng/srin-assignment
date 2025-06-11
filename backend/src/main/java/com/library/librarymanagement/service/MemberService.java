package com.library.librarymanagement.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.library.librarymanagement.model.BorrowedBook;
import com.library.librarymanagement.model.Member;
import com.library.librarymanagement.repository.BorrowedBookRepository;
import com.library.librarymanagement.repository.MemberRepository;

@Service
public class MemberService {

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private BorrowedBookRepository borrowedBookRepository;

    public List<Member> findAll() {
        List<Member> members = memberRepository.findAll();
        // Populate borrowed books for each member
        for (Member member : members) {
            populateBorrowedBooks(member);
        }
        return members;
    }

    public Optional<Member> findById(String id) {
        Optional<Member> memberOpt = memberRepository.findById(id);
        if (memberOpt.isPresent()) {
            Member member = memberOpt.get();
            populateBorrowedBooks(member);
            return Optional.of(member);
        }
        return Optional.empty();
    }

    public Member save(Member member) {
        return memberRepository.save(member);
    }

    public void deleteById(String id) {
        memberRepository.deleteById(id);
    }

    public List<Member> searchMembers(String keyword) {
        List<Member> members = memberRepository
                .findByNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrPhoneContaining(
                        keyword, keyword, keyword);
        // Populate borrowed books for each member
        for (Member member : members) {
            populateBorrowedBooks(member);
        }
        return members;
    }

    public Optional<Member> findByIdWithBorrowedBooks(String id) {
        Optional<Member> memberOpt = memberRepository.findById(id);
        if (memberOpt.isPresent()) {
            Member member = memberOpt.get();
            populateBorrowedBooks(member);
            return Optional.of(member);
        }
        return Optional.empty();
    }

    public Optional<Member> findByEmail(String email) {
        Optional<Member> memberOpt = memberRepository.findByEmail(email);
        if (memberOpt.isPresent()) {
            Member member = memberOpt.get();
            populateBorrowedBooks(member);
            return Optional.of(member);
        }
        return Optional.empty();
    }

    private void populateBorrowedBooks(Member member) {
        if (member != null && member.getId() != null) {
            List<BorrowedBook> borrowedBooks = borrowedBookRepository.findByMemberId(member.getId());
            member.setBorrowedBooks(borrowedBooks);
        }
    }
}
