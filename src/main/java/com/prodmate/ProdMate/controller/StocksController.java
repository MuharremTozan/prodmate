package com.prodmate.ProdMate.controller;

import com.prodmate.ProdMate.model.Stock;
import com.prodmate.ProdMate.service.StocksService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stocks")
public class StocksController {

    @Autowired
    private StocksService stocksService;

    @GetMapping("/user/{userId}")
    public List<Stock> getStocksByUserId(@PathVariable Long userId) {
        return stocksService.getStocksByUserId(userId);
    }

    @PostMapping("/user/{userId}")
    public Stock addStock(@PathVariable Long userId, @RequestBody Stock stock) {
        if (stock.getIsStockable() == null) {
            throw new IllegalArgumentException("isStockable is null");
        }
        return stocksService.addStock(userId, stock);
    }

    @DeleteMapping("/{stockId}")
    public void deleteStock(@PathVariable Long stockId) {
        stocksService.deleteStock(stockId);
    }
}
