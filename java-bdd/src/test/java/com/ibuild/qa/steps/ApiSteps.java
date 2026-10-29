package com.ibuild.qa.steps;

import com.ibuild.qa.config.TestConfig;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.When;
import io.cucumber.java.en.Then;
import io.restassured.RestAssured;
import io.restassured.response.Response;
import org.junit.jupiter.api.Assertions;

public class ApiSteps {
    private String path;
    private Response response;

    @Given("que o endpoint de saúde da API está configurado")
    public void configureHealthEndpoint() {
        path = TestConfig.healthPath();
    }

    @When("consulto o endpoint via GET")
    public void callGet() {
        response = RestAssured.given()
                .baseUri(TestConfig.apiUrl())
                .accept("*/*")
                .when().get(path);
    }

    @Then("a API deve responder com status de sucesso")
    public void verifySuccess() {
        Assertions.assertNotNull(response, "Nenhuma resposta recebida");
        Assertions.assertTrue(response.statusCode() >= 200 && response.statusCode() < 300,
                "Status HTTP inesperado: " + response.statusCode() + "; body=" + response.asString());
    }

    @Then("o tempo de resposta deve ser inferior a {int} milissegundos")
    public void verifyTime(int maxMillis) {
        Assertions.assertTrue(response.time() < maxMillis,
                "Tempo de resposta " + response.time() + "ms excedeu " + maxMillis + "ms");
    }
}
