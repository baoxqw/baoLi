function  getDaysBetween(dateString1,dateString2){
  let  startDate = Date.parse(dateString1);
  let  endDate = Date.parse(dateString2);
  let days=(endDate - startDate)/(1*24*60*60*1000);
  // alert(days);
  return  days;
}


export {
  getDaysBetween
}
