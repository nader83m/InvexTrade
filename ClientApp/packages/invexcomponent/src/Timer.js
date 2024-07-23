class Timer {
    constructor(ms) {
      this.ms = ms;
      this.interval = null;
      this.left = ms / 1000;
    }

    startTimer(){
        this.interval = setInterval(() => {
            if(this.left > 0 ){
                this.left -=1;
            }else{
                this.left = 0;
                clearInterval(this.interval);
            }
        }, 1000)
    }

    resetTimer(){
        this.left = this.ms / 1000;
        clearInterval(this.interval);
        this.startTimer();
    }

    getLeftSeconds(){
        return this.left
    }
}

export default Timer;