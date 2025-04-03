class TestService {
  async readCSV(fileBuffer) {
    try {
      const data = fileBuffer.toString("utf8");

      console.log("Contenido del archivo CSV:");
      console.log(data);

      return data;
    } catch (error) {
      console.error("Error reading CSV file:", error);
      throw new Error("Error processing CSV file");
    }
  }
}

export default new TestService();
