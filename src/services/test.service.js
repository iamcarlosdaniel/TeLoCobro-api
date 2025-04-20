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

  async getIpInfo(ip) {
    console.log("IP:", ip);
    const response = await fetch(`https://ipapi.co/${ip}/json/`);

    if (!response.ok) {
      throw new Error(`Fallo al obtener info de IP: ${response.status}`);
    }

    const data = await response.json();
    return data;
  }
}

export default new TestService();
