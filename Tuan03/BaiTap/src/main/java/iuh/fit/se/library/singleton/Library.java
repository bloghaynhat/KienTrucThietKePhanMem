package iuh.fit.se.library.singleton;

import iuh.fit.se.library.factory.Book;

import java.util.ArrayList;
import java.util.List;

public class Library {

    private static Library instance;
    private List<Book> books;

    private Library() {
        books = new ArrayList<Book>();
    }

    public static Library getInstance() {

        if (instance == null) {
            instance = new Library();
        }

        return instance;
    }

    public void addBook(Book book) {
        books.add(book);

        System.out.println("Book added: " + book.getTitle());
    }

    public void removeBook(Book book) {

        books.remove(book);
    }

    public List<Book> getBooks() {
        return books;
    }

}
