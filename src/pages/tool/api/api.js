function api(props,type,payload) {
  const { dispatch } = props;
  return new Promise((resolve, reject) => {
    dispatch({
      type,
      payload,
      callback:(res)=>{
        if(res.errCode !== 2){
          resolve(res)
        }else{
          reject(res)
        }
      }
    })
  })
}

export default api;
