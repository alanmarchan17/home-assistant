
  
export default async function handler(req, res) {
  try {
    const response = await fetch(
      "https://uxphxdnksb1vpwehpovjgga7ydmldnhv.ui.nabu.casa/api/states/sensor.contador_de_luces_prendidas",
      {
        headers: {
          Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI4OTJiN2ZmMjYwYzM0ZDY0YTU1MGEzYzk3NjA4YmRhYSIsImlhdCI6MTc3MzI1NTU1NiwiZXhwIjoyMDg4NjE1NTU2fQ.zJJPxQAlB9rliDdDcttRkeOLtRysFtxCInvT5ralqnE"
        }
      }
    );

    const data = await response.json();

    res.status(200).send(data.state);

  } catch (error) {
    res.status(500).send("error");
  }
}
