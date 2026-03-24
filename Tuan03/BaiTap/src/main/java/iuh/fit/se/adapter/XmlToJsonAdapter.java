package iuh.fit.se.adapter;

public class XmlToJsonAdapter {
    private XmlService xmlService;

    public XmlToJsonAdapter(XmlService xmlService) {
        this.xmlService = xmlService;
    }

    public void sendJson() {

        String xml = xmlService.getXml();

        String json = convertXmlToJson(xml);

        System.out.println("Converted to JSON: " + json);
    }

    private String convertXmlToJson(String xml) {
        return "{ data: 'hello' }";
    }
}
