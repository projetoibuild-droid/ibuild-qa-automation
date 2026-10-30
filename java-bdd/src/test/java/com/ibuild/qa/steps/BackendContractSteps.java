package com.ibuild.qa.steps;

import com.ibuild.qa.config.TestConfig;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.When;
import io.cucumber.java.en.Then;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import org.junit.jupiter.api.Assertions;
import java.util.Map;

public final class BackendContractSteps {
    private Response response;
    private String token;
    private String body;

    @Given("que preparo um corpo JSON {string}")
    public void json(String payload) { body=payload; }

    @Given("que estou sem token de autenticação")
    public void noToken() { token=null; }

    @Given("que utilizo token inválido")
    public void invalidToken() { token="invalid.token.value"; }

    @When("envio uma requisição {string} para {string}")
    public void request(String method,String path) {
        var spec=RestAssured.given().baseUri(TestConfig.apiUrl()).accept(ContentType.JSON);
        if(token!=null) spec.header("Authorization","Bearer "+token);
        if(body!=null) spec.contentType(ContentType.JSON).body(body);
        response=spec.when().request(method,path);
    }

    @Then("o status HTTP deve ser {int}")
    public void status(int code) {
        Assertions.assertNotNull(response);
        Assertions.assertEquals(code,response.statusCode(),response.asString());
    }

    @Then("a resposta JSON deve conter a propriedade {string}")
    public void property(String path) {
        Assertions.assertNotNull(response.jsonPath().get(path),"Ausente: "+path);
    }

    @Then("a resposta JSON deve ter a mensagem {string}")
    public void message(String expected) {
        Assertions.assertEquals(expected,response.jsonPath().getString("error"));
    }
}
