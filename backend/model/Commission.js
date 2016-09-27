/* 
 * author : lelion21@gmail.com
 */

/**
 * Commission Obj
 * @param {int} rentalPrice
 * @param {int} rentalDay
 * @returns {void}
 */
function Commission(rentalPrice, rentalDay) {

    this.rentalPrice = rentalPrice;
    this.rentalDay = rentalDay;

    this.RENTAL_PRICE_PERCENT = 0.3;
    this.ROADSIDE_ASSISTANCE_BY_DAY = 1;

    this.commission = {
        insurance_fee: 0,
        assistance_fee: 0,
        drivy_fee: 0
    };
}
Commission.prototype.setCommission = function () {
    var rentalPriceCommission = this.rentalPrice * this.RENTAL_PRICE_PERCENT;
    var insurance_fee = rentalPriceCommission / 2;
    var assistance_fee = this.ROADSIDE_ASSISTANCE_BY_DAY * this.rentalDay;
    var drivy_fee = rentalPriceCommission - (insurance_fee + assistance_fee);

    this.commission = {
        insurance_fee: insurance_fee,
        assistance_fee: assistance_fee,
        drivy_fee: drivy_fee
    };
};
Commission.prototype.getCommission = function () {
    return this.commission;
};
Commission.prototype.getCommissionTotal = function () {
    var total = 0;
    for (var key in this.commission) {
        total += this.commission[key];
    }
    return total;
};