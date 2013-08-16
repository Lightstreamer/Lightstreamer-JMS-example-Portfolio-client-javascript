/*
Copyright 2013 Weswit Srl

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

// Lightstreamer JMS Portfolio Demo
// Order Entry Management

//////////////// Drop-down List Composition

// The list of stocks available on the market would be normally provided
// by an application server, based on some search criteria and on the user
// profile. In this sample, we will simply hard-wire on the Client the list

var availStocks= ["item1","item2","item3","item4","item5",
                  "item6","item7","item8","item9","item10",
                  "item11","item12","item13","item14","item15",
                  "item16", "item17", "item18", "item19", "item20",
                  "item21", "item22", "item23", "item24", "item25",
                  "item26", "item27", "item28", "item29", "item30"];

// Populate the HTML select element
var select = document.getElementById("stockN");
for (var i = 0; i < availStocks.length; i++) {
	var option= document.createElement("option");
	if (i == 0)
		option.selected= true;

	option.value= availStocks[i];
	option.innerHTML= availStocks[i];
	select.appendChild(option);
}

//////////////// Order Submission Management

function submitForm(op) {
	var name= document.getElementById("stockN");
	var qtyN= document.getElementById("qtyN");

	if (!window.portfolioId || !op || !name || !qtyN) {

		// This shouldn't happen
		return;
	}

	name= name.value;
	qtyN= qtyN.value;

	if (!qtyN || !name) {
		alert("No empty fields admitted. Please fill the 'quantity' field and choose a stock.");

	} else {
		var wrong = false;

		if (isNaN(qtyN)) {
		  alert("Only digits are admitted for the 'quantity' field. Please re-type the value.");
		  return;
		}

		var mex= op + "|" + portfolioId + "|" + name + "|" + qtyN;

		// Send message to portfolio queue
		var queue= queueSession.createQueue("portfolioQueue");
		var producer= queueSession.createProducer(queue, null);

		var msg= queueSession.createTextMessage(mex);
		producer.send(msg);
	}
}
