package iuh.fit.se.composite;

public class main {
    public static void main(String[] args) {
        Folder root = new Folder("Root");
        File file1 = new File("File1.txt");
        File file2 = new File("File2.txt");
        Folder subFolder = new Folder("SubFolder");
        File file3 = new File("File3.txt");

        root.add(file1);
        root.add(file2);
        root.add(subFolder);
        subFolder.add(file3);

        root.display();
    }
}
