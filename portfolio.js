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
// Table Management

//////////////// Portfolio Table Management

// The current portfolio should be chosen by the user according to the user profile;
// in this sample, user authentication is not included and a single portfolio is
// shared among all the connected users
var portfolioId= "portfolio1";

//////////////// Connection setup

var queueSession= null;

require(["ConnectionFactory", "./grid", "StatusWidget"], function(ConnectionFactory, grid, StatusWidget) {
  ConnectionFactory.createConnection(function(conn) {

    // Connection succeeded, topic subscription
    var topicSession= conn.createSession(false, "PRE_ACK");
    var topic= topicSession.createTopic("portfolioTopic");
    var consumer= topicSession.createConsumer(topic, null);

    

    // Let's define the initial sorting column
    grid.changeSort("key");

    // Add listener to message consumer
    consumer.setMessageListener({
      onMessage: function(message) {

        // Message received
        var portfolioMessage= message.getObject();
        
        // Update the grid
        grid.updateRow(portfolioMessage.key, portfolioMessage);
      }
    });

    // Start the connection
    conn.start();
    
    //enable form
    $("input").prop('disabled', false);

    // Wait a moment before subscribing to avoid the subscribe
    // message to get to the service before the topic subscription
    // is actually started
    setTimeout(function() {

      // Send subscription message for portfolio
      queueSession= conn.createSession(false, "AUTO_ACK");
      var queue= queueSession.createQueue("portfolioQueue");
      var producer= queueSession.createProducer(queue, null);

      var msg= queueSession.createTextMessage("SUBSCRIBE|" + portfolioId);
      producer.send(msg);

    }, 500);

  }, function(errorCode, errorMessage) {

    // Connection failed, show the error
    alert("Error: " + errorCode + " " + errorMessage);

  }, "http://localhost:8080/", "JMS", "HornetQ",  // Change data adapter here
    null, null, function(lsClient) {

    // Enable connection sharing and status widget (optional)
    lsClient.connectionSharing.enableSharing("JMSDemoCommonConnection", "ATTACH", "CREATE");
    lsClient.addListener(new StatusWidget("left", "0px", true));

  });
});
