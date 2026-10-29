package com.ibuild.qa.steps;

import com.ibuild.qa.config.TestConfig;
import com.ibuild.qa.pages.ScreenPage;
import io.cucumber.java.After;
import io.cucumber.java.Before;
import io.cucumber.java.Scenario;
import io.cucumber.java.pt.Dado;
import io.cucumber.java.pt.Entao;
import io.cucumber.java.pt.Quando;
import org.junit.jupiter.api.Assertions;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

public class ScreenSteps {
    private WebDriver driver;
    private ScreenPage page;

    @Before("@screens")
    public void before() {
        ChromeOptions options = new ChromeOptions();
        if (TestConfig.headless()) options.addArguments("--headless=new");
        options.addArguments("--window-size=1440,900", "--disable-dev-shm-usage");
        driver = new ChromeDriver(options);
        page = new ScreenPage(driver);
    }

    @Dado("que estou na rota {string} do IBuild")
    public void openRoute(String route) {
        page.open(route);
    }

    @Entao("devo visualizar o texto {string}")
    public void assertText(String text) {
        Assertions.assertTrue(page.hasVisibleText(text), "Texto não encontrado: " + text);
    }

    @Quando("preencho o campo {string} com {string}")
    public void fill(String placeholder, String value) {
        page.type(placeholder, value);
    }

    @Quando("clico no botão {string}")
    public void click(String label) {
        page.submit(label);
    }

    @After("@screens")
    public void after(Scenario scenario) {
        if (driver == null) return;
        try {
            if (scenario.isFailed()) scenario.attach(
                    ((TakesScreenshot) driver).getScreenshotAs(OutputType.BYTES),
                    "image/png", "falha-tela");
        } finally {
            driver.quit();
        }
    }
}
