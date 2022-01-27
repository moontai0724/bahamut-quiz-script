

(function () {
  'use strict';

  document.querySelector(".BH-qabox1").outerHTML += GM_getResourceText("quizrp");

  let user = new User();
  let quiz = new Quiz();
  let view = new View(user, quiz);
})();
