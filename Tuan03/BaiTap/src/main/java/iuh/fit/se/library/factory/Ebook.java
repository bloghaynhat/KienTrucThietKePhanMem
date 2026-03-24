package iuh.fit.se.library.factory;

public class Ebook extends Book{
    public Ebook(String title, String author, String category) {
        this.title = title;
        this.author = author;
        this.category = category;
    }


    public void display() {
        System.out.println("Ebook: " + title);
    }
}
