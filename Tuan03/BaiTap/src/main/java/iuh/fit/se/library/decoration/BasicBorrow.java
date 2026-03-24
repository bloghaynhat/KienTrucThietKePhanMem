package iuh.fit.se.library.decoration;

public class BasicBorrow extends BorrowBook{
    @Override
    public void borrow() {
        System.out.println("Borrowing a book...");
    }
}
