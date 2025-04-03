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
}

export default new TestController();
