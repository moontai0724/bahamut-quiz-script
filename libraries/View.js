/** @class */
class View {
  /** @type {HTMLElement} */
  window;
  /** @type {HTMLElement} */
  qabox;

  /**
   * @param {User} user 
   * @param {Quiz} quiz 
   */
  constructor(user, quiz) {
    this.window = document.querySelector("#quizrp");
    this.qabox = document.querySelector(".BH-qabox1");

    this.window.querySelector(".version span").innerHTML = GM_info.script.version;
    this.initOptions(user, quiz);
    this.initAutoAnswer(user, quiz);
    this.window.querySelector(".hint button").addEventListener("click", event => this.showHint(quiz));
    this.window.querySelector(".original button").addEventListener("click", event => this.showQuiz(quiz));
  }

  /**
   * @param {User} user 
   * @param {Quiz} quiz 
   */
  initAutoAnswer(user, quiz) {
    if (GM_getValue("auto-answer", false)) {
      this.window.querySelector(".auto span").classList.add("enable");
      setTimeout(() => quiz.submitAnswer(user, this), 2000);
    }
    this.window.querySelector(".auto button").addEventListener("click", event => this.toggleAutoAnswer(user, quiz))
  }

  /**
   * @param {User} user 
   * @param {Quiz} quiz 
   */
  initOptions(user, quiz) {
    this.qabox.querySelectorAll("li a").forEach(async (element, index, array) => {
      element.removeAttribute("href");
      element.addEventListener("click", async event => quiz.submitAnswer(user, this, index + 1, true));
    });
  }

  /**
   * Toggle and trigger auto answer
   * @param {User} user 
   * @param {Quiz} quiz 
   */
  toggleAutoAnswer(user, quiz) {
    let autoAnswerStatus = this.window.querySelector(".auto span");
    autoAnswerStatus.classList.toggle("enable");

    if (!autoAnswerStatus.classList.contains("enable")) {
      GM_deleteValue("auto-answer");
      return;
    }

    GM_setValue("auto-answer", true);
    quiz.submitAnswer(user, this);
  }

  /**
   * Show quiz
   * @param {Quiz} quiz 
   */
  async showQuiz(quiz) {
    let original = this.window.querySelector(".original div");
    original.innerHTML = `題目編號：${quiz.sn}<br>原題目：${decodeURIComponent(quiz.question)}<ol><li>${quiz.options.map(decodeURIComponent).join("</li><li>")}</li></ol>`;
    original.classList.remove("hide");
    this.window.querySelector(".original button").classList.add("hide");

    let answer = await Database.answerOf(quiz).catch(err => null);
    let options = Array.from(this.window.querySelectorAll(".original li"));
    if (answer)
      options.forEach((element, index) => element.classList.add(index + 1 == answer ? "correct" : "wrong"));
  }

  /**
   * Show hint
   * @param {Quiz} quiz 
   */
  async showHint(quiz) {
    let view = this.window.querySelector(".hint span");
    let hint = await Database.hintOf(quiz).catch(err => null);
    this.window.querySelector(".hint button").classList.add("hide");
    if (!hint) {
      view.innerHTML = "題庫中無資料。";
      return;
    }
    view.innerHTML = "提示已獲取！";
    view.classList.add("success");
    this.qabox.querySelector(`li:nth-child(${hint}) a`).classList.add("wrong");
  }

  /**
   * Set response of database to view
   * @param {JSON} response 
   */
  setSubmitResult(response) {
    let messages = {
      "DATA_INVALID": "無法送出答案，請檢查是否有更新，或通知作者。",
      "DATA_APPENDED": "資料新增了！感謝提供～",
      "DATA_UPDATED": "資料更新了！感謝提供～",
      "IGNORED": "題庫中已經有資料啦～",
    };
    const statusDisplay = this.window.querySelector(".report span");
    statusDisplay.innerHTML = messages[response.message];
    if (response.success)
      statusDisplay.classList.add("success");
  }

  /**
   * Set native baha response of quiz into view
   * @param {String} html 
   */
  setResponse(html) {
    this.qabox.style["text-align"] = "center";
    this.qabox.innerHTML = html;
  }
}
