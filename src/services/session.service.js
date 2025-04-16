import Session from "../database/models/session.model.js";

class SessionService {
  async getAllMySessions() {
    try {
    } catch (error) {
      throw {
        message: error.userErrorMessage,
      };
    }
  }

  async signOutOthersSessions(userId, sessionId) {
    try {
    } catch (error) {
      throw {
        message: error.userErrorMessage,
      };
    }
  }
}

export default new SessionService();
