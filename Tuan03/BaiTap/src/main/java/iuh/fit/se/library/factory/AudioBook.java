package iuh.fit.se.library.factory;

public class AudioBook extends Book{
    public AudioBook(String title, String author, String category) {
        this.title = title;
        this.author = author;
        this.category = category;
    }

    public void display() {
        System.out.println("AudioBook: " + title);
    }
}
