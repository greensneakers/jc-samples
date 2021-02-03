import Highcharts from 'highcharts'
require('highcharts/modules/data')(Highcharts);
require('highcharts/modules/no-data-to-display')(Highcharts);

export default {
  init() {
      $(window).load(function() {
          _init('AL');
      });
      function _init(defaultState) {
          if (defaultState) { _generateDashboards(defaultState); }

          $('select').change(function(){
              var stateAbbrev = this.value;
              _generateDashboards(stateAbbrev);
          });
      }

      function _generateDashboards (state) {
          dashboardAreaChart(state);
          dashboardBullets(state);
          dashboardSpending(state);
      }

      function dashboardSpending(state) {
          _generateBarChartData(state, 'spending');
      }

      function _appendPercentChange (id, percentChange) {
          if(!percentChange.match(/^-/)) {
            percentChange = "+"+percentChange;
          }
         $(id).text(percentChange);
      }

      function dashboardAreaChart (state, stateCSV = '/app/themes/50state/data/correctional-dashboard/prison.csv', counter = 1, stateData1 = undefined, stateData2 = undefined) {
          if (counter == 2) {
            stateData2 = []
          }
          if (counter == 3) {
            var stateData3 = []
          }
          $.get(stateCSV, function(csv) {
              var data = _csvToArray(csv);
              for (var i = 0; i < data.length; i++) {
                  if (data[i][1] == state) {
                     var stateName = data[i][0];
                     var percentChange = data[i][data[i].length - 1];
                      if (counter == 1) {
                          percentChange = data[i][data[i].length - 1];
                          stateData1 = _formatStateData(data[i]);
                          _appendPercentChange('#prison-population-change', percentChange );
                      }
                      if (counter == 2) {
                          percentChange = data[i][data[i].length - 1];
                          stateData2 = _formatStateData(data[i]);
                          _appendPercentChange('#parole-population-change', percentChange );
                      }
                      if (counter == 3) {
                          percentChange = data[i][data[i].length - 1];
                          stateData3 = _formatStateData(data[i]);
                          _appendPercentChange('#probation-population-percent-change', percentChange );
                      }
                  }
              }
              if (stateData2 == undefined ){
                  dashboardAreaChart (state, stateCSV = '/app/themes/50state/data/correctional-dashboard/parole.csv', counter = 2, stateData1, stateData2)
              }
              else if (stateData3 == undefined ){
                  dashboardAreaChart (state, stateCSV = '/app/themes/50state/data/correctional-dashboard/probation.csv', counter = 3, stateData1, stateData2)
              }
              else {
              _createAreaChart(stateName, stateData1, stateData2, stateData3);
              }
          });
      }

      function dashboardBullets (state) {
          var stateCSV = '/app/themes/50state/data/correctional-dashboard/bullets.csv';
          $.get(stateCSV, function (csv) {
              var data = _csvToArrayQuotes(csv);

              for (var i = 0; i < data.length; i++) {
                  var re = /"/g;
                  var stateData = data[i][1].replace(re, '');
                  if (stateData == state) {
                      var stateName = data[i][1];
                      var title = data[i][5].replace(re, '');
                      var bullet1 = data[i][2].replace(re, '');
                      var bullet2 = data[i][3].replace(re, '');
                      var bullet3 = data[i][4].replace(re, '');
                      appendStateDescription(stateName, title, bullet1, bullet2, bullet3);
                  }
              }
          });
      }

      function appendStateDescription (state, title, bullet1, bullet2, bullet3) {
          var bullet = $('#bullets');
          $('#title').text(title);

          if(bullet3 !== "") {
            bullet.html("<li>"+bullet1+"</li><li>"+bullet2+"</li><li>"+bullet3+"</li>");
          } else {
            bullet.html("<li>"+bullet1+"</li><li>"+bullet2+"</li>");
          }
      }

      function _createAreaChart (stateName, stateData1, stateData2, stateData3) {
          Highcharts.setOptions({
              lang: {
                  noData: "No Data Available",
                  thousandsSep: ',',
              },
          });
          Highcharts.chart('prison-population-chart', {
              chart: {
                  type: 'area',
              },
              title: {
                  text: 'Prison Population, 2006–2016',
                  align: 'left',
              },
              credits: {
                  enabled: false,
              },
              xAxis: {
                  categories: ['2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016'],
                  align: 'left',
                  tickInterval: 1,
              },
              legend: {
                  enabled: false,
              },
              yAxis: {
                  title: {
                      text: '',
                  },
              },
              series: [{
                  name: "Prison Population",
                  data: stateData1,
                  color: '#00008b',
                  fillOpacity: 0.1,
              }],
          });
          Highcharts.chart('parole-population-chart', {
              chart: {
                  type: 'area',
              },
              title: {
                  text: 'Parole Population, 2006–2016',
                  align: 'left',
              },
              credits: {
                  enabled: false,
              },
              xAxis: {
                  categories: ['2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016'],
                  align: 'left',
                  tickInterval: 1,
              },
              legend: {
                  enabled: false,
              },
              yAxis: {
                  title: {
                      text: '',
                  },
              },
              series: [
              {
                  name: "Parole Population",
                  data: stateData2,
                  color: '#0099ff',
                  fillOpacity: 0.1,
              }],
          });
          Highcharts.chart('probation-population-chart', {
              chart: {
                  type: 'area',
              },
              title: {
                  text: 'Probation Population, 2006–2016',
                  align: 'left',
              },
              credits: {
                  enabled: false,
              },
              xAxis: {
                  categories: ['2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016'],
                  align: 'left',
                  tickInterval: 1,
              },
              legend: {
                  enabled: false,
              },
              yAxis: {
                  title: {
                      text: '',
                  },
              },
              series: [
              {
                  name: "Probation Population",
                  data: stateData3,
                  color: '#66ccff',
                  fillOpacity: 0.1,
              }],
          });
      }

      function _generateBarChartData (state, type) {
         var stateCSV = '/app/themes/50state/data/correctional-dashboard/spending.csv';
          var stateData, stateName;
          $.get(stateCSV, function (csv) {
              var data = _csvToArray(csv);
              for (var i = 0; i < data.length; i++) {
                  if (data[i][1] == state) {
                      stateName = data[i][0];
                      data[i].splice(0, 2);
                      data = data[i].map(Number);
                      stateData = data
                  }
              }

              var chartId = type + '-chart';
              _createBarChart(stateName, stateData, chartId, state);
          });
      }

      function _createBarChart (stateName, stateData, chartId, stateAbbrev) {
          Highcharts.setOptions({lang: {noData: "No Data Available"}});

          $("#category-title span").text('Correctional Spending in '+stateName+' (in millions)');

          // Spending footnotes
          if(stateAbbrev == 'CA') {
            $(".spending-footnote").show();
            $("#footnote-1 p").remove();
            $("#footnote-1").append("<p>Parole funding does not include funding for parole board operations. Probation is county-operated in California, therefore total probation funding could not be determined.</p>");
          } else if(stateAbbrev == 'HI') {
            $(".spending-footnote").show();
            $("#footnote-1 p").remove();
            $("#footnote-1").append("<p>Probation is county-operated in Hawaii, therefore total probation funding could not be determined.</p>");
          } else if(stateAbbrev == 'IL') {
            $(".spending-footnote").show();
            $("#footnote-1 p").remove();
            $("#footnote-1").append("<p>Probation is county-operated in Illinois, therefore total probation funding could not be determined.</p>");
          } else if(stateAbbrev == 'KS') {
            $(".spending-footnote").show();
            $("#footnote-1 p").remove();
            $("#footnote-1").append("<p>Includes funding for parole and Community Corrections only. Does not account for Court Services (i.e., county-operated) probation.</p>");
          } else if(stateAbbrev == 'MN') {
            $(".spending-footnote").show();
            $("#footnote-1 p").remove();
            $("#footnote-1").append("<p>Probation is county-operated in Minnesota, therefore total probation funding could not be determined.</p>");
          } else if(stateAbbrev == 'NJ') {
            $(".spending-footnote").show();
            $("#footnote-1 p").remove();
            $("#footnote-1").append("<p>Probation is county-operated in New Jersey, therefore total probation funding could not be determined.</p>");
          } else if(stateAbbrev == 'NY') {
            $(".spending-footnote").show();
            $("#footnote-1 p").remove();
            $("#footnote-1").append("<p>Probation is county-operated in New York with state oversight. Total probation funding could not be determined.</p>");
          } else if(stateAbbrev == 'OH') {
            $(".spending-footnote").show();
            $("#footnote-1 p").remove();
            $("#footnote-1").append("<p>Probation is county-operated in Ohio, therefore total probation funding could not be determined.</p>");
          } else if(stateAbbrev == 'OR') {
            $(".spending-footnote").show();
            $("#footnote-1 p").remove();
            $("#footnote-1").append("<p>Probation and parole are county-operated in Oregon, with state oversight. Probation/parole funding only includes the state general fund appropriation, some counties supplement funding with local, other state, or federal funds.</p>");
          } else if(stateAbbrev == 'PA') {
            $(".spending-footnote").show();
            $("#footnote-1 p").remove();
            $("#footnote-1").append("<p>Probation is county-operated in Pennsylvania, therefore total probation funding could not be determined.</p>");
          } else if(stateAbbrev == 'TX') {
            $(".spending-footnote").show();
            $("#footnote-1 p").remove();
            $("#footnote-1").append("<p>Probation is county-operated in Texas, with state oversight. Total probation funding could not be determined.</p>");
          } else if(stateAbbrev == 'WY') {
            $(".spending-footnote").show();
            $("#footnote-1 p").remove();
            $("#footnote-1").append("<p>Although prison spending was not available in The Price of Prisons, the state provided an estimate of approximately $260 million for prison spending in FY2015.</p>");
          } else {
            $(".spending-footnote").hide();
            $("#footnote-1 p").remove();
          }

          // bullet footnotes
          if(stateAbbrev == 'FL') {
            $(".bullet-footnote").show();
            $(".bullet-footnote p").remove();
            $(".bullet-footnote").append("<p><small>Parole was abolished in Florida in 1983, but people sentenced to prison before it was abolished may still be released to parole.</small></p>");
          } else if(stateAbbrev == 'ME') {
            $(".bullet-footnote").show();
            $(".bullet-footnote p").remove();
            $(".bullet-footnote").append("<p><small>Parole was abolished in Maine in 1976.</small></p>");
          } else if(stateAbbrev == 'MN') {
            $(".bullet-footnote").show();
            $(".bullet-footnote p").remove();
            $(".bullet-footnote").append("<p><small>Parole was abolished in Minnesota in 1978. All people sentenced to prison in Minnesota have a period of post-release supervision determined by the court at sentencing, with discretion given to the Department of Corrections to reduce the period of supervised release.</small></p>");
          } else if(stateAbbrev == 'NC') {
            $(".bullet-footnote").show();
            $(".bullet-footnote p").remove();
            $(".bullet-footnote").append("<p><small>Policy changes requiring post-release supervision for people released from prison went into effect in 2012 and resulted in the increase in the parole population.</small></p>");
          } else if(stateAbbrev == 'OK') {
            $(".bullet-footnote").show();
            $(".bullet-footnote p").remove();
            $(".bullet-footnote").append("<p><small>Parole and probation data were not available in 2007 and 2013.</small></p>");
          } else if(stateAbbrev == 'OR') {
            $(".bullet-footnote").show();
            $(".bullet-footnote p").remove();
            $(".bullet-footnote").append("<p><small>Parole and probation data were not available in 2015.</small></p>");
          } else {
            $(".bullet-footnote").hide();
            $(".bullet-footnote p").remove();
          }

          Highcharts.chart(chartId, {
              chart: {
                  type: 'bar',
              },
              credits: {
                  enabled: false,
              },
              plotOptions: {
                  bar: {
                      colorByPoint: true,
                      dataLabels: {
                        enabled: true,
                        formatter: function () {
                          if (this.y == 0) {
                            return 'N/A';
                          }
                        },
                      },
                  },

              },
              colors: [
                      '#0099ff',
                      '#434348',
                  ],
              title: {
                  text: '',
              },
              xAxis: {
                  categories: ['Prison (FY2015)', 'Probation/Parole (FY2017)'],
              },
              legend: {
                  enabled: false,
              },
              yAxis: {
                labels: {
                  formatter: function() {
                    return this.value / 1000000 + 'M';
                  },
                },
                title: null,
              },
              series: [{
                  name: stateName,
                  data: stateData,
              }],
          });
      }

      function _csvToArray (csv) {
          var rows  = csv.split("\n");
          return rows.map(function (row) {
              return row.split(",");
          });
      }

      function _csvToArrayQuotes (csv) {
          var rows  = csv.split("\n");
          return rows.map(function (row) {
              return row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
          });
      }

      function arraysIdentical(a, b) {
          var i = a.length;
          if (i != b.length) {
              return false;
          }
          while (i--) {
              if (a[i] !== b[i]) {
                  return false;
              }
          }
          return true;
      }

      function _formatStateData (data) {
          data.splice(0, 2);
          data.splice(-1, 1);
          data = data.map(Number);
          for (var i = 0; i < data.length; i++) {
                  if (data[i] == 0) {
                     data[i] = "Data not available"
                  }
              }
          if (arraysIdentical(data, ["Data not available", "Data not available", "Data not available", "Data not available", "Data not available", "Data not available", "Data not available", "Data not available", "Data not available", "Data not available"])){
              data = []
          }

          return data;
      }


  },
};
