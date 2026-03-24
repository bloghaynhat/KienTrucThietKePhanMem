package iuh.fit.se.library.decoration;

public class ExtendTime extends BorrowDecorator {

    public ExtendTime(BorrowBook borrowBook) {
        super(borrowBook);
    }

    public void borrow() {

        borrowBook.borrow();

        System.out.println("Extend borrow time");
    }
}
