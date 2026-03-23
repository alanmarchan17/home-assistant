export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const HA_URL = "https://uxphxdnksb1vpwehpovjgga7ydmldnhv.ui.nabu.casa";
  const TOKEN = process.env.HA_TOKEN;

  try {
    if (!TOKEN) return res.status(500).send("Falta configurar HA_TOKEN en Vercel");

    const groupRes = await fetch(`${HA_URL}/api/states/light.luces_group`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    if (!groupRes.ok) return res.status(500).send("Error consultando el grupo");

    const groupData = await groupRes.json();
    const luces = groupData?.attributes?.entity_id || [];

    const statesRes = await fetch(`${HA_URL}/api/states`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    const allStates = await statesRes.json();

    const encendidas = luces
      .map(luz => {
        const estado = allStates.find(e => e.entity_id === luz);
        return { id: luz.replace("light.", "").replace(/_/g, " "), estado: (estado?.state || "unknown").toUpperCase() };
      })
      .filter(l => l.estado === "ON");

    const lista = encendidas.map(l => `💡 ${l.id}: ${l.estado}`).join("\n");

    res.status(200).send(lista || "No hay luces encendidas");
  } catch (error) {
    res.status(500).send("Error general: " + error.message);
  }
}
