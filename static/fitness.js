(function(){
  'use strict';

  /* 顶部星期快捷跳转 */
  var chips = Array.prototype.slice.call(document.querySelectorAll('.chip'));
  chips.forEach(function(chip){
    chip.addEventListener('click', function(){
      var sec = document.getElementById('day-' + chip.dataset.day);
      if (sec) sec.scrollIntoView({ behavior:'smooth', block:'start' });
    });
  });

  /* 滚动时高亮当前星期 */
  var sections = Array.prototype.slice.call(document.querySelectorAll('.day'));
  function spy(){
    var y = window.scrollY + 130;
    var current = null;
    sections.forEach(function(sec){
      if (sec.offsetTop <= y) current = sec.dataset.day;
    });
    chips.forEach(function(c){
      c.classList.toggle('is-active', c.dataset.day === current);
    });
  }
  window.addEventListener('scroll', spy, { passive:true });
  spy();

  /* 标出“今天” */
  var week = ['sun','mon','tue','wed','thu','fri','sat'];
  var today = week[new Date().getDay()];
  var todayChip = document.querySelector('.chip[data-day="' + today + '"]');
  if (todayChip) todayChip.classList.add('is-today');

  /* 进入视口时渐显 */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.day,.block'));
  if ('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if (en.isIntersecting){
          en.target.classList.add('is-in');
          io.unobserve(en.target);
        }
      });
    }, { threshold:.08 });
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('is-in'); });
  }
})();
