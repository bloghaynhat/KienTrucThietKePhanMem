package iuh.fit.se.dto;

public class ItemRequest {
    private Long foodId;
    private int quantity;

    // getters and setters
    public Long getFoodId() { return foodId; }
    public void setFoodId(Long foodId) { this.foodId = foodId; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
}

