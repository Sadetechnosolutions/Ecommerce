package com.SadeTechoSolution.Cart.Controller;

import com.SadeTechoSolution.Cart.Model.CartItem;
import com.SadeTechoSolution.Cart.Service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cart")
public class CartController {
    @Autowired
    private CartService cartService;

    @PostMapping("/add")
    public ResponseEntity<CartItem> addToCart(@RequestBody CartItem item) {
        CartItem addedItem = cartService.addToCart(item);
        return ResponseEntity.ok(addedItem);
    }

    @GetMapping("/items")
    public ResponseEntity<List<CartItem>> getCartItems() {
        List<CartItem> items = cartService.getCartItems();
        return ResponseEntity.ok(items);
    }
}
