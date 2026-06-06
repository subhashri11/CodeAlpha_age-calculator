// Age Calculator - script.js

/* Create random twinkling stars in the background */
(function createStars() {
  var container = document.getElementById('stars');
  for (var i = 0; i < 28; i++) {
    var s = document.createElement('div');
    s.className = 'star';
    var size = (Math.random() * 3 + 1.5).toFixed(1);
    s.style.cssText =
      'width:'   + size + 'px;' +
      'height:'  + size + 'px;' +
      'top:'     + (Math.random() * 100).toFixed(2) + '%;' +
      'left:'    + (Math.random() * 100).toFixed(2) + '%;' +
      '--dur:'   + (Math.random() * 4 + 3).toFixed(1) + 's;' +
      '--delay:-'+ (Math.random() * 6).toFixed(1) + 's';
    container.appendChild(s);
  }
})();

/* Cap the date picker at today so future dates can't be picked */
var today = new Date();
document.getElementById('dob').setAttribute(
  'max',
  today.toISOString().split('T')[0]
);

/* Allow Enter key to trigger calculation */
document.getElementById('dob').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') calculate();
});

/* Format large numbers like 1200 → 1.2k */
function fmt(n) {
  return n >= 1000 ? (n / 1000).toFixed(1) + 'k' : String(n);
}

/* Return the zodiac sign based on month and day */
function getZodiac(month, day) {
  var signs = [
    { name: 'Capricorn ♑',   m: 1,  d: 19 },
    { name: 'Aquarius ♒',    m: 2,  d: 18 },
    { name: 'Pisces ♓',      m: 3,  d: 20 },
    { name: 'Aries ♈',       m: 4,  d: 19 },
    { name: 'Taurus ♉',      m: 5,  d: 20 },
    { name: 'Gemini ♊',      m: 6,  d: 20 },
    { name: 'Cancer ♋',      m: 7,  d: 22 },
    { name: 'Leo ♌',         m: 8,  d: 22 },
    { name: 'Virgo ♍',       m: 9,  d: 22 },
    { name: 'Libra ♎',       m: 10, d: 22 },
    { name: 'Scorpio ♏',     m: 11, d: 21 },
    { name: 'Sagittarius ♐', m: 12, d: 21 },
    { name: 'Capricorn ♑',   m: 12, d: 31 }
  ];
  for (var i = 0; i < signs.length; i++) {
    if (month < signs[i].m || (month === signs[i].m && day <= signs[i].d)) {
      return signs[i].name;
    }
  }
  return '';
}

/* Main calculation — runs when button is clicked */
function calculate() {
  var dobInput = document.getElementById('dob').value;
  var errorEl  = document.getElementById('error');
  var resultEl = document.getElementById('result');

  // Hide previous results and errors
  errorEl.style.display  = 'none';
  resultEl.style.display = 'none';

  // Check if user picked a date
  if (!dobInput) {
    errorEl.style.display = 'block';
    return;
  }

  var dob = new Date(dobInput);
  var now = new Date();

  // Check if the date is in the future
  if (dob >= now) {
    errorEl.style.display = 'block';
    return;
  }

  // Calculate years, months, days
  var years  = now.getFullYear() - dob.getFullYear();
  var months = now.getMonth()    - dob.getMonth();
  var days   = now.getDate()     - dob.getDate();

  if (days < 0) {
    months--;
    var prevMonthDays = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    days += prevMonthDays;
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  // Calculate totals
  var totalMonths = years * 12 + months;
  var MS_PER_DAY  = 86400000;
  var totalDays   = Math.floor((now - dob) / MS_PER_DAY);
  var totalWeeks  = Math.floor(totalDays / 7);

  // Next birthday countdown
  var next = new Date(now.getFullYear(), dob.getMonth(), dob.getDate());
  if (next <= now) next.setFullYear(now.getFullYear() + 1);
  var daysUntil = Math.ceil((next - now) / MS_PER_DAY);

  // Day of the week the user was born
  var weekdays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

  // Put all the values into the page
  document.getElementById('ageYears').textContent = years;
  document.getElementById('dMonths').textContent  = fmt(totalMonths);
  document.getElementById('dWeeks').textContent   = fmt(totalWeeks);
  document.getElementById('dDays').textContent    = fmt(totalDays);
  document.getElementById('birthDay').textContent = weekdays[dob.getDay()];
  document.getElementById('nextBday').textContent =
    daysUntil === 1 ? 'tomorrow ✦' : daysUntil + ' days';

  // Show zodiac sign
  var sign = getZodiac(dob.getMonth() + 1, dob.getDate());
  document.getElementById('zodiac').textContent = sign ? '✦ ' + sign + ' ✦' : '';

  // Show the result with animation
  resultEl.style.animation = 'none';
  resultEl.offsetHeight;   // force reflow so animation restarts
  resultEl.style.animation = '';
  resultEl.style.display   = 'block';
}
