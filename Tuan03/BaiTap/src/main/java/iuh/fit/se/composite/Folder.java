package iuh.fit.se.composite;

import java.util.ArrayList;
import java.util.List;

public class Folder implements Component {
    private String name;
    private List<Component> components = new ArrayList<>();

    public Folder(String name) {
        this.name = name;
    }

    public void add(Component component) {
        components.add(component);
    }

    public void  remove(Component component) {
        components.remove(component);
    }

    @Override
    public void display() {
        System.out.println("Folder: " + name);
        for (Component component : components) {
            component.display();
        }
    }
}
