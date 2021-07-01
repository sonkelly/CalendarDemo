
const { ccclass, property } = cc._decorator;

@ccclass
export default class itemDate extends cc.Component {

    @property(cc.Label)
    day: cc.Label = null;
    @property(cc.Node)
    bgBlur: cc.Node = null;
    @property(cc.Node)
    bg: cc.Node = null;
    @property(cc.Node)
    active: cc.Node = null;
    @property(cc.Node)
    select: cc.Node = null;

    dataItem = null;


    renderDateData(date, isSelected,  month, year, parrentScript, isEttendance) {
        this.dataItem = {
            date: date, 
            month: month, 
            year: year, 
            isAttendance: isEttendance,
            parrentScript: parrentScript
        };
        this.day.string = date + "";
        if (date == 0) {
            this.node.opacity = 0;
        }
        if (date < new Date().getDate() && month < (new Date().getMonth() + 1)) {
            this.bgBlur.active = false;
        }
        if (date == new Date().getDate()) {
            this.select.active = true;
        }
        if (date > new Date().getDate() && month == (new Date().getMonth() + 1)) {
            this.bg.active = false;
            this.node.getComponent(cc.Button).interactable = false;
        }
        this.active.active = isEttendance;
        this.select.active = isSelected;

    }
    itemOnClick() {
        this.dataItem.parrentScript.reloadCalenar();
        this.dataItem.parrentScript.itemSelected = this.dataItem;
        this.select.active = true;
    }
}
