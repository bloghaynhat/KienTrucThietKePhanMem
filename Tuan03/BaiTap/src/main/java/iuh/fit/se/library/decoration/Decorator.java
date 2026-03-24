package iuh.fit.se.library.decoration;

abstract class BorrowDecorator extends BorrowBook {

    protected BorrowBook borrowBook;

    public BorrowDecorator(BorrowBook borrowBook) {
        this.borrowBook = borrowBook;
    }
}
