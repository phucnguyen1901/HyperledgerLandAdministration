


function getNow(){
    let date_ob = new Date();
    let monthNow = date_ob.getMonth() < 9 ? `0${date_ob.getMonth()+1}` : `${date_ob.getMonth()+1}`;
    let newDate = `${date_ob.getDate()}/${monthNow}/${date_ob.getFullYear()}`;
    let getHour = date_ob.getHours() < 9 ? `0${date_ob.getHours()+1}` : `${date_ob.getHours()+1}`;
    let getMinute = date_ob.getMinutes() < 9 ? `0${date_ob.getMinutes()+1}` : `${date_ob.getMinutes()+1}`;
    let time = `${getHour}:${getMinute}`;
    let thoigiandangky = `${time}-${newDate}`;
    return thoigiandangky;
}


module.exports = getNow;







