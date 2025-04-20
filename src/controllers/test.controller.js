import testService from "../services/test.service.js";

class TestController {
  async readCSV(req, res) {
    try {
      if (!req.file) {
        return res.status(400).send("No se ha subido ningún archivo.");
      }

      const csvContent = await testService.readCSV(req.file.buffer);

      res.json({ content: csvContent });
    } catch (error) {
      console.error("Error reading CSV file:", error);
      res.status(500).json({ error: "Error processing CSV file" });
    }
  }

  async getIpInfo(req, res) {
    try {
      const ip = req.ip || req.connection.remoteAddress;
      const ipInfo = await testService.getIpInfo(ip);

      res.json({ ip: ip, info: ipInfo });
    } catch (error) {
      console.error("Error getting IP info:", error);
      res.status(500).json({ error: "Error getting IP info" });
    }
  }
}

export default new TestController();
