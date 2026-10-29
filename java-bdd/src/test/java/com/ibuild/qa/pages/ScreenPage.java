package com.ibuild.qa.pages;

import com.ibuild.qa.config.TestConfig;
import java.time.Duration;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class ScreenPage {
    private final WebDriver driver;
    private final WebDriverWait wait;

    public ScreenPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(15));
    }

    public void open(String route) {
        if (!route.startsWith("/") || route.startsWith("//")) throw new IllegalArgumentException("Rota inválida");
        driver.get(TestConfig.webUrl() + route);
        wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("#root")));
    }

    public boolean hasVisibleText(String text) {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.tagName("body")))
                .getText().contains(text);
    }

    public void type(String placeholder, String value) {
        wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.cssSelector("input[placeholder='" + placeholder + "']"))).sendKeys(value);
    }

    public void submit(String label) {
        wait.until(ExpectedConditions.elementToBeClickable(
                By.xpath("//button[contains(normalize-space(.), '" + label + "')]"))).click();
    }
}
