import QUnit from "steal-qunit";
import F from "funcunit";
import "./phone.component!";
import $ from "jquery";
import stache from "can/view/stache/";
import Order from "app/models/order";

F.attach(QUnit);

QUnit.module("phone.component", {
  setup: function(){
    let order = new Order();
    let template = stache("<phone-validator order='{order}'></phone-validator>");
    let frag = template({ order });
    $("#qunit-fixture").html(frag);
  }
});

QUnit.test("Error if number contains a letter", function(){
  F(".form-group").hasClass("has-error", false, "No error to start");
  F("input").exists().click().type("foo");
  F(".form-group").hasClass("has-error", true, "There is an error because 'foo' is not a number");
});

QUnit.test("Error goes away after error is fixed", function(){
  F(".form-group").hasClass("has-error", false, "No error to start");
  F("input").exists().click().type("foo");
  F(".form-group").hasClass("has-error", true, "There is an error because 'foo' is not a number");

  F("input").click().type("\b\b\b333");
  F(".form-group").hasClass("has-error", false, "Error has gone away");
});
