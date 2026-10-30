package com.ibuild.qa.steps;

import com.ibuild.qa.config.TestConfig;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.When;
import io.cucumber.java.en.Then;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import org.junit.jupiter.api.Assertions;
import java.util.UUID;

public class BackendJourneySteps {
    private String email;
    private String password="QaStrong123!";
    private String token;
    private String productId;
    private Response response;

    private io.restassured.specification.RequestSpecification request() {
        var spec=RestAssured.given().baseUri(TestConfig.apiUrl()).contentType(ContentType.JSON).accept(ContentType.JSON);
        if(token!=null) spec.header("Authorization","Bearer "+token);
        return spec;
    }
    @Given("que cadastro um comprador exclusivo para o teste")
    public void register() {
        email="qa-"+UUID.randomUUID()+"@example.test";
        response=request().body(java.util.Map.of("name","QA Integration","email",email,"password",password))
                .post("/api/auth/register");
        Assertions.assertEquals(201,response.statusCode(),response.asString());
        token=response.jsonPath().getString("token");
        Assertions.assertNotNull(token);
    }
    @Given("que tenho um comprador autenticado")
    public void authenticated() { register(); }

    @Given("que uso uma sessão sem autorização")
    public void unauthenticated() {token=null;}

    @When("consulto o perfil pela API")
    public void profile(){response=request().get("/api/users/me");}

    @When("consulto os pedidos pela API")
    public void listOrders(){response=request().get("/api/orders");}

    @When("tento cadastrar um produto como comprador")
    public void createForbiddenProduct(){
        response=request().body(java.util.Map.of("name","Produto QA","priceCents",1000,"stock",2))
                .post("/api/products");
    }
    @When("tento cadastrar novamente o mesmo endereço de email")
    public void duplicateRegistration(){
        response=request().body(java.util.Map.of("name","QA Integration","email",email,"password",password))
                .post("/api/auth/register");
    }
    @When("faço login com as credenciais cadastradas")
    public void login(){
        response=request().body(java.util.Map.of("email",email,"password",password)).post("/api/auth/login");
    }
    @When("faço login com senha incorreta")
    public void badLogin(){
        response=request().body(java.util.Map.of("email",email,"password","invalid-123")).post("/api/auth/login");
    }
    @When("envio um pedido sem itens")
    public void emptyOrder(){
        response=request().body(java.util.Map.of("items",java.util.List.of())).post("/api/orders");
    }
    @When("envio um pedido com produto inexistente")
    public void missingProduct(){
        response=request().body(java.util.Map.of("items",
                java.util.List.of(java.util.Map.of("productId","does-not-exist","quantity",1)))).post("/api/orders");
    }
    @When("envio um pedido com produtos repetidos")
    public void duplicateItems(){
        var item=java.util.Map.of("productId","does-not-exist","quantity",1);
        response=request().body(java.util.Map.of("items",java.util.List.of(item,item))).post("/api/orders");
    }
    @When("envio um pedido com quantidade inválida {int}")
    public void invalidQuantity(int quantity){
        response=request().body(java.util.Map.of("items",
                java.util.List.of(java.util.Map.of("productId","does-not-exist","quantity",quantity)))).post("/api/orders");
    }
    @Then("a resposta do fluxo deve ter status {int}")
    public void assertStatus(int expected){
        Assertions.assertNotNull(response);
        Assertions.assertEquals(expected,response.statusCode(),response.asString());
    }
    @Then("a resposta do fluxo deve conter {string}")
    public void assertField(String path){
        Assertions.assertNotNull(response.jsonPath().get(path),"Propriedade ausente: "+path);
    }
    @Then("o resultado deve incluir o email cadastrado")
    public void assertEmail(){
        Assertions.assertEquals(email,response.jsonPath().getString("user.email"));
    }
    @Then("a resposta do fluxo deve ter erro {string}")
    public void assertError(String value){
        Assertions.assertEquals(value,response.jsonPath().getString("error"));
    }
}
