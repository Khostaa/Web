const countdown = () =>{
    const countDate = new Date('September 23,2022 17:00:00').getTime();
    const now = new Date().getTime();
    const gap = countDate - now;

  //how time works
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  //calculate
  const textDay = Math.floor(gap / day);
  const textHour = Math.floor((gap % day)/hour);
  const textMinute = Math.floor((gap % hour)/minute);
  const textSecond = Math.floor((gap % minute)/second);

  document.querySelector(".day").innerText = textDay;
  document.querySelector(".hour").innerText = textHour;
  document.querySelector(".minute").innerText = textMinute;
  document.querySelector(".second").innerText = textSecond;
};
setInterval(countdown,1000);

const toggleSwitch = document.querySelector('#theme-toggle');

// Check for saved theme preference
if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
}

toggleSwitch.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    
    // Save preference
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
    } else {
        localStorage.setItem('darkMode', 'disabled');
    }
});
