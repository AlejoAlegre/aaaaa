async function generarExcelBodega() {
  const input = document.getElementById('bodegaName');
  const btnText = document.getElementById('btnExcelText');
  const btnLoading = document.getElementById('btnExcelLoading');
  const btn = document.getElementById('btnGenerarExcel');

  const nombreBodega = input.value.trim() || 'Mi Bodega';

  btn.disabled = true;
  btnText.style.display = 'none';
  btnLoading.style.display = 'inline';

  try {
    const response = await fetch('/api/excel/bodega', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombreBodega }),
    });

    if (!response.ok) {
      throw new Error('Error al generar el archivo');
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const disposition = response.headers.get('Content-Disposition') || '';
    const match = disposition.match(/filename="?([^"]+)"?/);
    a.download = match ? match[1] : `Bodega_${nombreBodega}.xlsx`;
    a.href = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (err) {
    alert('Hubo un error generando el Excel. Por favor intentá de nuevo.');
    console.error(err);
  } finally {
    btn.disabled = false;
    btnText.style.display = 'inline';
    btnLoading.style.display = 'none';
  }
}

// Allow Enter key in the input
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('bodegaName');
  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') generarExcelBodega();
    });
  }
});
