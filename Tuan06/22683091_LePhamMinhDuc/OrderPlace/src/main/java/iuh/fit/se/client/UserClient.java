package iuh.fit.se.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;

@FeignClient(name = "user-service", url = "https://172.28.50.49/8081/api")
public interface UserClient {
    @GetMapping("/users")
    List<User> getUsers();
}