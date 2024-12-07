package com.prodmate.ProdMate.service;

import com.prodmate.ProdMate.model.Stock;
import com.prodmate.ProdMate.model.User;
import com.prodmate.ProdMate.repository.StocksRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StocksService {

    @Autowired
    private StocksRepository stocksRepository;

    public List<Stock> getStocksByUserId(Long userId) {
        return stocksRepository.findByUserUserId(userId);
    }

    public Stock addStock(Long userId, Stock stock) {
        User user = new User();
        user.setUserId(userId);
        stock.setUser(user);

        return stocksRepository.save(stock);
    }

    public Stock updateStock(Long stockId, Stock stockDetails) {
        return stocksRepository.findById(stockId).map(stock -> {
            stock.setName(stockDetails.getName());
            stock.setPurchasePrice(stockDetails.getPurchasePrice());
            return stocksRepository.save(stock);
        }).orElseThrow(() -> new RuntimeException("Stock not found with ID: " + stockId));
    }

    public void deleteStock(Long stockId) {
        if (stocksRepository.existsById(stockId)) {
            stocksRepository.deleteById(stockId);
        } else {
            throw new RuntimeException("Stock not found with ID: " + stockId);
        }
    }
}
