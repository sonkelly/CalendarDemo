import DataOffline from "../Lib/DataOffline";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CalendarEntity {
    private static instance: CalendarEntity;

    private constructor() { }

    public static getInstance(): CalendarEntity {
        if (!CalendarEntity.instance) {
            CalendarEntity.instance = new CalendarEntity();
        }
        this.instance.getDataLocal();
        return CalendarEntity.instance;
    }
    public keyData = "CalendarEntity";
    public calendarData = [];
    public giftData = {
        gift1: false,
        gift2: false,
        gift3: false
    };

    private makeDataCalendarDefault() {
        var dataDate = new Date();
        var currMonth = dataDate.getMonth() + 1;
        if (currMonth > 1 && currMonth < 12) {
            var currYear = {
                year: dataDate.getFullYear(),
                listMonth: []
            }
            for (var i = 1; i <= currMonth; i++) {
                var month = {
                    month: i,
                    listDay: []
                }
                currYear.listMonth.push(month);
            }
            var oldYear = {
                year: dataDate.getFullYear() - 1,
                listMonth: []
            }
            for (var j = currMonth + 1; j <= 12; j++) {
                var oldMonth = {
                    month: j,
                    listDay: []
                }
                oldYear.listMonth.push(oldMonth);
            }
            this.calendarData.push(oldYear);
            this.calendarData.push(currYear);
        } else {
            var currYear = {
                year: dataDate.getFullYear(),
                listMonth: []
            }
            for (var i = 1; i <= currMonth; i++) {
                var month = {
                    month: i,
                    listDay: []
                }
                currYear.listMonth.push(month);
            }
            this.calendarData.push(currYear);
        }
    }
    getGift(keyGift) {
        switch (keyGift) {
            case 1:
                this.giftData.gift1 = true;
                break;
            case 2:
                this.giftData.gift2 = true;
                break;
            case 3:
                this.giftData.gift3 = true;
                break;
        }
        this.saveData();
    }

    public getDataLocal() {
        let data = DataOffline.readData(this.keyData);
        if (data && data != null) {
            this.calendarData = data.calendarData;
            this.giftData = data.giftData;
        } else {
            this.initDataDefault();
        }
    }
    public getDayByMonth(d, m, y) {
        var isEttendance = false;
        if (this.calendarData && this.calendarData.length > 0) {
            this.calendarData.forEach(elementY => {
                if (Number(elementY.year) == Number(y)) {
                    if (elementY.listMonth && elementY.listMonth.length > 0) {
                        elementY.listMonth.forEach(elementM => {
                            if (Number(elementM.month) == Number(m)) {
                                if (elementM.listDay && elementM.listDay.length > 0) {
                                    elementM.listDay.forEach(elementD => {
                                        if (Number(elementD) == Number(d)) {
                                            isEttendance = true;
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
            });
        }
        return isEttendance;
    }
    public getListDay(m, y) {
        var listDay = [];
        if (this.calendarData && this.calendarData.length > 0) {
            this.calendarData.forEach(elementY => {
                if (Number(elementY.year) == Number(y)) {
                    if (elementY.listMonth && elementY.listMonth.length > 0) {
                        elementY.listMonth.forEach(elementM => {
                            if (Number(elementM.month) == Number(m)) {
                                listDay = elementM.listDay;
                            }
                        });
                    }
                }
            });
        }
        return listDay;
    }
    public attendance(d, m, y) {
        if (this.calendarData && this.calendarData.length > 0) {
            this.calendarData.forEach(elementY => {
                if (Number(elementY.year) == Number(y)) {
                    if (elementY.listMonth && elementY.listMonth.length > 0) {
                        elementY.listMonth.forEach(elementM => {
                            if (Number(elementM.month) == Number(m)) {
                                if (elementM.listDay) {
                                    elementM.listDay.push(d);
                                }
                            }
                        });
                    }
                }
            });
        }
        this.saveData();
    }

    public getAllData() {
        let data = {
            calendarData: this.calendarData,
            giftData: this.giftData
        };
        return data;
    }
    public saveData() {
        DataOffline.saveData(this.keyData, this.getAllData());
    }
    public initDataDefault() {
        this.makeDataCalendarDefault();
        this.saveData();
    }
}
