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
        dashboardFirstChart(state);
        appendStateDefinition(state);
        dashboardPrisonReconviction(state);
        dashboardPrisonReincarceration(state);
        dashboardProbationRearrest(state);
        dashboardProbationReconviction(state);
        dashboardProbationIncarceration(state);
        setMaxValues(state);
    }

    function setMaxValues(state) {
        var chartNames = ['prison-rearrest', 'prison-reconviction', 'prison-reincarceration', 'probation-rearrest', 'probation-reconviction', 'probation-incarceration'];

        var stateData;
        var maxValues = [];


        for (var i = 0; i < chartNames.length; i++) {
          var stateCSV = '/app/themes/50state/data/recidivism-dashboard/' + chartNames[i] + '.csv';
          $.get(stateCSV, function (csv) {
              var data = _csvToArray(csv);
              for (var ii = 0; ii < data.length; ii++) {
                  if (data[ii][1] == state) {
                      stateData = data[ii].splice(2, 11);
                      stateData = stateData.filter(function(n){ return n != "" });
                      stateData = stateData.map(Number);
                      var maxNumber = Math.max(...stateData);
                      maxValues.splice(i, 0, maxNumber);
                  }
              }

          });
          if(chartNames[i] == 'probation-incarceration') {
            setTimeout(function(){
              var chartMaxValue = Math.max(...maxValues);
              for (var c = 0; c < chartNames.length; c++) {
                $("#"+chartNames[c]+"-chart").highcharts().yAxis[0].setExtremes(0,chartMaxValue);
              }
            }, 100);
          }
        }

    }

    function dashboardPrisonReconviction(state) {
        _generateOtherChartData(state, 'Reconviction', 'prison-reconviction', '#ff9800');
    }

    function dashboardPrisonReincarceration (state) {
        _generateOtherChartData (state, 'Reincarceration', 'prison-reincarceration', '#ff3d00');
    }

    function dashboardProbationRearrest (state)  {
        _generateOtherChartData (state, 'Rearrest', 'probation-rearrest', '#47cdff');
    }

    //

    function dashboardProbationReconviction (state)  {
        _generateOtherChartData (state, 'Reconviction', 'probation-reconviction', '#0092ff');
    }
    function dashboardProbationIncarceration (state)  {
        _generateOtherChartData (state, 'Incarceration', 'probation-incarceration', '#00008b');
    }

    function dashboardFirstChart (state) {
        var stateCSV = '/app/themes/50state/data/recidivism-dashboard/prison-rearrest.csv';
        var stateData, stateName;
        $.get(stateCSV, function(csv) {
            var data = _csvToArray(csv);
            for (var i = 0; i < data.length; i++) {
                if (data[i][1] == state) {
                    stateName = data[i][0];
                    stateData = _formatStateData(data[i]);
                }
            }
            _appendPageTitles(stateName);
            _createFirstChart(stateName, stateData);
        });
    }

    function _appendPageTitles (stateName) {
        $('#title').text(stateName + '\'s Three-Year Recidivism Rates, 2005–2014.*');
    }

    function appendStateDefinition (state) {
        var definitionCSV = '/app/themes/50state/data/recidivism-dashboard/definitions.csv';
        var definition, source;

        $.get(definitionCSV, function(csv) {
            var data = _csvToArrayQuotes(csv);

            for (var i = 1; i < data.length; i++) {
                var re = /"/g;
                var stateData = data[i][1].replace(re, '');
                if (stateData == state) {

                  definition = data[i][2].replace(re, '');

                  var linkRegex = /\[(.*?)\]/g;

                  definition = definition.replace(linkRegex, "<a href='$1' target='_BLANK'>$1</a>");

                  var italicsRegex = /\*(.*)\*/;
                  definition = definition.replace(italicsRegex, '<em>$1</em>');

                  $('#state-definition span').html(definition);

                  source = data[i][3].replace(re, '');

                  source = source.replace(linkRegex, "<a href='$1' target='_BLANK'>$1</a>");

                  source = source.replace(italicsRegex, '<em>$1</em>');

                  $('#state-source').html(source);

                }
            }
        });

    }

    function _createFirstChart (stateName, stateData) {
        Highcharts.setOptions({lang: {noData: "No Data Available"}});
        Highcharts.chart('prison-rearrest-chart', {
            chart: {
                type: 'column',
            },
            title: {
                text: 'Rearrest',
            },
            tooltip: {
                formatter: function () {
                    return this.x +
                        ': <b>' + this.y + '%</b>';
                }
            },
            credits: {
                enabled: false,
            },
            xAxis: {
                categories: ['2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014'],
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
                color: '#ffb600',
            }],
        });
    }


    function _generateOtherChartData (state, title, type, color) {
        var stateCSV = '/app/themes/50state/data/recidivism-dashboard/' + type + '.csv';
        var stateData, stateName;
        $.get(stateCSV, function (csv) {
            var data = _csvToArray(csv);
            for (var i = 0; i < data.length; i++) {
                if (data[i][1] == state) {
                    stateName = data[i][0];
                    stateData = _formatStateData(data[i]);
                }
            }
            var chartId = type + '-chart';
            _createOtherChart(stateName, stateData, title, chartId, color);
        });
    }

    function _createOtherChart (stateName, stateData, title, chartId, color) {
        Highcharts.chart(chartId, {
            chart: {
                type: 'column',
            },
            tooltip: {
                formatter: function () {
                    return this.x +
                        ': <b>' + this.y + '%</b>';
                }
            },
            title: {
                text: title,
            },
            credits: {
                enabled: false,
            },
            xAxis: {
                categories: ['2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014'],
            },
            legend: {
                enabled: false,
            },
            yAxis: {
                title: {
                    text: '',
                },
                 min: 0,
            },
            series: [{
                name: stateName,
                data: stateData,
                color: color,
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
