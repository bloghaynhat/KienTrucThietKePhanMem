package iuh.fit.se.service;

import iuh.fit.se.client.User;
import iuh.fit.se.client.UserClient;
import iuh.fit.se.client.FoodClient;
import iuh.fit.se.client.Food;
import iuh.fit.se.dto.CreateOrderRequest;
import iuh.fit.se.dto.ItemRequest;
import iuh.fit.se.entity.Order;
import iuh.fit.se.entity.OrderItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private UserClient userClient;

    @Autowired
    private FoodClient foodClient;

    private List<Order> orders = new ArrayList<>();

    public Order createOrder(CreateOrderRequest request) {
        boolean exists = userClient.getUsers()
                .stream()
                .anyMatch(u -> u.getId().equals(request.getUserId()));

        if (!exists) {
            throw new RuntimeException("User không tồn tại");
        }

        List<OrderItem> items = new ArrayList<>();
        double total = 0;

        for (ItemRequest req : request.getItems()) {
            Food food = foodClient.getFood(req.getFoodId());
            OrderItem item = new OrderItem();
            item.setFoodId(food.getId());
            item.setFoodName(food.getName());
            item.setPrice(food.getPrice());
            item.setQuantity(req.getQuantity());
            total += food.getPrice() * req.getQuantity();
            items.add(item);
        }

        Order order = new Order();
        order.setId(System.currentTimeMillis());
        order.setUserId(request.getUserId());
        order.setItems(items);
        order.setTotalPrice(total);
        order.setStatus("CREATED");

        orders.add(order);

        return order;
    }

    public List<Order> getOrders() {
        return orders;
    }

    public Order updateOrderStatus(Long id, String status) {
    for (Order order : orders) {
        if (order.getId().equals(id)) {
            order.setStatus(status);
            return order;
        }
    }
    throw new RuntimeException("Order không tồn tại");
}
    public List<User> getAllUsers() {return userClient.getUsers();}

}