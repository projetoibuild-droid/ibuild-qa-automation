package com.ibuild.qa.steps;

import com.ibuild.qa.config.TestConfig;
import com.ibuild.qa.pages.CommercePage;
import io.cucumber.java.After;
import io.cucumber.java.Before;
import io.cucumber.java.Scenario;
import io.cucumber.java.pt.Dado;
import io.cucumber.java.pt.Quando;
import io.cucumber.java.pt.Entao;
import org.junit.jupiter.api.Assertions;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

public class CommerceSteps {
    private WebDriver driver;
    private CommercePage page;

    @Before("@commerce")
    public void start() {
        ChromeOptions options=new ChromeOptions();
        if (TestConfig.headless()) options.addArguments("--headless=new");
        options.addArguments("--window-size=1440,900","--disable-dev-shm-usage");
        driver=new ChromeDriver(options);
        page=new CommercePage(driver);
    }

    @Dado("que navego para {string} no marketplace")
    public void navigate(String route) { page.open(route); }

    @Dado("que adicionei o porcelanato do catálogo ao carrinho")
    public void addProduct() { page.addFirstProduct(); }

    @Quando("clico na ação {string} do marketplace")
    public void click(String action) { page.click(action); }

    @Quando("informo {string} no campo {string} do marketplace")
    public void input(String value,String placeholder) { page.input(placeholder,value); }

    @Entao("devo encontrar {string} no marketplace")
    public void expectedText(String value) {
        Assertions.assertTrue(page.text(value),"Texto esperado não encontrado: "+value);
    }

    @Entao("a rota atual deve conter {string}")
    public void expectedRoute(String value) {
        Assertions.assertTrue(page.urlContains(value),"Rota inesperada: "+driver.getCurrentUrl());
    }

    @After("@commerce")
    public void stop(Scenario scenario) {
        if(driver==null) return;
        try{
            if(scenario.isFailed()){
                scenario.attach(((TakesScreenshot)driver).getScreenshotAs(OutputType.BYTES),
                    "image/png","evidencia-comercio");
            }
        }finally{driver.quit();}
    }
}
