package iuh.fit.se.controller;

import iuh.fit.se.client.User;
import iuh.fit.se.dto.CreateOrderRequest;
import iuh.fit.se.dto.UpdateOrderStatusRequest;
import iuh.fit.se.entity.Order;
import iuh.fit.se.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    public Order createOrder(@RequestBody CreateOrderRequest request) {
        return orderService.createOrder(request);
    }

    @GetMapping
    public List<Order> getOrders() {
        return orderService.getOrders();
    }

    @PutMapping("/{id}/status")
    public Order updateOrderStatus(@PathVariable Long id, @RequestBody UpdateOrderStatusRequest request) {
        return orderService.updateOrderStatus(id, request.getStatus());
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return orderService.getAllUsers();
    }
}