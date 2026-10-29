
package com.local.market_finder;

public class LoginResponse {

    private Long id;
    private String sellerName;
    private String mobile;

    public LoginResponse(Long id, String sellerName, String mobile) {
        this.id = id;
        this.sellerName = sellerName;
        this.mobile = mobile;
    }

    public Long getId() {
        return id;
    }

    public String getSellerName() {
        return sellerName;
    }

    public String getMobile() {
        return mobile;
    }
}
