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

//cell highlighting time (milliseconds)
var hotTime = 500;
var direction = false; // True = decreasing; false = increasing; null = no sort

var portfolioGrid = new DynaGrid("portfolio", true);
portfolioGrid.setAutoCleanBehavior(true, false);
portfolioGrid.addListener({
  onVisualUpdate: function (key, info) {
    if (info == null) {

      // Cleaning
      return;
    }

    // visual effects on updates
    info.setHotTime(hotTime);
    info.setStyle("lshot", "lscold");
  }
});


var SPACER = null;
var UP = "images/up.gif";
var DOWN = "images/down.gif";

const gridWrap = {

  updateRow: function (key, data) {
    if (data.qty == "0") {
      portfolioGrid.removeRow(key);
    } else {
      portfolioGrid.updateRow(key, data);
    }
  },

  changeSort: function (sortOn) {
    var sortedBy = portfolioGrid.getSortField();
    var arrow = null;

    if (sortOn != sortedBy || direction === null) {
      direction = false;
      arrow = UP;
    } else if (direction === false) {
      direction = true;
      arrow = DOWN;
    } else {
      direction = null;
    }

    if (sortOn != sortedBy || direction === null) {
      var currentImg = $("#img_" + sortedBy);
      var currentCol = $("#col_" + sortedBy);

      currentCol.removeClass("tableTitleSorted");
      currentImg.attr("src", SPACER);
    }

    if (direction !== null) {
      var nextImg = $("#img_" + sortOn);
      var nextCol = $("#col_" + sortOn);

      nextImg.attr("src", arrow);
      nextCol.addClass("tableTitleSorted");

      if (sortOn == "qty") {
        portfolioGrid.setSort(sortOn, direction, true, false);
      } else {
        portfolioGrid.setSort(sortOn, direction);
      }
    } else {
      portfolioGrid.setSort(null);
    }

  }
};

$(".button[data-sorting]").click(function () {
  gridWrap.changeSort($(this).data("sorting"));
});

export default gridWrap;
