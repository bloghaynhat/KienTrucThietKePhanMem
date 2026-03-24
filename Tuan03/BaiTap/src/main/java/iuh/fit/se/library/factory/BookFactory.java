package iuh.fit.se.library.factory;

public class BookFactory {
    public static Book createBook(
            String type,
            String title,
            String author,
            String category) {

        if (type.equals("paper"))
            return new PaperBook(title, author, category);

        if (type.equals("ebook"))
            return new Ebook(title, author, category);

        if (type.equals("audio"))
            return new AudioBook(title, author, category);

        return null;
    }
}
