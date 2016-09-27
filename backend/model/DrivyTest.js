/* 
 * author : lelion21@gmail.com
 */

function DrivyTest() {
    this.level = null;
}
DrivyTest.prototype.setLevel = function () {
    var me = this;
    var pathname = document.location.pathname;
    var tmps = pathname.split("/");
    var regExp = /^level(\d+)/gi;
    var result;
    tmps.forEach(function (tmp) {
        result = regExp.exec(tmp);
        if (result) {
            me.level = result[1];
        }
    });
};
DrivyTest.prototype.getLevel = function () {
    return this.level;
};
DrivyTest.prototype.getLevelLabel = function () {
    return "level " + this.level;
};
DrivyTest.prototype.setDocument = function () {
    document.title = document.title + " ::: " + this.getLevelLabel();
    
    document.getElementsByTagName('h1')[0].innerHTML = "Just press [F12] and look at the console ...";
};

//(function () {
    var myDrivyTest = new DrivyTest();
    myDrivyTest.setLevel();
    myDrivyTest.setDocument();

    console.log("--- " + myDrivyTest.getLevelLabel() + " -----------------------------------------------");

//})();