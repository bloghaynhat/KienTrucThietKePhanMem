package iuh.fit.se.library.strategy;

import iuh.fit.se.library.factory.Book;

import java.util.List;

public class SearchByName implements SearchStrategy {
    public List<Book> search(List<Book> books, String keyword) {

        return books.stream()
                .filter(b -> b.getTitle().contains(keyword))
                .toList();
    }
}
