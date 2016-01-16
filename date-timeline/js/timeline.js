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


                    tickOffset += monthIncrement;
                }

            }

            makeTimeline();

            var currentModality = 40;

            for (var legend in chronology.settings.modalities) {
                console.log(legend);
                var modColor = chronology.settings.modalities[legend];

                paper.text(50, currentModality, legend).attr({fill: modColor, 'font-weight': 'bold'})

                currentModality += 20;
            }

            var dayIncrement = lineHeight / daysSinceStart;

            for (var j = 0; j < chronology.data.length; j++) {
                console.log(chronology.data[j]);

                var currentPerson = chronology.data[j];
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
        'data': [
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