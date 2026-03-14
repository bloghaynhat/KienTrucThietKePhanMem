package iuh.fit.se;

// Abstract Factory.java
abstract class AnimalFactory
{
    protected abstract Tiger createTiger(String color);
    protected abstract Dog createDog(String color);
}

// Abstract Product-1
// Tiger.java
interface Tiger
{
    void aboutMe();
    void inviteDog(Dog dog);
}
// Abstract Product-2
// Dog.java
interface Dog
{
    void displayMe();
}

class WildAnimalFactory extends AnimalFactory {
    public WildAnimalFactory() {
        System.out.println("You opt for a wild animal factory.\n");
    }
    @Override
    public Tiger createTiger(String color) {
        return new WildTiger(color);
    }
    @Override
    public Dog createDog(String color) {
        return new WildDog(color);
    }
}

class WildTiger implements Tiger {
    public WildTiger(String color) {
        System.out.println("A wild tiger with " + color + "color is created.");

    }
    @Override
    public void aboutMe() {
        System.out.println("The " + this + " says: I prefer hunting in jungles.Halum.");

    }
    @Override
    public void inviteDog(Dog dog) {
        System.out.println("The " + this + " says: I saw a " + dog + " in the jungle.");

    }
    @Override
    public String toString() {
        return "wild tiger";
    }
}

class WildDog implements Dog {
    public WildDog(String color) {
        System.out.println("A wild dog with " + color + " color is created.");

    }
    @Override
    public void displayMe() {
        System.out.println("The " + this + " says: I prefer to roam freely in jungles. Bow-Wow.");

    }
    @Override
    public String toString() {
        return "wild dog";
    }
}
public class AbstractFactory {
}
