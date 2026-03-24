package iuh.fit.se.library.factory;

public class PaperBook extends Book{
    public PaperBook(String title, String author, String category) {
        this.title = title;
        this.author = author;
        this.category = category;
    }

    public void display() {
        System.out.println("Paper Book: " + title);
    }
}
