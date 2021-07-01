const { ccclass, property } = cc._decorator;

@ccclass
export default class DataOffline {

    static saveData(key, data) {
        cc.sys.localStorage.setItem(key, JSON.stringify(data));
    }
    
    static readData(key) {
        let dataResult = null;
        let dataraw = cc.sys.localStorage.getItem(key);
        if (dataraw) {
            dataResult = JSON.parse(dataraw);
        }
        return dataResult;
    }
}
