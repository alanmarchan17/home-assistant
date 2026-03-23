export default async function handler(req, res) {
  const HA_URL = "https://uxphxdnksb1vpwehpovjgga7ydmldnhv.ui.nabu.casa";
  const TOKEN = process.env.HA_TOKEN; // 👈 IMPORTANTE
  try {
    // Validar token
    if (!TOKEN) {
      return res.status(500).json({ error: "Falta configurar HA_TOKEN en Vercel" });
    }

    // 1. Obtener grupo
    const groupRes = await fetch(`${HA_URL}/api/states/light.luces_group`, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    if (!groupRes.ok) {
      const text = await groupRes.text();
      return res.status(500).json({
        error: "Error consultando el grupo",
        status: groupRes.status,
        detalle: text,
      });
    }

    const groupData = await groupRes.json();
    const luces = groupData?.attributes?.entity_id || [];

    // 2. Obtener estado de cada luz
    const resultados = await Promise.all(
      luces.map(async (luz) => {
        try {
          const r = await fetch(`${HA_URL}/api/states/${luz}`, {
            headers: {
              Authorization: `Bearer ${TOKEN}`,
            },
          });

          if (!r.ok) {
            return { id: luz, estado: "error" };
          }

          const d = await r.json();

          return {
            id: luz,
            estado: d?.state || "unknown",
          };
        } catch {
          return { id: luz, estado: "error" };
        }
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
      error: "Error general",
      detalle: error.message,
    });
  }
}
