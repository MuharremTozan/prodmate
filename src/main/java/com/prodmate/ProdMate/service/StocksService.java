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

        if (!stock.getIsStockable()) {
            stock.setAmount(0);
        }

        return stocksRepository.save(stock);
    }

    public void deleteStock(Long stockId) {
        stocksRepository.deleteById(stockId);
    }
}
