// ==UserScript==
// @name         巴哈動漫電玩通題庫與解答系統
// @namespace    https://home.gamer.com.tw/moontai0724
// @version      5.0.0
// @description  巴哈動漫電玩通題庫與解答系統，蒐集題庫中～
// @author       moontai0724
// @match        https://forum.gamer.com.tw/B.php*
// @supportURL   https://home.gamer.com.tw/creationDetail.php?sn=3924920
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @connect      script.google.com
// @connect      script.googleusercontent.com
/* globals Database */
// @require https://greasyfork.org/scripts/424464-quizrp-library-database/code/quizrp-library-database.js
/* globals Quiz */
// @require https://greasyfork.org/scripts/424465-quizrp-library-quiz/code/quizrp-library-quiz.js
/* globals User */
// @require https://greasyfork.org/scripts/424466-quizrp-library-user/code/quizrp-library-user.js
/* globals View */
// @require https://greasyfork.org/scripts/424467-quizrp-library-view/code/quizrp-library-view.js
// @resource     quizrp https://raw.githubusercontent.com/moontai0724/bahamut-quiz-script/master/right-box.html
// @license      MIT
// ==/UserScript==

(function () {
  'use strict';

  document.querySelector(".BH-qabox1").outerHTML += GM_getResourceText("quizrp");

  let user = new User();
  let quiz = new Quiz();
  let view = new View(user, quiz);
})();
