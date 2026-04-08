package iuh.fit.se.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "food-service", url = "https://172.16.x.x:8080")
public interface FoodClient {
    @GetMapping("/foods/{id}")
    Food getFood(@PathVariable("id") Long id);
}