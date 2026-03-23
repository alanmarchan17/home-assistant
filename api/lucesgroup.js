export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const HA_URL = "https://uxphxdnksb1vpwehpovjgga7ydmldnhv.ui.nabu.casa";
  const TOKEN = process.env.HA_TOKEN;

  try {
    if (!TOKEN) {
      return res.status(500).json({ error: "Falta configurar HA_TOKEN en Vercel" });
    }

    const groupRes = await fetch(`${HA_URL}/api/states/light.luces_group`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });

    if (!groupRes.ok) {
      return res.status(500).json({ error: "Error consultando el grupo" });
    }

    const groupData = await groupRes.json();
    const luces = groupData?.attributes?.entity_id || [];

    const statesRes = await fetch(`${HA_URL}/api/states`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });

    const allStates = await statesRes.json();

    const encendidas = luces
      .map((luz) => {
        const estado = allStates.find(e => e.entity_id === luz);
        return {
          id: luz,
          estado: estado?.state || "unknown",
        };
      })
      .filter(l => l.estado === "on");

    res.status(200).json({
      total_encendidas: encendidas.length,
      luces: encendidas,
    });

  } catch (error) {
    res.status(500).json({
      error: "Error general",
      detalle: error.message,
    });
  }
}
