package com.ibuild.qa.steps;

import com.ibuild.qa.config.TestConfig;
import com.ibuild.qa.pages.HomePage;
import io.cucumber.java.After;
import io.cucumber.java.Before;
import io.cucumber.java.Scenario;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import java.nio.file.Files;
import java.nio.file.Path;
import org.junit.jupiter.api.Assertions;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

public class WebSteps {
    private WebDriver driver;
    private HomePage page;

    @Before("@web")
    public void setUp() {
        ChromeOptions options = new ChromeOptions();
        if (TestConfig.headless()) options.addArguments("--headless=new");
        options.addArguments("--window-size=1440,900", "--disable-dev-shm-usage", "--no-sandbox");
        driver = new ChromeDriver(options);
        page = new HomePage(driver);
    }

    @Given("que acesso a página inicial do IBuild")
    public void openHome() {
        page.open();
    }

    @Then("o frontend deve apresentar conteúdo visível")
    public void visibleContent() {
        Assertions.assertTrue(page.isRendered(), "A página não apresentou conteúdo visível");
    }

    @Then("o navegador deve apresentar um título")
    public void titlePresent() {
        Assertions.assertFalse(page.title().isBlank(), "O título do navegador está vazio");
    }

    @After("@web")
    public void tearDown(Scenario scenario) {
        if (driver == null) return;
        try {
            if (scenario.isFailed()) {
                byte[] screenshot = ((TakesScreenshot) driver).getScreenshotAs(OutputType.BYTES);
                scenario.attach(screenshot, "image/png", "falha-frontend");
            }
        } finally {
            driver.quit();
        }
    }
}
