
export default async function handler(req, res) {
  const HA_URL = "https://uxphxdnksb1vpwehpovjgga7ydmldnhv.ui.nabu.casa";
  const TOKEN = process.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI4OTJiN2ZmMjYwYzM0ZDY0YTU1MGEzYzk3NjA4YmRhYSIsImlhdCI6MTc3MzI1NTU1NiwiZXhwIjoyMDg4NjE1NTU2fQ.zJJPxQAlB9rliDdDcttRkeOLtRysFtxCInvT5ralqnE; // usa env

  try {
    // 1. Obtener el grupo
    const groupRes = await fetch(`${HA_URL}/api/states/light.luces_group`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    const groupData = await groupRes.json();
    const luces = groupData.attributes.entity_id || [];

    // 2. Obtener estado de cada luz
    const resultados = await Promise.all(
      luces.map(async (luz) => {
        const r = await fetch(`${HA_URL}/api/states/${luz}`, {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        });

        const d = await r.json();

        return {
          id: luz,
          estado: d?.state || "unknown",
        };
      })
    );

    // 3. Contar
    const encendidas = resultados.filter(l => l.estado === "on");

    res.status(200).json({
      total: luces.length,
      encendidas: encendidas.length,
      apagadas: luces.length - encendidas.length,
      luces: resultados,
    });

  } catch (error) {
    res.status(500).json({
      error: "Error consultando Home Assistant",
      detalle: error.message,
    });
  }
}
