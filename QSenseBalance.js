define(["./balance", "./d3.min", "css!./QSenseBalance.css"],
  function(template) {
    "use strict";

    //définition de l'objet
    return {
      initialProperties: {
        qHyperCubeDef: {
          qDimensions: [],
          qMeasures: [],
          qInitialDataFetch: [{
            qWidth: 2,
            qHeight: 50
          }]
        }
      },
      definition: {
        type: "items",
        component: "accordion",
        items: {
          measures: {
            uses: "measures",
            min: 1,
            max: 2
          },
          Setting: {
            uses: "settings",
            items: {
              Colors: {
              }
            }
          }
        }
      },
      snapshot: {
        canTakeSnapshot: true
      },

      //affichage de l'objet
      paint: function($element, layout) {

        //Taille de l'objet
        var width = $element.width();
        var height = $element.height();

        var id = "container_" + layout.qInfo.qId;

        //construction de la div
        if (document.getElementById(id)) {
          $("#" + id).empty();
        } else {
          $element.append($('<div />').attr("id", id).attr("class", "viz").width(width).height(height));
        }

        //recup des données
        var hc = layout.qHyperCube;
        //recup de la zone d'affichage
        var div = document.getElementById(id);

        var tooLong = ' ';
        console.log(hc.qMeasureInfo[0].qFallbackTitle.length);
        if (hc.qMeasureInfo[0].qFallbackTitle.length > 13) {
          tooLong = '... ';
        }

        //recup de la valeur de la mesure
        var measureName =  hc.qMeasureInfo[0].qFallbackTitle.substr(0, 13) + tooLong + hc.qDataPages[0].qMatrix[0][0].qText;
        var value = hc.qDataPages[0].qMatrix[0][0].qNum;

        if (hc.qDataPages[0].qMatrix[0].length > 1) {
          tooLong = ' ';
          if (hc.qMeasureInfo[1].qFallbackTitle.length > 13){
            tooLong = '... ';
          }

          var value2 = hc.qDataPages[0].qMatrix[0][1].qNum;
          var measureName2 = hc.qMeasureInfo[1].qFallbackTitle.substr(0, 13) + tooLong + hc.qDataPages[0].qMatrix[0][1].qText;
        }

        var iconGauge = layout.iconGauge;
        
        var bal = balance(div, width, height, 
          [0, 0, 1, 1, 0, 1, 0],
          ["Advice", "Waiting Time", "Service", "Explanation", "Atmosphere", "Welcome", "Farewell"],
          4.2
        )
          .setBg("cyan")
          .setPivotColor("green")
          .setPivotLineColor("blue") 
          .setInclination("5")
          .setLevelColor("yellow")
          .setFontColor("grey")
          .setFontSize(22)   
          .setWordColor(
                [  
                    {"label": "Advice", "color": "orange"},
                    {"label": "Waiting Time", "color": "green"},
                    {"label": "Service", "color": "yellow"},
                    {"label": "Explanation", "color": "brown"},
                    {"label": "Atmosphere", "color": "purple"},
                    {"label": "Welcome", "color": "pink"},
                    {"label": "Farewell", "color": "pink"}            
                ]
            )
          .render();
      }
    };
  });
