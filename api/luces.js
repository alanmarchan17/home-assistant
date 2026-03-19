export default async function handler(req, res) {
  // 🔥 CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  try {
    const response = await fetch(
      "https://uxphxdnksb1vpwehpovjgga7ydmldnhv.ui.nabu.casa/api/states/sensor.contador_de_luces_prendidas",
      {
        headers: {
          Authorization: "Bearer TU_TOKEN_AQUI"
        }
      }
    );

    const data = await response.json();

    res.status(200).send(data.state);

  } catch (error) {
    res.status(500).send("error");
  }
}
