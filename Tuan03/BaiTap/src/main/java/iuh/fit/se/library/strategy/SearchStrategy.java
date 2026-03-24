package iuh.fit.se.library.strategy;

import iuh.fit.se.library.factory.Book;

import java.util.List;

public interface SearchStrategy {
    List<Book> search(List<Book> books, String keyword);
}
