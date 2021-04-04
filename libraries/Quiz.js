// ==UserScript==
// @name         quizrp-library-quiz
// @namespace    https://home.gamer.com.tw/moontai0724
// @version      5.0.0
// @description  a library for quizrp project
// @author       moontai0724
// @match        https://forum.gamer.com.tw/B.php*
// @supportURL   https://home.gamer.com.tw/creationDetail.php?sn=3924920
// @grant        none
/* globals Database */
// @require https://greasyfork.org/scripts/424464-quizrp-library-database/code/quizrp-library-database.js
/* globals User */
// @require https://greasyfork.org/scripts/424466-quizrp-library-user/code/quizrp-library-user.js
/* globals View */
// @require https://greasyfork.org/scripts/424467-quizrp-library-view/code/quizrp-library-view.js
// @license      MIT
// ==/UserScript==

/** @class */
class Quiz {
  /** @type {Number} */
  sn;
  /** @type {String} */
  question;
  /** @type {Array<String>} */
  options;
  /** @type {String} */
  author;
  /** @type {Number} */
  answer;
  /** @type {Number} */
  bsn;
  /** @type {Boolean} */
  answered = false;

  constructor() {
    let qabox = document.querySelector(".BH-qabox1");
    this.sn = qabox.getAttribute("data-quiz-sn");
    this.question = encodeURIComponent(qabox.innerText.split("\n").shift());
    this.options = Array.from(qabox.querySelectorAll("li a")).map(element => encodeURIComponent(element.innerText));
    this.author = new URL("https://" + qabox.querySelector("span>a").getAttribute("href")).pathname.split("/").pop();
    this.bsn = new URL(location.href).searchParams.get("bsn");
  }

  /**
   * try and submit answer to database
   * @param {User} user user to get CSRFToken
   * @param {View} view 
   * @param {Number|null} answer if provided, will test answer correctness
   */
  async submitAnswer(user, view, answer = undefined) {
    let token = await user.getCSRFToken();
    if (!answer || !(await this.attemptAnswer(answer, token, view)))
      answer = await this.getAnswer(token);

    let response = await Database.submit(this, answer, true);
    view.setSubmitResult(response);
  }

  /**
   * Try answer correctness and return correct answer
   * @param {String} token CSRFToken
   * @param {Number} tryAnswer answer index to try submit
   */
  async getAnswer(token, tryAnswer = 1) {
    if (tryAnswer > 4) return Promise.reject();
    const correctness = await this.attemptAnswer(tryAnswer, token);
    if (correctness) {
      this.answer = tryAnswer;
      return tryAnswer;
    }
    return await this.getAnswer(token, ++tryAnswer);
  }

  /**
   * Submit quiz answer to Bahamut
   * @param {Number} answer answer number, valid from 1 to 4
   * @param {String} token CSRFToken
   * @param {View} view if provided, will update response into view
   */
  async attemptAnswer(answer, token, view = undefined) {
    const data = new URLSearchParams({ sn: this.sn, o: answer, token: token });
    const response = await fetch(`/ajax/quiz_answer.php?${data.toString()}`).then(response => response.text());
    if (view)
      view.setResponse(response);
    return response.includes("答對");
  }

  toString() {
    let data = { sn: this.sn, question: this.question, options: this.options, author: this.author, answer: this.answer, bsn: this.bsn };
    return JSON.stringify(data);
  }
}
