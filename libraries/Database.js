/** @class */
class Database {
  /** @type {String} */
  static URL = "https://script.google.com/macros/s/AKfycbxYKwsjq6jB2Oo0xwz4bmkd3-5hdguopA6VJ5KD/exec";

  constructor() {
    throw new Error("New a Database instance is not needed.");
  }

  /**
   * Check is quiz exists in database
   * @param {Quiz} quiz 
   * @returns {Boolean}
   */
  static async exists(quiz) {
    let exists = await this.fetch("checkExisting", quiz.sn).catch(() => false);
    return exists ? true : false;
  }

  /**
   * Find answer of quiz in database
   * @param {Quiz} quiz 
   */
  static async answerOf(quiz) {
    let data = await this.fetch("answer", quiz.sn);
    return Promise.resolve(data);
  }

  /**
   * Find hint of quiz in database
   * @param {Quiz} quiz 
   */
  static async hintOf(quiz) {
    let data = await this.fetch("hint", quiz.sn);
    return Promise.resolve(data);
  }

  /**
   * Fetch (get) data from database
   * @param {String} type type of action
   * @param {Number} sn serial number of quiz
   */
  static async fetch(type, sn) {
    const data = new URLSearchParams({ type: type, sn: sn });
    const response = await fetch(`${Database.URL}?${data.toString()}`)
      .then(response => response.json());
    if (response.success)
      return Promise.resolve(response.data);

    return Promise.reject(response);
  }

  /**
   * Submit (post) data to database
   * @param {Quiz} quiz quiz infos
   * @param {Number} answer answer of quiz
   * @param {Boolean} correctness correctness of answer
   */
  static async submit(quiz, answer, correctness) {
    const data = {
      "version": GM_info.script.version,
      "sn": quiz.sn,
      "question": quiz.question,
      "options": quiz.options,
      "bsn": quiz.bsn,
      "author": quiz.author,
      "this_answered": answer,
      "correctness": correctness,
    };

    const response = await fetch(Database.URL, {
      method: "POST",
      cache: "no-cache",
      headers: {
        "content-type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  }
}
