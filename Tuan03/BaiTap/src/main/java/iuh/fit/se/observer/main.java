package iuh.fit.se.observer;

public class main {
    public static void main(String[] args) {
        Stock stock = new Stock();

        Investor a = new Investor("Minh");
        Investor b = new Investor("Duc");

        stock.attach(a);
        stock.attach(b);

        stock.changePrice();
    }
}
