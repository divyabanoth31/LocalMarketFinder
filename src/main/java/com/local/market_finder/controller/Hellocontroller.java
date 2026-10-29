package com.local.market_finder.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController

public class Hellocontroller {
  //localhost:3108/hello 
	@GetMapping("/hello")
    public String sayHello() {
        return "Welcome to Local Market Finder!";
    }
 
}
