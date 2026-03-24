package iuh.fit.se.observer;

import java.util.ArrayList;
import java.util.List;

public class Stock implements Subject {
    private List<Observer> investors = new ArrayList<>();

    @Override
    public void attach(Observer observer) {
        investors.add(observer);
    }

    @Override
    public void detach(Observer observer) {
        investors.remove(observer);
    }

    @Override
    public void notifyObservers(String message) {
        for (Observer o : investors) {
            o.update(message);
        }
    }

    public void changePrice() {
        notifyObservers("Stock price changed!");
    }
}
