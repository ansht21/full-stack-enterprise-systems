package com.warehouse.dto;

public class DashboardDTO {

    private long totalProducts;
    private long totalCategories;
    private long totalSuppliers;
    private long lowStockItems;
    private long totalPurchases;
    private long totalSales;
    private java.math.BigDecimal totalPurchaseAmount;
    private java.math.BigDecimal totalSaleAmount;
    private java.util.List<RecentTransaction> recentPurchases;
    private java.util.List<RecentTransaction> recentSales;

    public long getTotalProducts() { return totalProducts; }
    public void setTotalProducts(long totalProducts) { this.totalProducts = totalProducts; }
    public long getTotalCategories() { return totalCategories; }
    public void setTotalCategories(long totalCategories) { this.totalCategories = totalCategories; }
    public long getTotalSuppliers() { return totalSuppliers; }
    public void setTotalSuppliers(long totalSuppliers) { this.totalSuppliers = totalSuppliers; }
    public long getLowStockItems() { return lowStockItems; }
    public void setLowStockItems(long lowStockItems) { this.lowStockItems = lowStockItems; }
    public long getTotalPurchases() { return totalPurchases; }
    public void setTotalPurchases(long totalPurchases) { this.totalPurchases = totalPurchases; }
    public long getTotalSales() { return totalSales; }
    public void setTotalSales(long totalSales) { this.totalSales = totalSales; }
    public java.math.BigDecimal getTotalPurchaseAmount() { return totalPurchaseAmount; }
    public void setTotalPurchaseAmount(java.math.BigDecimal totalPurchaseAmount) { this.totalPurchaseAmount = totalPurchaseAmount; }
    public java.math.BigDecimal getTotalSaleAmount() { return totalSaleAmount; }
    public void setTotalSaleAmount(java.math.BigDecimal totalSaleAmount) { this.totalSaleAmount = totalSaleAmount; }
    public java.util.List<RecentTransaction> getRecentPurchases() { return recentPurchases; }
    public void setRecentPurchases(java.util.List<RecentTransaction> recentPurchases) { this.recentPurchases = recentPurchases; }
    public java.util.List<RecentTransaction> getRecentSales() { return recentSales; }
    public void setRecentSales(java.util.List<RecentTransaction> recentSales) { this.recentSales = recentSales; }

    public static class RecentTransaction {
        private Long id;
        private String number;
        private String party;
        private java.math.BigDecimal amount;
        private java.time.LocalDate date;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getNumber() { return number; }
        public void setNumber(String number) { this.number = number; }
        public String getParty() { return party; }
        public void setParty(String party) { this.party = party; }
        public java.math.BigDecimal getAmount() { return amount; }
        public void setAmount(java.math.BigDecimal amount) { this.amount = amount; }
        public java.time.LocalDate getDate() { return date; }
        public void setDate(java.time.LocalDate date) { this.date = date; }
    }
}
