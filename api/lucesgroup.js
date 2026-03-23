<div id="lista-luces"></div>

<script>
async function cargar() {
  const contenedor = document.getElementById("lista-luces");

  try {
    const res = await fetch("https://project-hqt6g.vercel.app/api/lucesgroup");
    const data = await res.json();

    if (data.luces.length === 0) {
      contenedor.innerHTML = "Todo apagado 😴";
      return;
    }

    contenedor.innerHTML = "<ul>" +
      data.luces.map(l => {
        const nombre = l.id
          .replace("light.", "")
          .replaceAll("_", " ");
        return `<li>💡 ${nombre}</li>`;
      }).join("") +
      "</ul>";

  } catch (e) {
    contenedor.innerHTML = "Error cargando luces ❌";
  }
}

cargar();
setInterval(cargar, 5000);
</script>
