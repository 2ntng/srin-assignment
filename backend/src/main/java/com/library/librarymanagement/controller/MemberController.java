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

import com.library.librarymanagement.model.Member;
import com.library.librarymanagement.service.MemberService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/members")
@CrossOrigin(origins = { "http://localhost:5173",
        "http://localhost:3000" }, allowedHeaders = "*", allowCredentials = "true")
public class MemberController {

    @Autowired
    private MemberService memberService;

    @GetMapping
    public ResponseEntity<List<Member>> getAllMembers() {
        try {
            List<Member> members = memberService.findAll();
            return ResponseEntity.ok(members);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Member> getMemberById(@PathVariable String id) {
        try {
            Optional<Member> member = memberService.findById(id);
            return member.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping(consumes = "application/json", produces = "application/json")
    public ResponseEntity<Member> createMember(@Valid @RequestBody Member member, HttpServletRequest request) {
        System.out.println("[DEBUG] POST /api/members Content-Type: " + request.getContentType());
        try {
            Member savedMember = memberService.save(member);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedMember);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping(value = "/{id}", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Member> updateMember(@PathVariable String id, @Valid @RequestBody Member memberDetails,
            HttpServletRequest request) {
        System.out.println("[DEBUG] PUT /api/members/" + id + " Content-Type: " + request.getContentType());
        try {
            Optional<Member> existingMember = memberService.findById(id);
            if (existingMember.isPresent()) {
                Member member = existingMember.get();
                member.setName(memberDetails.getName());
                member.setEmail(memberDetails.getEmail());
                member.setPhone(memberDetails.getPhone());
                member.setAddress(memberDetails.getAddress());

                Member updatedMember = memberService.save(member);
                return ResponseEntity.ok(updatedMember);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMember(@PathVariable String id) {
        try {
            Optional<Member> member = memberService.findById(id);
            if (member.isPresent()) {
                memberService.deleteById(id);
                return ResponseEntity.noContent().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Member>> searchMembers(@RequestParam String q) {
        try {
            List<Member> members = memberService.searchMembers(q);
            return ResponseEntity.ok(members);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}/borrowed-books")
    public ResponseEntity<Member> getMemberWithBorrowedBooks(@PathVariable String id) {
        try {
            Optional<Member> member = memberService.findByIdWithBorrowedBooks(id);
            return member.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
