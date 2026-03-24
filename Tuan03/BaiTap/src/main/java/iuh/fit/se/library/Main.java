package iuh.fit.se.library;

import iuh.fit.se.library.decoration.BasicBorrow;
import iuh.fit.se.library.decoration.BorrowBook;
import iuh.fit.se.library.decoration.ExtendTime;
import iuh.fit.se.library.factory.Book;
import iuh.fit.se.library.factory.BookFactory;
import iuh.fit.se.library.observer.LibraryNotification;
import iuh.fit.se.library.observer.User;
import iuh.fit.se.library.singleton.Library;

public class Main {

        public static void main(String[] args) {

            Library library = Library.getInstance();

            Book b1 = BookFactory.createBook(
                    "paper",
                    "Java",
                    "Duc",
                    "IT");

            library.addBook(b1);

            User u1 = new User("Minh");

            LibraryNotification notify = new LibraryNotification();

            notify.attach(u1);

            notify.notifyObservers("New Book Added");

            BorrowBook borrow = new ExtendTime(
                    new BasicBorrow());

            borrow.borrow();
        }
    }

