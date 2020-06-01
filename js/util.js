function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  
  function getGameTime() {
    var currTime = Date.now()
    var timePass = (currTime - gStartTime) / 1000;
    document.querySelector('.stopwatch').innerText = timePass;
}



