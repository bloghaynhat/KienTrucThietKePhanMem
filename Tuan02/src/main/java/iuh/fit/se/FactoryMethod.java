//package iuh.fit.se;
////ANimal
//interface Animal{
//    void displayBehavior();
//}
////Dog
//class Dog implements Animal{
//    public Dog(){
//        System.out.println("\nA dog is created.");
//    }
//    public void displayBehavior(){
//        System.out.println("It says: Bow-Wow.");
//        System.out.println ("It prefers barking.");
//    }
//}
//
//// Tiger.java
//class Tiger implements Animal{
//    public Tiger() {
//        System.out.println("\nA tiger is created.");
//    }
//    public void displayBehavior(){
//        System.out.println("Tiger says: Halum.");
//        System.out.println("It loves to roam in a jungle.");
//    }
//}
//
//// AnimalFactory.java
//abstract class AnimalFactory{
//    protected abstract Animal createAnimal();
//}
//// DogFactory.java
//class DogFactory extends AnimalFactory
//{
//    @Override
//    protected Animal createAnimal() {
//        return new Dog();
//    }
//}
////TigerFactory.java
//class TigerFactory extends AnimalFactory{
//    @Override
//    protected Animal createAnimal() {
//        return new Tiger();
//    }
//}
//public class FactoryMethod {
//    public static void main(String[] args) {
//        System.out.println("***Factory Method Pattern Demo.***");
//        AnimalFactory factory;
//        Animal animal;
//// Create a tiger and display its behavior
//// using TigerFactory.
//        factory =new TigerFactory();
//        animal = factory.createAnimal();
//        animal.displayBehavior();
//// Create a dog and display its behavior
//// using DogFactory.
//        factory =new DogFactory();
//        animal = factory.createAnimal();
//        animal.displayBehavior();
//    }
//}
