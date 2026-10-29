package com.ibuild.qa.pages;

import com.ibuild.qa.config.TestConfig;
import java.time.Duration;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public final class HomePage {
    private final WebDriver driver;
    private final WebDriverWait wait;

    public HomePage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(15));
    }

    public void open() {
        driver.get(TestConfig.webUrl());
    }

    public boolean isRendered() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.tagName("body")))
            .getText().trim().length() > 0;
    }

    public String title() {
        return driver.getTitle();
    }
}
