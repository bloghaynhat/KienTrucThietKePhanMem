package iuh.fit.se.adapter;

public class main {
    public static void main(String[] args) {

        XmlService xml = new XmlService();

        XmlToJsonAdapter adapter = new XmlToJsonAdapter(xml);

        adapter.sendJson();
    }
}
