// ==UserScript==
// @name         巴哈動漫電玩通題庫與解答系統
// @namespace    https://home.gamer.com.tw/moontai0724
// @version      4.1.0
// @description  巴哈動漫電玩通題庫與解答系統，蒐集題庫中～
// @author       moontai0724
// @match        https://forum.gamer.com.tw/B.php*
// @supportURL   https://home.gamer.com.tw/creationDetail.php?sn=3924920
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @connect      script.google.com
// @connect      script.googleusercontent.com
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @resource     quizrp https://raw.githubusercontent.com/moontai0724/bahamut-quiz-script/master/right-box.html
// @license      MIT
// ==/UserScript==

(function (jQuery) {
  'use strict';
  // add button to monitor html loading
  jQuery("body").append('<button id="quizrp_html_loaded" style="display: none;"></button>');
  jQuery('#quizrp_html_loaded').on('click', init);

  // load html
  jQuery(GM_getResourceText("quizrp")).insertAfter(".BH-qabox1");

  // variables
  const qabox = jQuery(".BH-qabox1");
  var quizrp_quiz = {
    sn: qabox.data("quiz-sn"),
    question: encodeURIComponent(qabox.html().replace(/\n/g, '').split('<ul>')[0]),
    options: Array.from(qabox.find("li a").map((index, value) => encodeURIComponent(value.innerText))),
    author: qabox.find("span>a:first").attr("href").match(/gamer.com.tw\/([\s\S]*)/)[1],
    bsn: location.search.split('&').find(value => value.indexOf('bsn') > -1).split('=')[1]
  };

  const BAHAID = document.cookie.split(';').map(value => value.startsWith(' ') ? value.replace(' ', '').split('=', 2) : value.split('=', 2)).find(value => value[0] == 'BAHAID') == undefined ? undefined : document.cookie.split(';').map(value => value.startsWith(' ') ? value.replace(' ', '').split('=', 2) : value.split('=', 2)).find(value => value[0] == 'BAHAID')[1];

  // flag
  var AlreadyAnswered = false;
  var quizrp_show_original_showed = false;

  function init() {
    const qabox = jQuery(".BH-qabox1");

    // init version
    jQuery("#quizrp_version").html(GM_info.script.version);

    // init auto answer and report status
    if (localStorage.quizrp_autoanswer) {
      jQuery(".quizrp.autoanswer_status").addClass("enable");
      setTimeout(() => autoAnswer(), 3000);
    }

    // Get options and remove original answer function
    qabox.find("li a").removeAttr('href');

    // attach click event
    qabox.find("li a").on("click", event => manualAnswer(quizrp_quiz.options.indexOf(encodeURIComponent(event.target.innerText)) + 1));

    // attach auto answer toggle button
    jQuery("#quizrp_autoanswer_switch").on("click", toggleAutoAnswer);

    // attach show quiz button
    jQuery("#quizrp_show_original_btn").on("click", display_original_quiz);

    // attach hint button
    jQuery("#quizrp_gethint").on("click", getHint);
  }

  // To get hint
  function getHint() {
    DB_get('hint').then(hint => {
      jQuery("#quizrp_gethint").addClass("quizrp hidden");

      if (hint.success) {
        qabox.find(`li:nth-child(${hint.message}) a`).css({ "color": "red", "text-decoration": "line-through" });
        jQuery("#quizrp_hint").css("color", "green").html("提示已獲取。");
      } else {
        jQuery("#quizrp_hint").css("color", "red").html("題庫中無資料。");
      }
    });
  };

  // To show the original QA and ans
  function display_original_quiz() {
    if (quizrp_show_original_showed == false) {
      quizrp_show_original_showed = true;
      jQuery("#quizrp_show_original_btn").addClass("quizrp hidden");
      jQuery(".quizrp.original").removeClass("hidden").html(`題目編號：${quizrp_quiz.sn}<br>原題目：${decodeURIComponent(quizrp_quiz.question)}<ol><li>${quizrp_quiz.options.map(decodeURIComponent).join("</li><li>")}</li></ol>`);
    }

    DB_get('answer').then(async ans => {
      if (!ans.success) {
        ans = await getAnswer();
        if (AlreadyAnswered == false) DB_post(ans, true);
      } else {
        ans = ans.message
      }

      jQuery(`.quizrp.original li`).css({ "color": "red", "text-decoration": "line-through" });
      jQuery(`.quizrp.original li:nth-child(${ans})`).css({ "color": "green", "font-weight": "bold", "text-decoration": "" });
    });
  }

  // Get a return of answer or a space
  function DB_get(action) {
    return new Promise(function (resolve, reject) {
      GM_xmlhttpRequest({
        method: "GET",
        url: "https://script.google.com/macros/s/AKfycbxYKwsjq6jB2Oo0xwz4bmkd3-5hdguopA6VJ5KD/exec?type=" + action + "&sn=" + quizrp_quiz.sn,
        onload: data => {
          console.log(data.response)
          resolve(JSON.parse(data.response))
        },
        onerror: reject
      });
    });
  }

  // Start report to database
  function DB_post(this_answered, correctness) {
    return new Promise((resolve, reject) => {
      qabox.css("background-color", "#cccccc");
      GM_xmlhttpRequest({
        method: 'POST',
        url: 'https://script.google.com/macros/s/AKfycbxYKwsjq6jB2Oo0xwz4bmkd3-5hdguopA6VJ5KD/exec',
        data: JSON.stringify({
          "version": GM_info.script.version,
          "sn": quizrp_quiz.sn,
          "question": quizrp_quiz.question,
          "options": quizrp_quiz.options,
          "BoardSN": quizrp_quiz.bsn,
          "reporter": BAHAID,
          "author": quizrp_quiz.author,
          "this_answered": this_answered,
          "correctness": correctness
        }),
        onload: function (data) {
          data = JSON.parse(data.response);

          jQuery(".quizrp.report_status").html(data.message);

          // if success, add class to status
          if (data.success) {
            jQuery(".quizrp.report_status").addClass("success");
            resolve();
          } else {
            reject();
          }

          // remove loading style
          qabox.css("background-color", "");
        }
      });
    })
  }

  function manualAnswer(option) {
    if (BAHAID) {
      AlreadyAnswered = true;
      getCSRFToken().then(CSRFToken => answerQuiz(option, CSRFToken).then(correctness => {
        if (correctness)
          DB_post(option, correctness);
      }));
    } else {
      if (window.confirm('您尚未登入！'))
        location.href = 'https://user.gamer.com.tw/login.php';
    }
  }

  function autoAnswer() {
    if (AlreadyAnswered == false) {
      AlreadyAnswered = true;
      DB_get('checkExisting').then(function (data) {
        if (data.success) {
          jQuery(".quizrp.report_status").html('題庫中有答案，無須回報。').css("color", "green");
        } else {
          getAnswer().then(ans => DB_post(ans, true).then(display_original_quiz));
        }
      });
    }
  }

  function toggleAutoAnswer() {
    if (localStorage.quizrp_autoanswer) {
      localStorage.removeItem('quizrp_autoanswer');
      jQuery(".quizrp.autoanswer_status.enable").removeClass("enable");
    } else {
      localStorage.setItem('quizrp_autoanswer', 'true');
      jQuery(".quizrp.autoanswer_status").addClass("enable");

      autoAnswer();
    }
  }

  function getAnswer() {
    return new Promise(function (resolve, reject) {
      getCSRFToken().then(function (CSRFToken) {
        (function next(ans) {
          return new Promise(async function (resolve, reject) {
            if (await answerQuiz(ans, CSRFToken, false))
              resolve(ans);
            else if (ans > 4)
              reject();
            else
              next(Number(ans) + 1).then(ans => resolve(ans));
          });
        })(1).then(ans => {
          resolve(ans);
        }, reject);
      }, reject);
    });
  }

  function answerQuiz(ans, CSRFToken, setQABox = true) {
    return new Promise(function (resolve, reject) {
      jQuery.get("/ajax/quiz_answer.php", { sn: quizrp_quiz.sn, o: ans, token: CSRFToken }).then(data => {
        if (setQABox)
          qabox.css("text-align", "center").html(data);
        resolve(/答對/.test(data), data);
      });
    });
  }

  function getCSRFToken() {
    return new Promise(function (resolve, reject) {
      jQuery.ajax({
        type: "GET",
        url: "/ajax/getCSRFToken.php",
        cache: false
      }).then(resolve, reject);
    })
  }
})(jQuery);
