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

class PetAnimalFactory extends AnimalFactory {
    public PetAnimalFactory() {
        System.out.println("You opt for a pet animal factory.\n");
    }
    @Override
    public Tiger createTiger(String color) {
        return new PetTiger(color);
    }
    @Override
    public Dog createDog(String color) {
        return new PetDog(color);
    }
}

class PetTiger implements Tiger {
    public PetTiger(String color) {
        System.out.println("A pet tiger with " + color + "color is created.");

    }
    public void aboutMe() {
        System.out.println("The " + this + " says: Halum. I play in an animal circus.");

    }
    public void inviteDog(Dog dog) {
        System.out.println("The " + this + " says: I saw a" + dog + " in my town.");

    }
    @Override
    public String toString() {
        return "pet tiger";
    }
}
class PetDog implements Dog {
    public PetDog(String color) {
        System.out.println("A pet dog with " + color + "color is created.");

    }
    @Override
    public void displayMe() {
        System.out.println("The " + this + " says: Bow-Wow. I prefer to stay at home.");

    }
    @Override
    public String toString() {
        return "pet dog";
    }
}
public class AbstractFactory {
    public static void main(String[] args) {
        System.out.println("***Abstract Factory Pattern Demo.***\n");
        AnimalFactory animalFactory;
// Making a wild dog and wild tiger through

// WildAnimalFactory
        animalFactory = new WildAnimalFactory();
        Dog dog = animalFactory.createDog("white");
        Tiger tiger = animalFactory.createTiger("golden and cinnamon");
        dog.displayMe();
        tiger.aboutMe();
        tiger.inviteDog(dog);
        System.out.println("\n************\n");
// Making a pet dog and pet tiger through
// PetAnimalFactory now.
        animalFactory = new PetAnimalFactory();
        dog = animalFactory.createDog("black");
        tiger = animalFactory.createTiger("yellow");
        dog.displayMe();
        tiger.aboutMe();
        tiger.inviteDog(dog);}
}
