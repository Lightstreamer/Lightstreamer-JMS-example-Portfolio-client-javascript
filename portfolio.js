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

// portfolio contents; provided by the PORTFOLIO_ADAPTER in COMMAND mode
var fieldList= ["key", "command", "qty"];

// cell highlighting time (milliseconds)
var hotTime= 500;

// will contain a reference to the DynaGrid instance
var portfolioGrid= null;

//////////////// Grid Sort Management

var initialSort= "key";
var direction= false; // True = decreasing; false = increasing; null = no sort

function changeSort(sortOn) {
	var sortedBy = portfolioGrid.getSortField();

	if (sortOn == sortedBy) {
		if (direction == false) {
			direction = true;
			document.getElementById("img_" + sortOn).src = "images/down.gif";

		} else if (direction == true) {
			direction = null;
			document.getElementById("img_" + sortOn).src = "images/spacer.gif";
			document.getElementById("col_" + sortOn).className = "tableTitle";

		} else {
			direction = false;
			document.getElementById("img_" + sortOn).src = "images/up.gif";
		}

	} else {
		direction = false;

		if (sortedBy != null) {
			document.getElementById("img_" + sortedBy).src = "images/spacer.gif";
			document.getElementById("col_" + sortedBy).className = "tableTitle";
		}

		document.getElementById("img_" + sortOn).src = "images/up.gif";
		document.getElementById("col_" + sortOn).className = "tableTitleSorted";
	}

	if (direction == null) {
		portfolioGrid.setSort(null);

	} else {
		if (sortOn == "qty")
			portfolioGrid.setSort(sortOn, direction, true, false);
		else
			portfolioGrid.setSort(sortOn, direction);
	}
}

//////////////// Connection and Grid setup

var topicSession= null;
var queueSession= null;

require(["ConnectionFactory", "DynaGrid", "StatusWidget"], function(ConnectionFactory, DynaGrid, StatusWidget) {
	ConnectionFactory.createConnection(function(conn) {

		// Connection succeeded, topic subscription
		topicSession= conn.createSession(false, "PRE_ACK");
		var topic= topicSession.createTopic("portfolioTopic");
		var consumer= topicSession.createConsumer(topic, null);

		portfolioGrid= new DynaGrid("portfolio",true);
		portfolioGrid.setAutoCleanBehavior(true,false);
		portfolioGrid.addListener({
			onVisualUpdate: function(key,info) {
				if (info == null) {

					// Cleaning
					return;
				}

				// visual effects on updates
				info.setHotTime(hotTime);
				info.setStyle("lshot", "lscold");
				info.setCellStyle("command", "commandhot", "commandcold")
			}
		});

		// Let's define the initial sorting column
		changeSort(initialSort);

		// Add listener to message consumer
		consumer.setMessageListener({
			onMessage: function(message) {

				// Message received
				var portfolioMessage= message.getObject();

				// Update the dyna grid
				portfolioGrid.updateRow(portfolioMessage.key, portfolioMessage);
			}
		});

		// Start the connection
		conn.start();

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

		// Add listener to enable buttons only when connected
		lsClient.addListener({
			onStatusChange: function(newStatus) {
				if (newStatus.indexOf("CONNECTED") == 0) {
					document.getElementById("buy").disabled= false;
					document.getElementById("sell").disabled= false;

				} else {
					document.getElementById("buy").disabled= true;
					document.getElementById("sell").disabled= true;
				}
			}
		});
	});
});
