[
    {
        open_shifts: {
            "title": "Open shifts",
            "number of shifts": 3,
            "shifts": [
                {
                    "id": 1,
                    "label": "custom label",
                    "note": "note",
                    "color": "yellow",
                    "slots": 2,
                    "startTime": "2022-06-11T22:00:00.000Z",
                    "endTime": "2022-06-12T22:00:00.000Z",
                    "break": 0,
                    "subshifts": [
                        {
                            "id": 1,
                            "name": "activity1",
                            "code": "ac",
                            "color": "pink",
                            "start_date": "",
                            "end_date": "",
                            "is_paid": true
                        }
                    ]
                }
            ]
        },
        assigned_shifts: [
            {
                "user_id": 1,
                "name": "Christina",
                "number of hours": "0 hours",
                "shifts": [
                    {
                        "id": 2,
                        "type": "timeoff",
                        "label": "off",
                        "note": "off",
                        "color": "yellow",
                        "startTime": "2022-06-11T22:00:00.000Z",
                        "endTime": "2022-06-12T22:00:00.000Z",
                        "is24Hours": true
                    },
                    {
                        "id": 2,
                        "type": "requestTimeoff",
                        "label": "parental leave",
                        "note": "off",
                        "color": "gray",
                        "startTime": "2022-06-11T22:00:00.000Z",
                        "endTime": "2022-06-12T22:00:00.000Z",
                        "is24Hours": true
                    },
                    {
                        "id": 2,
                        "type": "requestOffer",
                        "note": "off",
                        "color": "gray",
                        "shiftToOffer": {
                            "id": 2,
                            "type": "shift",
                            "label": "custom label",
                            "note": "note",
                            "color": "yellow",
                            "startTime": "2022-06-11T22:00:00.000Z",
                            "endTime": "2022-06-12T22:00:00.000Z",
                            "is24Hours": true,
                            "break": 45,
                            "subshifts": [
                                {
                                    "id": 1,
                                    "name": "activity1",
                                    "code": "ac",
                                    "color": "pink",
                                    "start_date": "",
                                    "end_date": "",
                                    "is_paid": true
                                }
                            ]
                        }
                    },
                    {
                        "id": 2,
                        "type": "requestSwap",
                        "note": "off",
                        "color": "gray",
                        "shiftToSwap": {
                            "id": 2,
                            "type": "shift",
                            "label": "custom label",
                            "note": "note",
                            "color": "yellow",
                            "startTime": "2022-06-11T22:00:00.000Z",
                            "endTime": "2022-06-12T22:00:00.000Z",
                            "is24Hours": true,
                            "break": 45,
                            "subshifts": [
                                {
                                    "id": 1,
                                    "name": "activity1",
                                    "code": "ac",
                                    "color": "pink",
                                    "start_date": "",
                                    "end_date": "",
                                    "is_paid": true
                                }
                            ]
                        },
                        "toSwapWith": {
                            "id": 2,
                            "type": "shift",
                            "label": "custom label",
                            "note": "note",
                            "color": "yellow",
                            "startTime": "2022-06-11T22:00:00.000Z",
                            "endTime": "2022-06-12T22:00:00.000Z",
                            "is24Hours": true,
                            "break": 45,
                            "subshifts": [
                                {
                                    "id": 1,
                                    "name": "activity1",
                                    "code": "ac",
                                    "color": "pink",
                                    "start_date": "",
                                    "end_date": "",
                                    "is_paid": true
                                }
                            ]
                        }
                    },
                    {
                        "id": 2,
                        "type": "shift",
                        "label": "custom label",
                        "note": "note",
                        "color": "yellow",
                        "startTime": "2022-06-11T22:00:00.000Z",
                        "endTime": "2022-06-12T22:00:00.000Z",
                        "is24Hours": true,
                        "break": 45,
                        "subshifts": [
                            {
                                "id": 1,
                                "name": "activity1",
                                "code": "ac",
                                "color": "pink",
                                "start_date": "",
                                "end_date": "",
                                "is_paid": true
                            }
                        ]
                    }

                ]
            }
        ]
    }
]