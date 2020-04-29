# Lightstreamer JMS Extender - Basic Portfolio Demo - HTML Client

<!-- START DESCRIPTION lightstreamer-jms-example-portfolio-client-javascript -->

This project includes a front-end example based on the Basic Portfolio Demo for Lightstreamer Server.

## Details

In the JMS Portfolio Demo, a virtual stock portfolio, shared among all the connected users, is displayed.
By using the "Submit Order" panel, you can buy or sell a stock (identified by an item number), filling in the Quantity field and pressing the proper button.

This example uses the [_Lightstreamer JMS Extender Web Client API_](https://www.npmjs.com/package/lightstreamer-jms-web-client/) to handle the communications with JMS Extender.

Check out the sources for further explanations.

![screenshot](screen-large.png)

<!-- END DESCRIPTION lightstreamer-jms-example-portfolio-client-javascript -->

## Install

Before you can run the demo of this project, some dependencies need to be solved:

* Note that, as prerequisite, the [Lightstreamer JMS Extender - Portfolio Demo - Java (JMS) Service](https://github.com/Lightstreamer/Lightstreamer-JMS-example-Portfolio-service-java) has to be deployed on your local Lightstreamer JMS Extender instance. Please check out that project and follow the installation instructions provided with it.
* Launch Lightstreamer JMS Extender.
* jQuery is currently hot-linked in the html page: you may want to replace it with a local version and/or to upgrade its version.
* [Lightstreamer visual widgets](https://demos.lightstreamer.com/commons/lightstreamer-widgets.js), such as  _Status Widget_ and _Dynagrid_, are hot-linked in the html page: they are in no way mandatory and you may replace them with widgets from any other library by modifying `grid.js` and the `onLSClient` event in `index.html`.
* As the latest version of the Lightstreamer JMS Extender JavaScript library is always available through [unpkg](https://unpkg.com/lightstreamer-jms-web-client), it is hot-linked in the html page.

Now, you need to configure the `src/js/app.js` of this example by specifying the name of the JMS connector you are going to use. By default, the demo will look for the **ActiveMQ** JMS connector, please refer to the related [Service project](https://github.com/Lightstreamer/Lightstreamer-JMS-example-Portfolio-service-java) for more details on the choice of a JMS broker to be used.

To set the JMS connector name and the connection name, look where the connection is created:

```js
  jms.ConnectionFactory.createConnection("http://localhost:8080/", "ActiveMQ", null, null, {
```

To access the demo from a web browser, copy it somewhere under your root webserver directory. You can also add it to the JMS Extender internal web server pages under `<JMS_EXTENDER_HOME>/pages` directory by copying it there with a folder name such as `PortfolioDemo_JMS`. Subsequently you may access it as: [http://_your_jms_extender_http_address_/PortfolioDemo_JMS/](http://_your_jms_extender_http_address_/PortfolioDemo_JMS/).
Depending on the browser in use, and on the security settings, you might also be able to launch the index.html file directly from the file system.

## See Also

### Lightstreamer Service Needed by This Demo Client

<!-- START RELATED_ENTRIES -->
* [Lightstreamer JMS Extender - Portfolio Demo - Java (JMS) Service](https://github.com/Lightstreamer/Lightstreamer-JMS-example-Portfolio-service-java)

<!-- END RELATED_ENTRIES -->

### Related Projects

* [Lightstreamer JMS Extender - Basic Stock-List Demo - HTML Client](https://github.com/Lightstreamer/Lightstreamer-JMS-example-StockList-client-javascript)
* [Lightstreamer JMS Extender - Basic Chat Demo - HTML Client](https://github.com/Lightstreamer/Lightstreamer-JMS-example-Chat-client-javascript)
* [Lightstreamer - Portfolio Demos - HTML Clients](https://github.com/Lightstreamer/Lightstreamer-example-Portfolio-client-javascript)

## Lightstreamer Compatibility Notes

* Compatible with Lightstreamer JMS Extender SDK for Web Clients since version 2.0.0 or newer.
* Compatible with Lightstreamer JMS Extender since version 2.0.0 or newer.
