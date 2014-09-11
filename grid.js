define(["DynaGrid"],function(DynaGrid) {
  
  //cell highlighting time (milliseconds)
  var hotTime= 500;
  var direction= false; // True = decreasing; false = increasing; null = no sort

  
  var portfolioGrid= new DynaGrid("portfolio",true);
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
      info.setCellStyle("command", "commandhot", "commandcold");
    }
  });
  
  
  var SPACER = null;
  var UP = "images/up.gif";
  var DOWN = "images/down.gif";
  
  var gridWrap = {
    
    updateRow: function(key,data) {
      if (data.command == "DELETE") {
        portfolioGrid.removeRow(key);
      } else {
        portfolioGrid.updateRow(key,data);
      }
    },
    
    changeSort: function(sortOn) {
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
        currentImg.attr("src",SPACER);
      }
      
      if (direction !== null) {
        var nextImg = $("#img_" + sortOn);
        var nextCol = $("#col_" + sortOn);
        
        nextImg.attr("src",arrow);
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
  
  $(".button[data-sorting]").click(function() {
    gridWrap.changeSort($(this).data("sorting"));
  });
  
  return gridWrap;
});