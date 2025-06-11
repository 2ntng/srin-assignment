package com.library.librarymanagement.model;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.validation.constraints.NotBlank;

@Document(collection = "authors")
public class Author {

    @Id
    private String id;

    @NotBlank(message = "Name is required")
    private String name;

    private String biography;
    private String nationality;

    @DBRef
    @JsonManagedReference("author-books")
    private List<Book> books;

    // Constructors
    public Author() {
    }

    public Author(String name, String biography, String nationality) {
        this.name = name;
        this.biography = biography;
        this.nationality = nationality;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBiography() {
        return biography;
    }

    public void setBiography(String biography) {
        this.biography = biography;
    }

    public String getNationality() {
        return nationality;
    }

    public void setNationality(String nationality) {
        this.nationality = nationality;
    }

    public List<Book> getBooks() {
        return books;
    }

    public void setBooks(List<Book> books) {
        this.books = books;
    }
}
