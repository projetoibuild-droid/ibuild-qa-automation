package com.ibuild.qa.runner;

import static io.cucumber.junit.platform.engine.Constants.GLUE_PROPERTY_NAME;
import org.junit.platform.suite.api.ConfigurationParameter;
import org.junit.platform.suite.api.IncludeEngines;
import org.junit.platform.suite.api.SelectClasspathResource;
import org.junit.platform.suite.api.Suite;

@Suite
@IncludeEngines("cucumber")
@SelectClasspathResource("features")
@ConfigurationParameter(key = GLUE_PROPERTY_NAME, value = "com.ibuild.qa.steps")
@ConfigurationParameter(key = "cucumber.plugin", value = "pretty,html:target/cucumber-report.html,json:target/cucumber-report.json")
public class RunCucumberTest {}
