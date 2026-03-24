package iuh.fit.se.library.observer;

public interface Subject {
    void attach(Observer o);

    void detach(Observer o);

    void notifyObservers(String msg);
}
