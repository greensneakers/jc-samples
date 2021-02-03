import Highcharts from 'highcharts'

export default {
  init() {

    $(window).load(function() {
        _cdb_init('AL'); // 1a
        _adb_init('AL'); // 1b
    });

    function _cdb_init(defaultState) {
        if (defaultState) { _generateDashboards(defaultState); }

        $('select').eq(0).change(function(){
            var stateAbbrev = this.value;
            _generateDashboards(stateAbbrev);
        });
    }

    function _generateDashboards (state) {
        dashboardAreaChart(state);
        dashboardHomicideRate(state);
        dashboardRapeRate(state);
        dashboardRobberyRate(state);
        dashboardAssaultRate(state);
        dashboardPopAreaBarCharts(state);
        dashboardBullets(state);
    }

    function dashboardPopAreaBarCharts (state) {
        var rawCSV = '/app/themes/50state/data/crimes-dashboard/pop-area.csv';
        var stateData = [];
        $.get(rawCSV, function (csv) {
            var data = _csvToArray(csv);
            for (var i = 0; i < data.length; i++) {
                if (data[i][1] == state) {
                    stateData.push(data[i]);
                }
            }
            _generateMetroBarChart(state, stateData[0]);
            _generateMicroBarChart(state, stateData[1]);
            _generateNonMetroBarChart(state, stateData[2]);

            // create equal
            var metroMax = _cutBarChartData(stateData[0]);
            metroMax = Math.max(metroMax[0], metroMax[1]);

            var microMax = _cutBarChartData(stateData[1]);
            microMax = Math.max(microMax[0], microMax[1]);

            var nonMetroMax = _cutBarChartData(stateData[2]);
            nonMetroMax = Math.max(nonMetroMax[0], nonMetroMax[1]);

            var barChartMax = Math.ceil(Math.max(metroMax, microMax, nonMetroMax));
            $("#metro").highcharts().yAxis[0].setExtremes(0,barChartMax);
            $("#micro").highcharts().yAxis[0].setExtremes(0,barChartMax);
            $("#non-metro").highcharts().yAxis[0].setExtremes(0,barChartMax);

        });

        // AZ footnote
        if(state == 'AZ') {
          $(".micro-percent-change--az-footnote").show();
        } else {
          $(".micro-percent-change--az-footnote").hide();
        }
    }

    function dashboardHomicideRate (state) {
        _generateLineChartData(state, 'Homicide', 'homicide');
    }

    function dashboardRapeRate (state) {
      if(state !== 'NY') {
        $("#new-york-note").remove();
        _generateLineChartData (state, 'Rape', 'rape');
      } else {
        $("#rape-percent-change").text("");
        $("#rape-chart").empty().prepend("<p id='new-york-note'>New York has indicated that estimated rape figures reported by the FBI in recent years are not accurate. For accurate rape figures, please <a href='http://www.criminaljustice.ny.gov/crimnet/ojsa/stats.htm'>visit this link</a>.</p>");
      }
    }

    function dashboardRobberyRate (state)  {
        _generateLineChartData (state, 'Robbery', 'robbery');
    }

    function dashboardAssaultRate (state)  {
        _generateLineChartData (state, 'Aggravated Assault', 'assault');
    }

    function _appendPercentChange (id, percentChange) {
      if(!percentChange.match(/^-/) && !percentChange.match(/NA/)) {
        percentChange = "+"+percentChange;
      }
      $(id + " span").text(percentChange);
    }

    // Area chart
    function dashboardAreaChart (state) {
        var stateCSV = '/app/themes/50state/data/crimes-dashboard/crime-rates.csv';
        var stateData, stateName, percentChange;
        $.get(stateCSV, function(csv) {
            var data = _csvToArray(csv);
            for (var i = 0; i < data.length; i++) {
                if (data[i][1] == state) {
                    stateName = data[i][0];
                    percentChange = data[i][data[i].length - 1];
                    stateData = _formatStateData(data[i]);
                }
            }
            _appendPercentChange('#crime-rate-chart-percent-change', percentChange);
            _cdb_appendPageTitles(stateName);
            _cdb_createAreaChart(stateName, stateData);
        });
    }

    function _cdb_appendPageTitles (stateName) {
        $('#category-title span').text('Violent Crime Rate in ' + stateName + ' (Incidents per 100,000 Residents) by Offense Category, 2007–2017');
        $('#bar-chart-title').text('Overall Violent Crime Rate in ' + stateName + ' (Incidents per 100,000 Residents) by Population Area, 2007 and 2017');
        $('#change-overall-crime-title').text('Overall Violent Crime Rate in ' + stateName + ' (Incidents per 100,000 Residents), 2007–2017');
    }

    function dashboardBullets (state) {
        var stateCSV = '/app/themes/50state/data/crimes-dashboard/crime-rates-bullets.csv';
        $.get(stateCSV, function (csv) {
            var data = _csvToArrayQuotes(csv);

            for (var i = 0; i < data.length; i++) {
                var re = /"/g;
                var stateData = data[i][1].replace(re, '');
                if (stateData == state) {
                    var stateName = data[i][1];
                    var title = data[i][2].replace(re, '');
                    var description = data[i][3].replace(re, '');
                    var bullet1 = data[i][4].replace(re, '');
                    var bullet2 = data[i][5].replace(re, '');
                    var bullet3 = data[i][6].replace(re, '');
                    appendStateDescription(stateName, title, description, bullet1, bullet2, bullet3);
                }
            }
        });
    }

    function appendStateDescription (state, title, description, bullet1, bullet2, bullet3) {
        var content = $('#state-description');
        var bullet = $('#bullets');
        $('#cdb-title').text(title);
        content.text(description);
        if(bullet3 !== "") {
          bullet.html("<li>"+bullet1+"</li><li>"+bullet2+"</li><li>"+bullet3+"</li>");
        } else {
          bullet.html("<li>"+bullet1+"</li><li>"+bullet2+"</li>");
        }
    }

    // Bar chart
    function _generateMetroBarChart (state, data) {
        var id = 'metro';
        var name = 'Metropolitan Areas';
        var subtitle = '(population of 50,000+)'
        var percentChange = data[data.length - 1];
        _appendPercentChange('#' + id + '-percent-change', percentChange);
        var cutData = _cutBarChartData(data);
        _createBarChart(cutData, id, name, subtitle);
    }

    function _generateMicroBarChart (state, data) {
        var id = 'micro';
        var name = 'Micropolitan Areas';
        var subtitle = '(population of 10,000–49,999)';
        var percentChange = data[data.length - 1];
        _appendPercentChange('#' + id + '-percent-change', percentChange);
        var cutData = _cutBarChartData(data);
        _createBarChart(cutData, id, name, subtitle);
    }

    function _generateNonMetroBarChart (state, data) {
        var id = 'non-metro';
        var name = 'Non-Metropolitan Areas';
        var subtitle = '(population of fewer than 10,000)';
        var percentChange = data[data.length - 1];
        _appendPercentChange('#' + id + '-percent-change', percentChange);
        var cutData = _cutBarChartData(data);
        _createBarChart(cutData, id, name, subtitle);
    }

    function _cutBarChartData (data) {
        var cutData = [];
        cutData.push(Number(data.slice(4, 5)[0]));
        cutData.push(Number(data.slice(6, 7)[0]));
        return cutData;
    }

    function _createBarChart (data, id, name, subtitle) {

        Highcharts.chart(id, {
            chart: {
                type: 'bar',
            },
            title: {
                text: name,
                align: 'left',
                color: '#525252',
            },
            subtitle: {
                text: subtitle,
                align: 'left',
                color: '#525252',
            },
            credits: {
                enabled: false,
            },
            xAxis: {
                categories: ['2007', '2017'],
                labels: {
                    enabled: false
                },
            },
            yAxis: {
                title: {
                    text: '',
                },
                labels: {
                    enabled: true,
                },
                max: 725,
            },
            legend: {
                enabled: false,
            },
            colors: [
                '#E76946',
                '#FBB731',
            ],
            tooltip: false,
            plotOptions: {
                   series: {
                       pointPadding: 0,
                       groupPadding: 0,
                       colorByPoint: true,
                       dataLabels: {
                          enabled: true,
                          color: 'black',
                          shadow: false,
                      },
                      style: {
                        textOutline: false
                      },
                   },
               },
            series: [{
                data: data,
            }],
        });
    }

    // Line chart
    function _cdb_createAreaChart (stateName, stateData) {
        Highcharts.chart('crime-rate-chart', {
            chart: {
                type: 'area',
            },
            title: {
                text: '',
            },
            credits: {
                enabled: false,
            },
            xAxis: {
                categories: ['2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017'],
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
                name: stateName,
                data: stateData,
                color: '#66ccff',
                fillOpacity: 1,
            }],
        });
    }

    function _generateLineChartData (state, title, type) {
        var stateCSV = '/app/themes/50state/data/crimes-dashboard/' + type + '-rate.csv';
        var stateData, stateName, percentChange;
        $.get(stateCSV, function (csv) {
            var data = _csvToArray(csv);
            for (var i = 0; i < data.length; i++) {
                if (data[i][1] == state) {
                    stateName = data[i][0];
                    percentChange = data[i][data[i].length - 1];
                    stateData = _formatStateData(data[i]);
                }
            }
            var chartId = type + '-chart';

            _appendPercentChange('#' + type + '-percent-change', percentChange);
            _cdb_createLineChart(stateName, stateData, title, chartId);
        });
    }

    function _cdb_createLineChart (stateName, stateData, title, chartId) {
        Highcharts.chart(chartId, {
            chart: {
                type: 'line',
            },
            title: {
                text: title,
                fontSize: '17px',
                align: 'left',
                color: '#525252',
                width: '237px',
            },
            credits: {
                enabled: false,
            },
            xAxis: {
                categories: ['2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017'],

                // set xAxis labels to display correct year for Rape charts
                labels: {
                    formatter: function () {
                        if (title == "Rape") {
                            return Number(this.value) + 6;
                          } else {
                            return this.value;
                        }
                    }
                }
            },
            tooltip: {
                formatter: function() {
                    var s = '';

                    $.each(this.points, function(i, point) {
                        // set tooltip to display correct year for Rape charts
                        var years = this.point.series.xData.length; 

                        if (years == 11) {
                            s = this.x;
                          } else {
                            s = Number(this.x) + 6;
                        }

                        s += '<br/><span style="color:' + point.color + '">\u25CF</span> ' + point.series.name + ': ' + '<b>' + point.y + '</b>';

                    });

                    return s;
                },
                shared: true
            },
            legend: {
                enabled: false,
            },
            yAxis: {
                min: 0,
                startOnTick: false,
                title: {
                    text: '',
                },
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

    function _formatStateData (data) {
        data.splice(0, 2);
        data.splice(-1, 1);
        data = data.map(Number);
        return data;
    }

    // graphic 1b
    function _adb_init(defaultState) {
        if (defaultState) { generateCharts(defaultState); }

        $('select').eq(1).change(function(){
            var stateAbbrev = this.value;
            generateCharts(stateAbbrev);
        });
    }

    // Line chart
    function generateCharts (stateAbbrev) {
        var stateName = _getStateName(stateAbbrev);
        _adb_appendPageTitles(stateName);
        var arrestsCSV = '/app/themes/50state/data/arrests-dashboard/arrests-crime.csv';
        var crimesCSV = '/app/themes/50state/data/arrests-dashboard/reported-crime.csv';
        _createDashboardChart(stateAbbrev, arrestsCSV, crimesCSV, 'arrests-chart', _adb_createLineChart)

        var homicideArrestsCSV = '/app/themes/50state/data/arrests-dashboard/homicide-arrests.csv';
        var homicideCrimesCSV = '/app/themes/50state/data/arrests-dashboard/homicide-crime.csv';
        var rapeArrestsCSV = '/app/themes/50state/data/arrests-dashboard/rape-arrests.csv';
        var rapeCrimesCSV = '/app/themes/50state/data/arrests-dashboard/rape-crime.csv';
        var robberyArrestsCSV = '/app/themes/50state/data/arrests-dashboard/robbery-arrests.csv';
        var robberyCrimesCSV = '/app/themes/50state/data/arrests-dashboard/robbery-crime.csv';
        var assaultArrestsCSV = '/app/themes/50state/data/arrests-dashboard/assault-arrests.csv';
        var assaultCrimesCSV = '/app/themes/50state/data/arrests-dashboard/assault-crime.csv';
        var drugDataCSV = '/app/themes/50state/data/arrests-dashboard/drug-arrest.csv';
        var nonIndexDataCSV = '/app/themes/50state/data/arrests-dashboard/non-index-arrest.csv';
        var arrestBulletsCSV = '/app/themes/50state/data/arrests-dashboard/arrests-bullets.csv';

        _createDashboardChart(stateAbbrev, homicideArrestsCSV, homicideCrimesCSV, 'homicide', _adb_createLineChart);
        _createDashboardChart(stateAbbrev, rapeArrestsCSV, rapeCrimesCSV, 'rape', _adb_createLineChart);
        _createDashboardChart(stateAbbrev, robberyArrestsCSV, robberyCrimesCSV, 'robbery', _adb_createLineChart);
        _createDashboardChart(stateAbbrev, assaultArrestsCSV, assaultCrimesCSV, 'aggravated-assault', _adb_createLineChart);

        _createDashboardChart(stateAbbrev, drugDataCSV, nonIndexDataCSV, 'drug-area-chart', _adb_createAreaChart);

        _createDashboardBullets(stateAbbrev, arrestBulletsCSV);

        // State-specific tweaks
        if(stateAbbrev !== 'NY') {
          if($(".adb-line-chart--rape").length == 0) {
            $(".adb-relative-container--rape").append('<div id="rape" class="adb-line-chart adb-line-chart--rape"></div>');
          }
          $("#new-york-note").remove();
          $("#ny-bullet").remove();
        } else if(stateAbbrev == 'NY') {
          $(".adb-line-chart--rape").remove();
          $(".adb-relative-container--rape").prepend("<div id='new-york-note'><h4>Rape</h4><p>New York has indicated that estimated rape figures reported by the FBI in recent years are not accurate. For accurate rape figures, please <a href='http://www.criminaljustice.ny.gov/crimnet/ojsa/stats.htm' target='_BLANK'>visit this link</a>.</p></div>");
          $("#bullets").append("<li id='ny-bullet'>The New York State arrest data presented in both charts on this page do not include arrests from New York City Police Department. For complete New York State arrest information, please <a href='http://www.criminaljustice.ny.gov/crimnet/ojsa/stats.htm' target='_BLANK'>visit this link</a>.</li>");
        }

        // State-specific footnotes
        if(stateAbbrev == "AL") {
          $(".crime-rates-footnote").show();
          $("#footnote-5 p").remove();
          $("#footnote-6 p").remove();
          $("#footnote-5").append("<p>Arrest reporting deficient for 2011-2014.</p>");
          $("#footnote-6").append("<p>Arrest reporting deficient for 2011-2014.</p>");
        } else if(stateAbbrev == "HI") {
          $(".crime-rates-footnote").show();
          $("#footnote-5 p").remove();
          $("#footnote-6 p").remove();
          $("#footnote-5").append("<p>Arrest reporting deficient in multiple years.</p>");
          $("#footnote-6").append("<p>Arrest reporting deficient in multiple years.</p>");
        } else if(stateAbbrev == "IL") {
          $(".crime-rates-footnote").show();
          $("#footnote-5 p").remove();
          $("#footnote-6 p").remove();
          $("#footnote-5").append("<p>Arrest reporting is consistently low in Illinois.</p>");
          $("#footnote-6").append("<p>Arrest reporting is consistently low in Illinois.</p>");
        } else if(stateAbbrev == "KY") {
          $(".crime-rates-footnote").show();
          $("#footnote-5 p").remove();
          $("#footnote-6 p").remove();
          $("#footnote-5").append("<p>Arrest reporting deficient for 2007-2008.</p>");
          $("#footnote-6").append("<p>Arrest reporting deficient for 2007-2008.</p>");
        } else if(stateAbbrev == "MN") {
          $(".crime-rates-footnote").show();
          $("#footnote-5 p").remove();
          $("#footnote-6 p").remove();
          $("#footnote-5").append("<p>Arrest reporting deficient in multiple years.</p>");
          $("#footnote-6").append("<p>Arrest reporting deficient in multiple years.</p>");
        } else if(stateAbbrev == "NE") {
          $(".crime-rates-footnote").show();
          $("#footnote-5 p").remove();
          $("#footnote-6 p").remove();
          $("#footnote-5").append("<p>Arrest reporting deficient in 2015.</p>");
          $("#footnote-6").append("<p>Arrest reporting deficient in 2015.</p>");
        } else if(stateAbbrev == "OR") {
          $(".crime-rates-footnote").show();
          $("#footnote-5 p").remove();
          $("#footnote-6 p").remove();
          $("#footnote-5").append("<p>Arrest reporting deficient for 2013-2016.</p>");
          $("#footnote-6").append("<p>Arrest reporting deficient for 2013-2016.</p>");
        } else if(stateAbbrev == "SD") {
          $(".crime-rates-footnote").show();
          $("#footnote-5 p").remove();
          $("#footnote-6 p").remove();
          $("#footnote-5").append("<p>Arrest reporting deficient in 2007.</p>");
          $("#footnote-6").append("<p>Arrest reporting deficient in 2007.</p>");
        } else if(stateAbbrev == "UT") {
          $(".crime-rates-footnote").show();
          $("#footnote-5 p").remove();
          $("#footnote-6 p").remove();
          $("#footnote-5").append("<p>Arrest reporting deficient in 2011.</p>");
          $("#footnote-6").append("<p>Arrest reporting deficient in 2011.</p>");
        } else {
          $(".crime-rates-footnote").hide();
          $("#footnote-5 p").remove();
          $("#footnote-6 p").remove();
        }

        if(stateAbbrev == "AL") {
          $(".offense-category-footnote").show();
          $("#footnote-10 p").remove();
          $("#footnote-10").append("<p>Arrest reporting deficient for 2011-2014.</p>");
        } else if(stateAbbrev == "HI") {
          $(".offense-category-footnote").show();
          $("#footnote-10 p").remove();
          $("#footnote-10").append("<p>Arrest reporting deficient in multiple years.</p>");
        } else if(stateAbbrev == "HI") {
          $(".offense-category-footnote").show();
          $("#footnote-10 p").remove();
          $("#footnote-10").append("<p>Arrest reporting deficient in multiple years.</p>");
        } else if(stateAbbrev == "IL") {
          $(".offense-category-footnote").show();
          $("#footnote-10 p").remove();
          $("#footnote-10").append("<p>Arrest reporting is consistently low in Illinois.</p>");
        } else if(stateAbbrev == "KY") {
          $(".offense-category-footnote").show();
          $("#footnote-10 p").remove();
          $("#footnote-10").append("<p>Arrest reporting deficient for 2007-2008.</p>");
        } else if(stateAbbrev == "MN") {
          $(".offense-category-footnote").show();
          $("#footnote-10 p").remove();
          $("#footnote-10").append("<p>Arrest reporting deficient in multiple years.</p>");
        } else if(stateAbbrev == "NE") {
          $(".offense-category-footnote").show();
          $("#footnote-10 p").remove();
          $("#footnote-10").append("<p>Arrest reporting deficient in 2015.</p>");
        } else if(stateAbbrev == "OR") {
          $(".offense-category-footnote").show();
          $("#footnote-10 p").remove();
          $("#footnote-10").append("<p>Arrest reporting deficient for 2013-2016.</p>");
        } else if(stateAbbrev == "SD") {
          $(".offense-category-footnote").show();
          $("#footnote-10 p").remove();
          $("#footnote-10").append("<p>Arrest reporting deficient in 2007.</p>");
        } else if(stateAbbrev == "UT") {
          $(".offense-category-footnote").show();
          $("#footnote-10 p").remove();
          $("#footnote-10").append("<p>Arrest reporting deficient in 2011.</p>");
        } else {
          $(".offense-category-footnote").hide();
          $("#footnote-10 p").remove();
        }

    }

    function _createDashboardChart(stateAbbrev, arrestsCSV, crimesCSV, id, createChart) {
        var crimeData, arrestData;
        var arrestReq = $.get(arrestsCSV, function (csv) {
            var data = _csvToArray(csv);
            for (var i = 0; i < data.length; i++) {
                if (data[i][1] == stateAbbrev) {
                    arrestData = _formatStateData(data[i]);
                }
            }
        });
        var crimeReq = $.get(crimesCSV, function (csv) {
            var data = _csvToArray(csv);
            for (var i = 0; i < data.length; i++) {
                if (data[i][1] == stateAbbrev) {
                    crimeData = _formatStateData(data[i]);
                }
            }
        });

        $.when(crimeReq, arrestReq).done(function() {
            var stateName = _getStateName(stateAbbrev);
            createChart(stateName, crimeData, arrestData, id);
        });

    }

    function _adb_appendPageTitles (stateName) {
        $('#category-title span').text('Violent Crime and Arrests in '+ stateName +' (Volume) by Offense Category, 2007–2017');
        $('#non-index-title span').text('Non-Index Crime Arrests in '+stateName+' (Volume), 2007–2017');
    }

    function _adb_createLineChart (stateName, crimeData, arrestData, chartId) {
        function _getLineChartTitle (chartId) {
            if (chartId == 'arrests-chart') {
                return '';
            } else if (chartId == 'aggravated-assault') {
                return 'Aggravated Assault';
            } else {
                return chartId.charAt(0).toUpperCase() + chartId.slice(1);
            }
        }
        Highcharts.setOptions({
            lang: {
                thousandsSep: ',',
            },
        });

        $("#crime-rates span").text('Overall Violent Crime and Arrests in ' + stateName + ' (Volume), 2007–2017');

        var title = _getLineChartTitle(chartId);

        Highcharts.chart(chartId, {
            chart: {
                type: 'line',
            },
            title: {
                text: title,
                align: 'left',
            },
            credits: {
                enabled: false,
            },
            xAxis: {
                categories: ['2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017'],

                // set xAxis labels to display correct year for Rape charts
                labels: {
                    formatter: function () {
                        if (title == "Rape") {
                            return Number(this.value) + 6;
                          } else {
                            return this.value;
                        }
                    }
                }
            },
            tooltip: {
                formatter: function() {
                    var s = '';

                    $.each(this.points, function(i, point) {
                        // set tooltip to display correct year for Rape charts
                        var years = this.point.series.xData.length; 
                        var yearLabel = this.x;

                        var calcYears = function() {
                            if (years == 11) {
                                return s = yearLabel;
                              } else {
                                return s = Number(yearLabel) + 6;
                            }
                        };

                        s += calcYears() + '<br/><span style="color:' + point.color + '">\u25CF</span> ' + point.series.name + ': ' + '<b>' + point.y + '</b><br/>';
                    });

                    return s;
                },
                shared: true
            },
            legend: {
                enabled: false,
            },
            yAxis: {
                min: 0,
                startOnTick: false,
                title: {
                    text: '',
                    align: 'left',
                },
            },
            series: [{
                name: stateName,
                data: crimeData,
            },
            {
                name: stateName,
                data: arrestData,
                color: '#f05a22',
            }],
        });
    }

    function _adb_createAreaChart (stateName, drugData, otherData, chartId) {
        Highcharts.chart(chartId, {
            chart: {
                type: 'area',
            },
            title: {
                text: '',
            },
            credits: {
                enabled: false,
            },
            xAxis: {
                categories: ['2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017'],
            },
            legend: {
                enabled: false,
            },
            yAxis: {
                title: {
                    text: '',
                    align: 'left',
                },
            },
            plotOptions: {
                area: {
                    stacking: 'normal',
                },
            },
            series: [{
                name: stateName,
                data: drugData,
                color: '#fbd813',
                fillOpacity: 1,
              },
              {
                name: stateName,
                data: otherData,
                color: '#f05a22',
                fillOpacity: 1,
            }],
        });
    }

    function _getStateName(stateAbbrev) {
        switch (stateAbbrev) {
          case 'AL':
            return 'Alabama';
          case 'AK':
            return 'Alaska';
          case 'AZ':
            return 'Arizona'
          case 'AR':
            return 'Arkansas'
          case 'CA':
            return 'California'
          case 'CO':
            return 'Colorado'
          case 'CT':
            return 'Connecticut'
          case 'DE':
            return 'Delaware'
          case 'FL':
            return 'Florida'
          case 'GA':
            return 'Georgia'
          case 'HI':
            return 'Hawaii'
          case 'ID':
            return 'Idaho'
          case 'IL':
            return 'Illinois'
          case 'IN':
            return 'Indiana'
          case 'IA':
            return 'Iowa'
          case 'KS':
            return 'Kansas'
          case 'KY':
            return 'Kentucky'
          case 'LA':
            return 'Louisiana'
          case 'ME':
            return 'Maine'
          case 'MD':
            return 'Maryland'
          case 'MA':
            return 'Massachusetts'
          case 'MI':
            return 'Michigan'
          case 'MN':
            return 'Minnesota'
          case 'MS':
            return 'Mississippi'
          case 'MO':
            return 'Missouri'
          case 'MT':
            return 'Montana'
          case 'NE':
            return 'Nebraska'
          case 'NV':
            return 'Nevada'
          case 'NH':
            return 'New Hampshire'
          case 'NJ':
            return 'New Jersey'
          case 'NM':
            return 'New Mexico'
          case 'NY':
            return 'New York'
          case 'NC':
            return 'North Carolina'
          case 'ND':
            return 'North Dakota'
          case 'OH':
            return 'Ohio'
          case 'OK':
            return 'Oklahoma'
          case 'OR':
            return 'Oregon'
          case 'PA':
            return 'Pennsylvania'
          case 'RI':
            return 'Rhode Island'
          case 'SC':
            return 'South Carolina'
          case 'SD':
            return 'South Dakota'
          case 'TN':
            return 'Tennessee'
          case 'TX':
            return 'Texas'
          case 'UT':
            return 'Utah'
          case 'VT':
            return 'Vermont'
          case 'VA':
            return 'Virginia'
          case 'WA':
            return 'Washington'
          case 'WV':
            return 'West Virginia'
          case 'WI':
            return 'Wisconsin'
          case 'WY':
            return 'Wyoming'
        }

    }


    function _createDashboardBullets(state, stateCSV) {
        $.get(stateCSV, function (csv) {
            var data = _csvToArrayQuotes(csv);

            for (var i = 0; i < data.length; i++) {
                var re = /"/g;
                var stateData = "";
                if(data[i][1] !== undefined) {
                  stateData = data[i][1].replace(re, '');
                }

                if (stateData == state) {
                    var title = data[i][2].replace(re, '');
                    var description = data[i][3].replace(re, '');
                    var bullet1 = data[i][4].replace(re, '');
                    var bullet2 = data[i][5].replace(re, '');
                    var linkRegex = /(https?:\/\/[^\s]+)(.*).$/g;

                    bullet1 = bullet1.replace(linkRegex, "<a href='$1' target='_BLANK'>this link</a>.");
                    bullet2 = bullet2.replace(linkRegex, "<a href='$1' target='_BLANK'>this link</a>.");

                    var footnote1 = "";
                    if(data[i][6] !== undefined) {
                      footnote1 = data[i][6].replace(re, '');
                    } else {
                      footnote1 = "";
                    }

                    appendBullets(bullet1, bullet2, title, description, footnote1);
                }
            }
        });
    }

    function appendBullets (bullet1, bullet2, title, description) {
        var bullet = $('#bullets');
        $('#adb-title').text(title);
        $('#bullets-description p').text(description);
        $('#footnote-1 p').empty().text("Percent change may appear inflated in states with small numbers of incidents.");
        bullet.html("<li>"+bullet1+"</li><li>"+bullet2+"</li>");
    }

  },
};
