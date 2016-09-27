/* 
 * author : lelion21@gmail.com
 */

/**
 * Options Obj
 * @returns {void}
 */
function Options() {

    this.DEDUCTIBLE_REDUCTION_BY_DAY = 4;
    this.DEDUCTIBLE_REDUCTION_RATE = 0.2;

    this.deductible_reduction = 0;
}

Options.prototype.setDeductibleReduction = function (car_price_per_day, rental_day) {
    //console.log("### setDeductibleReduction", car_price_per_day, rental_day);
    this.deductible_reduction = car_price_per_day * this.DEDUCTIBLE_REDUCTION_RATE * rental_day;
};
Options.prototype.getDeductibleReduction = function () {
    return this.deductible_reduction;
};

Options.prototype.getOptions = function () {
    return {
        deductible_reduction: this.getDeductibleReduction()
    };
};