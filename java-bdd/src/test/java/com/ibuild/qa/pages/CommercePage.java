package com.ibuild.qa.pages;

import com.ibuild.qa.config.TestConfig;
import java.time.Duration;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public final class CommercePage {
    private final WebDriver driver;
    private final WebDriverWait wait;
    public CommercePage(WebDriver driver) {
        this.driver=driver;
        wait=new WebDriverWait(driver,Duration.ofSeconds(15));
    }
    public void open(String route) {
        if (!route.matches("/[a-zA-Z0-9/?=&_-]+")) throw new IllegalArgumentException("Rota inválida");
        driver.get(TestConfig.webUrl()+route);
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.tagName("body")));
    }
    public boolean text(String text) {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(By.tagName("body"))).getText().contains(text);
    }
    public void click(String label) {
        wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//button[contains(normalize-space(.), '"+label+"')]"))).click();
    }
    public void input(String placeholder,String value) {
        var field=wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("input[placeholder='"+placeholder+"']")));
        field.clear();
        field.sendKeys(value);
    }
    public boolean urlContains(String fragment) {
        return wait.until(ExpectedConditions.urlContains(fragment));
    }
    public void addFirstProduct() {
        open("/product/p01");
        click("Carrinho");
    }
}
