// ==UserScript==
// @name         quizrp-library-user
// @namespace    https://home.gamer.com.tw/moontai0724
// @version      5.0.0
// @description  a library for quizrp project
// @author       moontai0724
// @match        https://forum.gamer.com.tw/B.php*
// @supportURL   https://home.gamer.com.tw/creationDetail.php?sn=3924920
// @grant        none
// @license      MIT
// ==/UserScript==

/** @class */
class User {
  /** @type {String|undefined} */
  id;

  constructor() {
    this.initializeId();
  }

  initializeId() {
    try {
      this.id = BAHAID;
    } catch (error) {
      let cookie = document.cookie.split("; ").filter(cookie => cookie.startsWith("BAHAID")).shift();
      this.id = cookie ? cookie.split("=").pop() : undefined;
    }
  }

  async getCSRFToken() {
    const response = await fetch("/ajax/getCSRFToken.php");
    return await response.text();
  }
}
