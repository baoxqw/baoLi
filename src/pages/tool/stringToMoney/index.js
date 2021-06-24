function moneyToNumValue(val) {
  var num=val.trim();
  var ss=num.toString();
  if(ss.length==0){
    return "0";
  }
  return ss.replace(/,/g, "");

}

export default moneyToNumValue
