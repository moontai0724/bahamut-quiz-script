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
