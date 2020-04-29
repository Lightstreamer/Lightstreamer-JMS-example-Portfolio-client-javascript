/*
  LIGHTSTREAMER - www.lightstreamer.com
  JMS Portfolio Demo

  Copyright (c) Lightstreamer Srl

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

import grid from './grid.js';

// Lightstreamer JMS Portfolio Demo
// Table Management

//////////////// Portfolio Table Management

// The current portfolio should be chosen by the user according to the user profile;
// in this sample, user authentication is not included and a single portfolio is
// shared among all the connected users
var portfolioId = "portfolio1";

//////////////// Connection setup

//Let's define the initial sorting column
grid.changeSort("key");

jms.ConnectionFactory.createConnection("http://localhost:8080/", "ActiveMQ", null, null, {
  onConnectionCreated: function (conn) {

    // This listener will be used to reroute updates from the JMS consumers to
    // the UI
    var messageListener = {
      onMessage: function (message) {
        var portfolioMessage = message.getObject();
        grid.updateRow(portfolioMessage.key, portfolioMessage);
      }
    };

    // JMS Setup

    // Create a session
    var session = conn.createSession(false, "PRE_ACK");

    // Create the queue that will be used to send requests to the service
    var queue = session.createQueue("portfolioQueue");
    var producer = session.createProducer(queue, null);

    // Create the topic, updates to the portfolio status will be received here
    var topic = session.createTopic("portfolioTopic");
    var consumer = session.createConsumer(topic, null);
    consumer.setMessageListener(messageListener);

    // We'll ask the service about the current status of the portfolio, the
    // answer will arrive on this temporary queue
    session.createTemporaryQueue(function (tempQueue) {
      // Temp queue ready, attach a listener
      var responseConsumer = session.createConsumer(tempQueue);
      responseConsumer.setMessageListener(messageListener);

      // Create the request
      var statusRequest = session.createMapMessage();
      statusRequest.setObject("request", "GET_PORTFOLIO_STATUS");
      statusRequest.setObject("portfolio", portfolioId);

      // Set the reply to field to the temp queue created above, so the service 
      // knows where to answer
      statusRequest.setJMSReplyTo(tempQueue);

      // We might use a correlation id to match request/response
      // var correlationId = new Date().getTime() + "" + Math.round(Math.random()*1000);
      // statusRequest.setJMSCorrelationID(correlationId);
      producer.send(statusRequest);
    });

    // Start the connection
    conn.start();

    // Setup the user-input part of the UI

    // Fill the select with some stocks that can be bought/sold
    var AVAIL_STOCKS = 31;
    for (var i = 1; i <= AVAIL_STOCKS; i++) {
      var item = "item" + i;
      $("#stockN").append($("<option />").val(item).text(item));
    }

    // Attach the handler to the buy/sell buttons
    $(":submit").click(function (event) {
      event.preventDefault();

      var qty = Number($("#qtyN").val());
      if (!qty || qty < 0) {
        alert("Please fill the 'quantity' field with a positive number.");
        return;
      }

      var buyRequest = session.createMapMessage();
      buyRequest.setObject("request", $(this).val().toUpperCase());
      buyRequest.setObject("portfolio", portfolioId);
      buyRequest.setObject("stock", $("#stockN").val());
      buyRequest.setObject("quantity", qty);
      producer.send(buyRequest);
    });

    //enable form
    $("input").prop('disabled', false);

  },

  onConnectionFailed: function (errorCode, errorMessage) {
    // Connection failed, show the error
    alert("Error: " + errorCode + " " + errorMessage);
  },

  onLSClient: function (lsClient) {
    lsClient.addListener(new StatusWidget("left", "0px", true));
  }
});

