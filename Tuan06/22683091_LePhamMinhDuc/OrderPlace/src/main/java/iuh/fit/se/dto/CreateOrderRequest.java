package iuh.fit.se.dto;

import java.util.List;

public class CreateOrderRequest {
    private Long userId;
    private List<ItemRequest> items;

    // getters and setters
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public List<ItemRequest> getItems() { return items; }
    public void setItems(List<ItemRequest> items) { this.items = items; }
}