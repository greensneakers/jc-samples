window.onload = function() {

    Highcharts.chart('container', {
                credits: { enabled: false },
                legend: { enabled: false },
                exporting: { enabled: false },
                title: { text: "Click a state in the map below to access the state workbook." },
                chart: {
                    type: 'tilemap',
                    inverted: true,
                    height: '75%'
                },
                xAxis: {
                    visible: false
                },
                yAxis: {
                    visible: false
                },
                colorAxis: {
                    dataClasses: [{
                        from: 0,
                        to: 2,
                        color: '#0099ff',
                        name: ''
                    }]
                },
                tooltip: {
                    headerFormat: '',
                    pointFormat: '<b>{point.name}</b>'
                },
                plotOptions: {
                    series: {
                        dataLabels: {
                            enabled: true,
                            format: '{point.hca2}',
                            color: '#000000',
                            style: {
                                textOutline: false
                            }
                        },
                        point: {
                            events: {
                                click: function () {
                                    var stateCode = this.options.hca2;
                                    var stateURL = "https://50statespublicsafety.us/app/uploads/2018/06/"+stateCode+"_FINAL.pdf";
                                    window.open(stateURL);
                                                                    }
                            }
                        }
                    }
                },
                series: [{
                    name: '',
                    data: [{
                        'hca2': 'AL',
                        name: 'Alabama',
                        region: 'South',
                        x: 6,
                        y: 7,
                        value: 1
                    }, {
                        'hca2': 'AK',
                        name: 'Alaska',
                        region: 'West',
                        x: 0,
                        y: 0,
                        value: 1
                    }, {
                        'hca2': 'AZ',
                        name: 'Arizona',
                        region: 'West',
                        x: 5,
                        y: 3,
                        value: 1
                    }, {
                        'hca2': 'AR',
                        name: 'Arkansas',
                        region: 'South',
                        x: 5,
                        y: 6,
                        value: 1
                    }, {
                        'hca2': 'CA',
                        name: 'California',
                        region: 'West',
                        x: 5,
                        y: 2,
                        value: 1
                    }, {
                        'hca2': 'CO',
                        name: 'Colorado',
                        region: 'West',
                        x: 4,
                        y: 3,
                        value: 1
                    }, {
                        'hca2': 'CT',
                        name: 'Connecticut',
                        region: 'Northeast',
                        x: 3,
                        y: 11,
                        value: 1
                    }, {
                        'hca2': 'DE',
                        name: 'Delaware',
                        region: 'South',
                        x: 4,
                        y: 9,
                        value: 1
                    }, {
                        'hca2': 'FL',
                        name: 'Florida',
                        region: 'South',
                        x: 8,
                        y: 8,
                        value: 1
                    }, {
                        'hca2': 'GA',
                        name: 'Georgia',
                        region: 'South',
                        x: 7,
                        y: 8,
                        value: 1
                    }, {
                        'hca2': 'HI',
                        name: 'Hawaii',
                        region: 'West',
                        x: 8,
                        y: 0,
                        value: 1
                    }, {
                        'hca2': 'ID',
                        name: 'Idaho',
                        region: 'West',
                        x: 3,
                        y: 2,
                        value: 1
                    }, {
                        'hca2': 'IL',
                        name: 'Illinois',
                        region: 'Midwest',
                        x: 3,
                        y: 6,
                        value: 1
                    }, {
                        'hca2': 'IN',
                        name: 'Indiana',
                        region: 'Midwest',
                        x: 3,
                        y: 7,
                        value: 1
                    }, {
                        'hca2': 'IA',
                        name: 'Iowa',
                        region: 'Midwest',
                        x: 3,
                        y: 5,
                        value: 1
                    }, {
                        'hca2': 'KS',
                        name: 'Kansas',
                        region: 'Midwest',
                        x: 5,
                        y: 5,
                        value: 1
                    }, {
                        'hca2': 'KY',
                        name: 'Kentucky',
                        region: 'South',
                        x: 4,
                        y: 6,
                        value: 1
                    }, {
                        'hca2': 'LA',
                        name: 'Louisiana',
                        region: 'South',
                        x: 6,
                        y: 5,
                        value: 1
                    }, {
                        'hca2': 'ME',
                        name: 'Maine',
                        region: 'Northeast',
                        x: 0,
                        y: 11,
                        value: 1
                    }, {
                        'hca2': 'MD',
                        name: 'Maryland',
                        region: 'South',
                        x: 4,
                        y: 8,
                        value: 1
                    }, {
                        'hca2': 'MA',
                        name: 'Massachusetts',
                        region: 'Northeast',
                        x: 2,
                        y: 10,
                        value: 1
                    }, {
                        'hca2': 'MI',
                        name: 'Michigan',
                        region: 'Midwest',
                        x: 2,
                        y: 7,
                        value: 1
                    }, {
                        'hca2': 'MN',
                        name: 'Minnesota',
                        region: 'Midwest',
                        x: 2,
                        y: 4,
                        value: 1
                    }, {
                        'hca2': 'MS',
                        name: 'Mississippi',
                        region: 'South',
                        x: 6,
                        y: 6,
                        value: 1
                    }, {
                        'hca2': 'MO',
                        name: 'Missouri',
                        region: 'Midwest',
                        x: 4,
                        y: 5,
                        value: 1
                    }, {
                        'hca2': 'MT',
                        name: 'Montana',
                        region: 'West',
                        x: 2,
                        y: 2,
                        value: 1
                    }, {
                        'hca2': 'NE',
                        name: 'Nebraska',
                        region: 'Midwest',
                        x: 4,
                        y: 4,
                        value: 1
                    }, {
                        'hca2': 'NV',
                        name: 'Nevada',
                        region: 'West',
                        x: 4,
                        y: 2,
                        value: 1
                    }, {
                        'hca2': 'NH',
                        name: 'New Hampshire',
                        region: 'Northeast',
                        x: 1,
                        y: 11,
                        value: 1
                    }, {
                        'hca2': 'NJ',
                        name: 'New Jersey',
                        region: 'Northeast',
                        x: 3,
                        y: 10,
                        value: 1
                    }, {
                        'hca2': 'NM',
                        name: 'New Mexico',
                        region: 'West',
                        x: 6,
                        y: 3,
                        value: 1
                    }, {
                        'hca2': 'NY',
                        name: 'New York',
                        region: 'Northeast',
                        x: 2,
                        y: 9,
                        value: 1
                    }, {
                        'hca2': 'NC',
                        name: 'North Carolina',
                        region: 'South',
                        x: 5,
                        y: 9,
                        value: 1
                    }, {
                        'hca2': 'ND',
                        name: 'North Dakota',
                        region: 'Midwest',
                        x: 2,
                        y: 3,
                        value: 1
                    }, {
                        'hca2': 'OH',
                        name: 'Ohio',
                        region: 'Midwest',
                        x: 3,
                        y: 8,
                        value: 1
                    }, {
                        'hca2': 'OK',
                        name: 'Oklahoma',
                        region: 'South',
                        x: 6,
                        y: 4,
                        value: 1
                    }, {
                        'hca2': 'OR',
                        name: 'Oregon',
                        region: 'West',
                        x: 4,
                        y: 1,
                        value: 1
                    }, {
                        'hca2': 'PA',
                        name: 'Pennsylvania',
                        region: 'Northeast',
                        x: 3,
                        y: 9,
                        value: 1
                    }, {
                        'hca2': 'RI',
                        name: 'Rhode Island',
                        region: 'Northeast',
                        x: 2,
                        y: 11,
                        value: 1
                    }, {
                        'hca2': 'SC',
                        name: 'South Carolina',
                        region: 'South',
                        x: 6,
                        y: 8,
                        value: 1
                    }, {
                        'hca2': 'SD',
                        name: 'South Dakota',
                        region: 'Midwest',
                        x: 3,
                        y: 4,
                        value: 1
                    }, {
                        'hca2': 'TN',
                        name: 'Tennessee',
                        region: 'South',
                        x: 5,
                        y: 7,
                        value: 1
                    }, {
                        'hca2': 'TX',
                        name: 'Texas',
                        region: 'South',
                        x: 7,
                        y: 4,
                        value: 1
                    }, {
                        'hca2': 'UT',
                        name: 'Utah',
                        region: 'West',
                        x: 5,
                        y: 4,
                        value: 1
                    }, {
                        'hca2': 'VT',
                        name: 'Vermont',
                        region: 'Northeast',
                        x: 1,
                        y: 10,
                        value: 1
                    }, {
                        'hca2': 'VA',
                        name: 'Virginia',
                        region: 'South',
                        x: 5,
                        y: 8,
                        value: 1
                    }, {
                        'hca2': 'WA',
                        name: 'Washington',
                        region: 'West',
                        x: 2,
                        y: 1,
                        value: 1
                    }, {
                        'hca2': 'WV',
                        name: 'West Virginia',
                        region: 'South',
                        x: 4,
                        y: 7,
                        value: 1
                    }, {
                        'hca2': 'WI',
                        name: 'Wisconsin',
                        region: 'Midwest',
                        x: 2,
                        y: 5,
                        value: 1
                    }, {
                        'hca2': 'WY',
                        name: 'Wyoming',
                        region: 'West',
                        x: 3,
                        y: 3,
                        value: 1
                    }]
                }]
            });

};