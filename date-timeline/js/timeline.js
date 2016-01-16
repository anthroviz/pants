$(document).ready(function() {
    var chronology = {
        'settings': {
            'startDate': '2010-07-01',
            'startAge': 16,
            'orientation': 'vertical',
            'width': 500,
            'height': 2000,
            'modalities': {
                'friend': 'green',
                'reddit': 'silver',
                'okc': 'blue',
                'tinder': 'orange'
            }
        },
        'init': function() {
            var paper = new Raphael(0, 0, chronology.settings.width, chronology.settings.height);
            var middleX = chronology.settings.width / 2;
            var verticalOffset = 40;
            var lineHeight = chronology.settings.height - (verticalOffset * 2);
            var endY = chronology.settings.height - verticalOffset;

            var drawSeg = function(start, finish) {
                return paper.path('M' + start + finish);
            };

            drawSeg(chronology.getPoint(middleX, verticalOffset), chronology.getPoint(middleX, endY));

            var startMoment = moment(chronology.settings.startDate);
            var nowMoment = moment();

            var tickOffset = verticalOffset;

            console.log(nowMoment.diff(startMoment, 'months'));
            console.log(nowMoment.diff(startMoment, 'days'));

            var monthsSinceStart = nowMoment.diff(startMoment, 'months');
            var daysSinceStart = nowMoment.diff(startMoment, 'days');

            function drawTick(tickWidth, tickY) {
                var halfTick = tickWidth/2;
                var tickStart = chronology.getPoint(middleX - halfTick, tickY);
                var tickEnd = chronology.getPoint(middleX + halfTick, tickY);
                drawSeg(tickStart, tickEnd);
            }

            /*var outputObject = []*/

            function drawMoodScale(mood) {
                return 65 + (20 * mood);
            }

            for (var a = 1; a <= 5; a++) {
                paper.circle(drawMoodScale(a), verticalOffset, 5);
            }

            function makeTimeline() {
                var year = 25;
                var month = 10;
                var startAge = chronology.settings.startAge;
                var monthIncrement = lineHeight / monthsSinceStart;

                for (var i = 0; i <= monthsSinceStart; i++) {
                    var tick = month;

                    var currentMonth = moment(startMoment).add(i, 'months');

                    if (currentMonth.month() === 7) {
                        tick = year;
                        paper.text(230, tickOffset + 15, startAge += 1).attr({'font-size': 18});
                    }

                    drawTick(tick, tickOffset);
                    paper.text(200, tickOffset, currentMonth.format('MM YYYY'));

                   
                    var key;
                    var monthOffset = currentMonth.month() + 1;

                    if (monthOffset < 10) {
                        key = '0' + monthOffset + '-' + currentMonth.year();
                    } else {
                        key = '' + monthOffset + '-' + currentMonth.year();
                    }

                    console.log()

                    var currentMood = chronology.moodData[key];

                    paper.circle(drawMoodScale(currentMood), tickOffset, 3)

                    //outputObject.push("'" + key + "'" + ": { 3 }");*/

                    tickOffset += monthIncrement;
                }
            }

            makeTimeline();

            /*console.log(outputObject)*/

            var currentModality = 40;

            for (var legend in chronology.settings.modalities) {
                //console.log(legend);
                var modColor = chronology.settings.modalities[legend];

                paper.text(50, currentModality, legend).attr({fill: modColor, 'font-weight': 'bold'})

                currentModality += 20;
            }

            var dayIncrement = lineHeight / daysSinceStart;


            // encounter loops
            for (var j = 0; j < chronology.encounterData.length; j++) {
                //console.log(chronology.encounterData[j]);

                var currentPerson = chronology.encounterData[j];
                var personStart = moment(currentPerson.appxStartDate);
                var personEnd = currentPerson.appxEndDate === null ? nowMoment : moment(currentPerson.appxEndDate);
                var daysSincePerson = personStart.diff(startMoment, 'days');
                var heightDuration = personEnd.diff(personStart, 'days') * dayIncrement;
                var startingPosition = (daysSincePerson * dayIncrement);
                var startTickY = verticalOffset + startingPosition;
                var personXOffset = ((j+1) * 12);
                var currentModality = chronology.settings.modalities[currentPerson.modality];

                paper.circle(250 + personXOffset, startTickY, 3).attr({fill: currentModality});
                paper.text(250 + personXOffset, startTickY - 8, j+1).attr({'font-size': 8});

                if (typeof currentPerson.encounters === 'number' && currentPerson.encounters > 1) {
                    for (var k = 1; k < currentPerson.encounters; k++) {
                        paper.circle(250 + personXOffset, startTickY + ((heightDuration / (currentPerson.encounters - 1)) * k), 1).attr({'stroke': currentModality});
                    }
                } else if (typeof currentPerson.encounters === 'object') {
                    for (var m = 0; m < currentPerson.encounters.length; m++) {
                        var plotCustomY = moment(currentPerson.encounters[m]).diff(personStart, 'days') * dayIncrement;
                        paper.circle(250 + personXOffset, startTickY + plotCustomY, 1).attr({'stroke': currentModality});
                    }
                }

                if (currentPerson.relationship) {
                    var relationshipLineX = 250 + personXOffset + 5;
                    drawSeg(chronology.getPoint(relationshipLineX, startTickY), chronology.getPoint(relationshipLineX, startTickY + heightDuration)).attr({'stroke-width': 1, 'stroke': 'red'});
                }
            }
        },
        'getPoint': function(x, y) {
            return x + ',' + y + ',';   
        },
        'lifeData': [
            {
                'appxStartDate': '2010-09-01',
                'appxEndDate': '2011-06-01',
                'event': ''
            }
        ],
        'moodData': {
            '07-2010': 4,
            '08-2010': 4,
            '09-2010': 2,
            '10-2010': 3,
            '11-2010': 2,
            '12-2010': 3,
            '01-2011': 4,
            '02-2011': 3,
            '03-2011': 2,
            '04-2011': 3,
            '05-2011': 4,
            '06-2011': 4,
            '07-2011': 3,
            '08-2011': 4,
            '09-2011': 4,
            '10-2011': 3.5,
            '11-2011': 4,
            '12-2011': 4,
            '01-2012': 4,
            '02-2012': 3,
            '03-2012': 3,
            '04-2012': 2,
            '05-2012': 4,
            '06-2012': 5,
            '07-2012': 4.5,
            '08-2012': 5,
            '09-2012': 3.5,
            '10-2012': 4,
            '11-2012': 4,
            '12-2012': 5,
            '01-2013': 2,
            '02-2013': 2,
            '03-2013': 1,
            '04-2013': 2,
            '05-2013': 2,
            '06-2013': 1,
            '07-2013': 3,
            '08-2013': 4,
            '09-2013': 3,
            '10-2013': 4,
            '11-2013': 3,
            '12-2013': 3,
            '01-2014': 4,
            '02-2014': 4,
            '03-2014': 4,
            '04-2014': 3,
            '05-2014': 3,
            '06-2014': 2,
            '07-2014': 3,
            '08-2014': 3,
            '09-2014': 2,
            '10-2014': 4,
            '11-2014': 3,
            '12-2014': 3,
            '01-2015': 4,
            '02-2015': 4,
            '03-2015': 2,
            '04-2015': 2,
            '05-2015': 1,
            '06-2015': 2,
            '07-2015': 2.5,
            '08-2015': 4,
            '09-2015': 4,
            '10-2015': 5,
            '11-2015': 3,
            '12-2015': 4,
            '01-2016': 2
        },
        'encounterData': [
            {
                'appxStartDate': '2010-07-04',
                'appxEndDate': '2010-07-20',
                'encounters': 3,
                'regular': true,
                'modality': 'friend',
                'relationship': false
            },
            {
                'appxStartDate': '2011-07-19',
                'appxEndDate': '2012-05-10',
                'encounters': 30,
                'regular': true,
                'modality': 'friend',
                'relationship': true
            },
            {
                'appxStartDate': '2012-02-27',
                'appxEndDate': '2012-02-27',
                'encounters': 1,
                'regular': false,
                'modality': 'friend',
                'relationship': false
            },
            {
                'appxStartDate': '2012-04-20',
                'appxEndDate': '2012-06-01',
                'encounters': 10,
                'regular': true,
                'modality': 'okc',
                'relationship': true
            },
            {
                'appxStartDate': '2012-05-20',
                'appxEndDate': '2012-05-20',
                'encounters': 1,
                'regular': false,
                'modality': 'friend',
                'relationship': false
            },
            {
                'appxStartDate': '2012-05-26',
                'appxEndDate': '2013-06-08',
                'encounters': 50,
                'regular': true,
                'modality': 'okc',
                'relationship': true
            },
            {
                'appxStartDate': '2013-06-29',
                'appxEndDate': '2013-07-07',
                'encounters': 2,
                'regular': true,
                'modality': 'reddit',
                'relationship': false
            },
            {
                'appxStartDate': '2013-07-08',
                'appxEndDate': '2013-07-08',
                'encounters': 1,
                'regular': false,
                'modality': 'reddit',
                'relationship': false
            },
            {
                'appxStartDate': '2013-07-11',
                'appxEndDate': '2013-07-11',
                'encounters': 1,
                'regular': false,
                'modality': 'reddit',
                'relationship': false
            },
            {
                'appxStartDate': '2013-07-14',
                'appxEndDate': '2015-09-15',
                'encounters': [
                    '2013-07-14',
                    '2013-07-20',
                    '2013-07-25',
                    '2013-08-08',
                    '2013-12-31',
                    '2015-05-01'
                ],
                'regular': false,
                'modality': 'friend',
                'relationship': true
            },
            {
                'appxStartDate': '2015-08-15',
                'appxEndDate': '2015-08-30',
                'encounters': 3,
                'regular': true,
                'modality': 'friend',
                'relationship': false
            },
            {
                'appxStartDate': '2015-09-05',
                'appxEndDate': '2015-09-05',
                'encounters': 1,
                'regular': false,
                'modality': 'tinder',
                'relationship': false
            },
            {
                'appxStartDate': '2015-09-11',
                'appxEndDate': null,
                'encounters': 30,
                'regular': true,
                'modality': 'friend',
                'relationship': true
            },
            {
                'appxStartDate': '2015-10-09',
                'appxEndDate': '2015-10-09',
                'encounters': 1,
                'regular': true,
                'modality': 'friend',
                'relationship': false
            },
            {
                'appxStartDate': '2015-10-11',
                'appxEndDate': '2015-10-12',
                'encounters': 2,
                'regular': true,
                'modality': 'tinder',
                'relationship': false
            },
            {
                'appxStartDate': '2015-10-28',
                'appxEndDate': '2015-11-13',
                'encounters': 5,
                'regular': true,
                'modality': 'friend',
                'relationship': false
            },
            {
                'appxStartDate': '2015-12-01',
                'appxEndDate': '2015-12-17',
                'encounters': 2,
                'regular': true,
                'modality': 'tinder',
                'relationship': false
            }
        ]
    };

    chronology.init();
});