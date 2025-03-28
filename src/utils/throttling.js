const throttle = (func,delay)=>{
    let isThrottled = false;

    return function(){
      let context = this;
      let args = arguments;

      if(!isThrottled){
        func.apply(context,args);
        isThrottled = true;
        setTimeout(()=>{
          isThrottled = false;
        },delay)
      }
    }
}

export default throttle;