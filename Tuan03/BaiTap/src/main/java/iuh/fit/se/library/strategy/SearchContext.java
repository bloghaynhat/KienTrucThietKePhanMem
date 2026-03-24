package iuh.fit.se.library.strategy;

import iuh.fit.se.library.factory.Book;

import java.util.List;

public class SearchContext {

        private SearchStrategy strategy;

        public void setStrategy(SearchStrategy strategy) {
            this.strategy = strategy;
        }

        public List<Book> search(List<Book> books, String keyword) {
            return strategy.search(books, keyword);
    }
}
