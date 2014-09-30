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
  
  //Let's define the initial sorting column
  grid.changeSort("key");
  
  ConnectionFactory.createConnection("http://localhost:8080/", "JMS", "HornetQ", null, null, {
    onConnectionCreated: function(conn) {
      
      var session = conn.createSession(false, "PRE_ACK");
      
      
      var messageListener = {
          onMessage: function(message) {
            var portfolioMessage= message.getObject();
            grid.updateRow(portfolioMessage.key,portfolioMessage);
          }
      };
      
      
      
      //create the queue that will be used to send requests/messages to the service
      var queue = session.createQueue("portfolioQueue");
      var producer = session.createProducer(queue, null);
      
      //create the topic, updates to the portfolio status will be received here
      var topic = session.createTopic("portfolioTopic");
      var consumer = session.createConsumer(topic, null);
      
      //create a temporary queue, the response will arrive here
      session.createTemporaryQueue(function(tempQueue) {
        //temp queue ready
        var responseConsumer = session.createConsumer(tempQueue);
        responseConsumer.setMessageListener(messageListener);
       

        
        //create the request
        var statusRequest = session.createMapMessage();
        statusRequest.setObject("request","GET_PORTFOLIO_STATUS");
        statusRequest.setObject("portfolio",portfolioId);
        //Set the reply to field to the temp queue you created above, this is the queue the server will respond to
        statusRequest.setJMSReplyTo(tempQueue);
        
        
        //var correlationId = new Date().getTime() + "" + Math.round(Math.random()*1000);
        //statusRequest.setJMSCorrelationID(correlationId);
        producer.send(statusRequest);
        
      });

     
      
      // Start the connection
      conn.start();
      
    },
    onConnectionFailed: function(errorCode, errorMessage) {

      // Connection failed, show the error
      alert("Error: " + errorCode + " " + errorMessage);

    },   
    onLSClient: function(lsClient) {
      // Enable connection sharing and status widget (optional)
      lsClient.connectionSharing.enableSharing("JMSDemoCommonConnection", "ATTACH", "CREATE");
      lsClient.addListener(new StatusWidget("left", "0px", true));
  
    }
  });
});
