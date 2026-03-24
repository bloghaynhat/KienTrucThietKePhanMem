package iuh.fit.se.library.observer;

import java.util.ArrayList;
import java.util.List;

public class LibraryNotification implements Subject{
    List<Observer> observers = new ArrayList<>();

    public void attach(Observer o) {
        observers.add(o);
    }

    @Override
    public void detach(Observer o) {

    }

    public void notifyObservers(String msg) {

        for (Observer o : observers) {
            o.update(msg);
        }
    }
}
