
const { ccclass, property } = cc._decorator;
import CalendarEntity from "./Model/CalendarEntity";

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    calendarLayout: cc.Node = null;
    @property(cc.Prefab)
    itemDate: cc.Prefab = null;
    @property(cc.Label)
    monthTxt: cc.Label = null;
    @property(cc.Node)
    btnNext: cc.Node = null;
    @property(cc.Node)
    btnPre: cc.Node = null;

    @property(cc.Sprite)
    progressbar: cc.Sprite = null;

    @property(cc.Node)
    btnGift1: cc.Node = null;
    @property(cc.Node)
    btnGift2: cc.Node = null;
    @property(cc.Node)
    btnGift3: cc.Node = null;

    currYear = new Date().getFullYear();
    currMonth = new Date().getMonth() + 1;
    currDay = new Date().getDate();
    itemSelected: any = {
        date: 0,
        month: 0,
        year: 0,
        isAttendance: 0,
        parrentScript: this
    };;
    countDate = 30;

    calendarEntity: CalendarEntity = null;

    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    start() {
        this.calendarEntity = CalendarEntity.getInstance();
        this.renderCalendar(new Date().getMonth() + 1, new Date().getFullYear());
    }
    century(y) {
        return Math.floor(y / 100);
    }
    month(m) {
        return m < 3 ? m + 10 : m - 2;
    }
    year(y) {
        return y % 100;
    }
    _zeller(day, month, year) {
        return (day + 2 * month + (3 * (month + 1)) / 5 + year + year / 4) % 7;
    }
    zeller(d, m, y) {
        return this._zeller(d, this.month(m), this.year(y));
    }
    isLeap(year) {
        if ((year % 4) || ((year % 100 === 0) && (year % 400))) return 0;
        else return 1;
    }
    monthLeap(month, year) {
        return month == 2 ? (28 + this.isLeap(year)) : 31 - (month - 1) % 7 % 2;
    }
    i() {
        return 0;
    }
    daysIn(month, year) {
        return month === 2 ? (28 + this.isLeap(year)) : 31 - (month - 1) % 7 % 2;
    }
    getCalendar(month, year) {
        var startIndex = Math.trunc(this.zeller(1, month, year));
        var endIndex = this.daysIn(month, year);
        var result = Array.apply(0, Array(42)).map(function (i) { return 0; });
        for (var i = startIndex; i < endIndex + startIndex; i++) {
            result[i - 1] = (i - startIndex) + 1;
        }
        return result;
    }
    getLatsDate(dataCalendar) {
        var max = dataCalendar[0];
        dataCalendar.forEach(element => {
            if (max < element) {
                max = element;
            }
        });
        return max;
    }
    getCountDate(dataCalendar) {
        var count = 0;
        dataCalendar.forEach(element => {
            if (element > 0) {
                count++;
            }
        });
        return count;
    }
    renderCalendar(m, y) {
        this.monthTxt.string = this.months[this.currMonth - 1];
        if (y > new Date().getFullYear()) {
            this.btnNext.opacity = 150;
            this.btnNext.getComponent(cc.Button).interactable = false;
        } else {
            if (m >= (new Date().getMonth() + 1) && y >= (new Date().getFullYear())) {
                this.btnNext.opacity = 150;
                this.btnNext.getComponent(cc.Button).interactable = false;
            } else {
                this.btnNext.opacity = 255;
                this.btnNext.getComponent(cc.Button).interactable = true;
            }
        }

        var dataCalendar = this.getCalendar(m, y);
        this.countDate = this.getCountDate(dataCalendar);
        this.calendarLayout.removeAllChildren();


        if (m == (new Date().getMonth() + 1) && y == new Date().getFullYear()) {
            this.itemSelected.date = new Date().getDate();
        } else {
            this.itemSelected.date = this.getLatsDate(dataCalendar);
        }
        dataCalendar.forEach(day => {
            if (day > 0) {
                this.currDay = day;
            }
            var item = cc.instantiate(this.itemDate);
            if (item) {
                this.calendarLayout.addChild(item);
                var script = item.getComponent("itemDate");
                if (script) {
                    script.renderDateData(day, (this.itemSelected.date == day), this.currMonth, this.currYear, this, this.calendarEntity.getDayByMonth(day, this.currMonth, this.currYear));
                }
            }
        });
        this.renderProgressGift();
    }
    renderProgressGift() {
        var progress = this.calendarEntity.getListDay(this.currMonth, this.currYear);
        this.progressbar.fillRange = progress.length / this.countDate;
        if (progress.length < 10) {
            this.btnGift1.getComponent(cc.Button).interactable = false;
            this.btnGift3.getComponent(cc.Button).interactable = false;
            this.btnGift2.getComponent(cc.Button).interactable = false;
        }
        if (progress.length >= 10) {
            this.btnGift1.getComponent(cc.Button).interactable = !this.calendarEntity.giftData.gift1;
            this.btnGift3.getComponent(cc.Button).interactable = false;
            this.btnGift2.getComponent(cc.Button).interactable = false;
        }
        if (progress.length >= 20) {
            this.btnGift1.getComponent(cc.Button).interactable = !this.calendarEntity.giftData.gift1;
            this.btnGift2.getComponent(cc.Button).interactable = !this.calendarEntity.giftData.gift2;
            this.btnGift3.getComponent(cc.Button).interactable = false;

        }
        if (progress.length == this.countDate) {
            this.btnGift1.getComponent(cc.Button).interactable = !this.calendarEntity.giftData.gift1;
            this.btnGift2.getComponent(cc.Button).interactable = !this.calendarEntity.giftData.gift2;
            this.btnGift3.getComponent(cc.Button).interactable = !this.calendarEntity.giftData.gift3;
        }
    }

    updateAattendance(m, y) {
        this.monthTxt.string = this.months[this.currMonth - 1];
        if (y > new Date().getFullYear()) {
            this.btnNext.opacity = 150;
            this.btnNext.getComponent(cc.Button).interactable = false;
        } else {
            if (m >= (new Date().getMonth() + 1) && y >= (new Date().getFullYear())) {
                this.btnNext.opacity = 150;
                this.btnNext.getComponent(cc.Button).interactable = false;
            } else {
                this.btnNext.opacity = 255;
                this.btnNext.getComponent(cc.Button).interactable = true;
            }
        }

        var dataCalendar = this.getCalendar(m, y);
        this.calendarLayout.removeAllChildren();


        dataCalendar.forEach(day => {
            if (day > 0) {
                this.currDay = day;
            }
            var item = cc.instantiate(this.itemDate);
            if (item) {
                this.calendarLayout.addChild(item);
                var script = item.getComponent("itemDate");
                if (script) {
                    script.renderDateData(day, (this.itemSelected.date == day), this.currMonth, this.currYear, this, this.calendarEntity.getDayByMonth(day, this.currMonth, this.currYear));
                }
            }
        });
        this.renderProgressGift();
    }
    reloadCalenar() {
        var data = this.calendarLayout.children;
        data.forEach(element => {
            element.getChildByName("select").active = false;
        });
    }
    nextMonthOnClick() {
        this.currMonth++;
        if (this.currMonth == 13) {
            this.currMonth = 1;
            this.currYear = new Date().getFullYear() + 1;
        }
        this.renderCalendar(this.currMonth, this.currYear);
    }
    preMonthOnClick() {
        this.currMonth--;
        if (this.currMonth == 0) {
            this.currMonth = 12;
            this.currYear--;
        }
        this.renderCalendar(this.currMonth, this.currYear);
    }
    btnAttendanceOnClick() {
        if (this.itemSelected.isAttendance) {
            cc.error("Yoou Already Attendance!");
        } else {
            this.calendarEntity.attendance(this.itemSelected.date, this.currMonth, this.currYear);
            this.updateAattendance(this.currMonth, this.currYear);
        }
    }

    btnGift1OnClick() {
        this.calendarEntity.getGift(1);
        cc.error("You got gift!");
        this.updateAattendance(this.currMonth, this.currYear);
    }
    btnGift2OnClick() {
        this.calendarEntity.getGift(2);
        cc.error("You got gift!");
        this.updateAattendance(this.currMonth, this.currYear);
    }
    btnGift3OnClick() {
        this.calendarEntity.getGift(3);
        cc.error("You got gift!");
        this.updateAattendance(this.currMonth, this.currYear);
    }

}
