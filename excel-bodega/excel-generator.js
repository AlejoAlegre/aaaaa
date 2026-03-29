const ExcelJS = require('exceljs');

// Color palette
const COLORS = {
  primary: '1F3864',
  secondary: '2E75B6',
  accent: 'C9D6EA',
  lightBlue: 'D6E4F0',
  header: '1F3864',
  success: '70AD47',
  warning: 'FFC000',
  danger: 'FF0000',
  white: 'FFFFFF',
  lightGray: 'F2F2F2',
  darkGray: '595959',
};

function styleHeader(cell, bgColor = COLORS.header) {
  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
  cell.font = { bold: true, color: { argb: COLORS.white }, size: 11 };
  cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  cell.border = {
    top: { style: 'thin', color: { argb: COLORS.white } },
    left: { style: 'thin', color: { argb: COLORS.white } },
    bottom: { style: 'thin', color: { argb: COLORS.white } },
    right: { style: 'thin', color: { argb: COLORS.white } },
  };
}

function styleDataCell(cell, bgColor = COLORS.white) {
  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
  cell.alignment = { vertical: 'middle', wrapText: true };
  cell.border = {
    top: { style: 'thin', color: { argb: 'CCCCCC' } },
    left: { style: 'thin', color: { argb: 'CCCCCC' } },
    bottom: { style: 'thin', color: { argb: 'CCCCCC' } },
    right: { style: 'thin', color: { argb: 'CCCCCC' } },
  };
}

function addSheetTitle(sheet, title, subtitle, cols) {
  sheet.mergeCells(1, 1, 1, cols);
  const titleCell = sheet.getCell('A1');
  titleCell.value = title;
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.primary } };
  titleCell.font = { bold: true, size: 16, color: { argb: COLORS.white } };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  sheet.getRow(1).height = 36;

  sheet.mergeCells(2, 1, 2, cols);
  const subCell = sheet.getCell('A2');
  subCell.value = subtitle;
  subCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.secondary } };
  subCell.font = { italic: true, size: 11, color: { argb: COLORS.white } };
  subCell.alignment = { horizontal: 'center', vertical: 'middle' };
  sheet.getRow(2).height = 22;
}

// ─── Sheet 1: Inventario ───────────────────────────────────────────────────
function buildInventario(wb, nombreBodega) {
  const ws = wb.addWorksheet('📦 Inventario', { tabColor: { argb: COLORS.secondary } });

  ws.columns = [
    { key: 'codigo', width: 14 },
    { key: 'nombre', width: 28 },
    { key: 'categoria', width: 18 },
    { key: 'proveedor', width: 22 },
    { key: 'unidad', width: 12 },
    { key: 'stock_actual', width: 14 },
    { key: 'stock_minimo', width: 14 },
    { key: 'stock_maximo', width: 14 },
    { key: 'precio_costo', width: 14 },
    { key: 'precio_venta', width: 14 },
    { key: 'estado', width: 14 },
    { key: 'ubicacion', width: 16 },
    { key: 'notas', width: 24 },
  ];

  addSheetTitle(ws, `${nombreBodega} — Inventario de Productos`, 'Actualizar stock al recibir o despachar mercadería', 13);

  const headers = ['Código', 'Nombre del Producto', 'Categoría', 'Proveedor', 'Unidad', 'Stock Actual', 'Stock Mínimo', 'Stock Máximo', 'Costo ($)', 'Precio Venta ($)', 'Estado', 'Ubicación', 'Notas'];
  const headerRow = ws.getRow(3);
  headerRow.height = 28;
  headers.forEach((h, i) => {
    const cell = headerRow.getCell(i + 1);
    cell.value = h;
    styleHeader(cell);
  });

  // Sample products
  const sampleData = [
    ['VT-001', 'Malbec Reserva 750ml', 'Vinos Tintos', 'Bodega Sur', 'Botella', 48, 12, 120, 850, 1500, null, 'Estante A1', ''],
    ['VT-002', 'Cabernet Sauvignon 750ml', 'Vinos Tintos', 'Viñedos Norte', 'Botella', 6, 12, 100, 920, 1700, null, 'Estante A2', 'Stock bajo'],
    ['VB-001', 'Chardonnay 750ml', 'Vinos Blancos', 'Finca El Sol', 'Botella', 30, 10, 80, 780, 1400, null, 'Estante B1', ''],
    ['CE-001', 'Cerveza Artesanal IPA 1L', 'Cervezas', 'Brewery Local', 'Litro', 60, 24, 200, 210, 450, null, 'Heladera C1', ''],
    ['SP-001', 'Espumante Brut 750ml', 'Espumantes', 'Chandon', 'Botella', 24, 6, 60, 1200, 2200, null, 'Estante D1', ''],
    ['WH-001', 'Whisky Single Malt 700ml', 'Destilados', 'Importadora Premium', 'Botella', 15, 3, 30, 3500, 6500, null, 'Vitrina E1', ''],
    ['GN-001', 'Gin London Dry 750ml', 'Destilados', 'Importadora Premium', 'Botella', 20, 6, 40, 1800, 3200, null, 'Vitrina E2', ''],
    ['IN-001', 'Vasos de Plástico x100', 'Insumos', 'Distribuidora ABC', 'Pack', 8, 5, 30, 180, 320, null, 'Depósito F1', ''],
  ];

  sampleData.forEach((row, idx) => {
    const r = ws.getRow(idx + 4);
    r.height = 22;
    const bg = idx % 2 === 0 ? COLORS.white : COLORS.lightGray;

    row.forEach((val, ci) => {
      const cell = r.getCell(ci + 1);
      if (ci === 10) {
        // Estado: formula
        cell.value = { formula: `IF(F${idx + 4}<G${idx + 4},"⚠️ BAJO",IF(F${idx + 4}>=H${idx + 4},"✅ LLENO","✅ OK"))` };
        cell.font = { bold: true };
      } else {
        cell.value = val;
      }
      styleDataCell(cell, bg);
      if (ci >= 8 && ci <= 9) {
        cell.numFmt = '"$"#,##0.00';
      }
    });
  });

  // Add validation for Categoria
  const categorias = ['Vinos Tintos', 'Vinos Blancos', 'Vinos Rosados', 'Espumantes', 'Cervezas', 'Destilados', 'Insumos', 'Otros'];
  ws.getColumn('C').eachCell({ includeEmpty: false }, (cell, rowNum) => {
    if (rowNum > 3) {
      cell.dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: [`"${categorias.join(',')}"`],
      };
    }
  });

  ws.views = [{ state: 'frozen', xSplit: 0, ySplit: 3 }];
  ws.autoFilter = { from: 'A3', to: 'M3' };
}

// ─── Sheet 2: Movimientos ──────────────────────────────────────────────────
function buildMovimientos(wb) {
  const ws = wb.addWorksheet('🔄 Movimientos', { tabColor: { argb: '70AD47' } });

  ws.columns = [
    { key: 'fecha', width: 14 },
    { key: 'hora', width: 10 },
    { key: 'tipo', width: 12 },
    { key: 'codigo', width: 14 },
    { key: 'producto', width: 28 },
    { key: 'cantidad', width: 12 },
    { key: 'unidad', width: 12 },
    { key: 'precio_unit', width: 14 },
    { key: 'total', width: 14 },
    { key: 'motivo', width: 22 },
    { key: 'referencia', width: 18 },
    { key: 'responsable', width: 18 },
    { key: 'notas', width: 24 },
  ];

  addSheetTitle(ws, 'Registro de Movimientos de Stock', 'Registrar cada entrada y salida de productos', 13);

  const headers = ['Fecha', 'Hora', 'Tipo', 'Código', 'Producto', 'Cantidad', 'Unidad', 'Precio Unit.', 'Total', 'Motivo', 'N° Referencia', 'Responsable', 'Notas'];
  const headerRow = ws.getRow(3);
  headerRow.height = 28;
  headers.forEach((h, i) => {
    const cell = headerRow.getCell(i + 1);
    cell.value = h;
    styleHeader(cell, COLORS.success);
  });

  const tipos = ['ENTRADA', 'SALIDA', 'AJUSTE', 'DEVOLUCION', 'TRANSFERENCIA'];
  const motivos = ['Compra a proveedor', 'Venta al cliente', 'Consumo interno', 'Merma/Pérdida', 'Devolución proveedor', 'Ajuste inventario', 'Transferencia'];

  const sampleMov = [
    ['2026-03-25', '09:30', 'ENTRADA', 'VT-001', 'Malbec Reserva 750ml', 24, 'Botella', 850, null, 'Compra a proveedor', 'FAC-00123', 'María García', ''],
    ['2026-03-26', '14:15', 'SALIDA', 'VT-002', 'Cabernet Sauvignon 750ml', 6, 'Botella', 1700, null, 'Venta al cliente', 'VTA-00456', 'Juan Pérez', 'Cliente mayorista'],
    ['2026-03-27', '11:00', 'ENTRADA', 'CE-001', 'Cerveza Artesanal IPA 1L', 48, 'Litro', 210, null, 'Compra a proveedor', 'FAC-00124', 'María García', ''],
    ['2026-03-28', '10:30', 'SALIDA', 'SP-001', 'Espumante Brut 750ml', 3, 'Botella', 2200, null, 'Venta al cliente', 'VTA-00457', 'Juan Pérez', ''],
  ];

  sampleMov.forEach((row, idx) => {
    const r = ws.getRow(idx + 4);
    r.height = 22;
    const bg = idx % 2 === 0 ? COLORS.white : COLORS.lightGray;
    row.forEach((val, ci) => {
      const cell = r.getCell(ci + 1);
      if (ci === 8) {
        cell.value = { formula: `F${idx + 4}*H${idx + 4}` };
        cell.numFmt = '"$"#,##0.00';
      } else {
        cell.value = val;
      }
      styleDataCell(cell, bg);
      if (ci === 7) cell.numFmt = '"$"#,##0.00';
    });

    // Color entrada vs salida
    const tipoCell = r.getCell(3);
    if (row[2] === 'ENTRADA') {
      tipoCell.font = { bold: true, color: { argb: '375623' } };
      tipoCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E2EFDA' } };
    } else if (row[2] === 'SALIDA') {
      tipoCell.font = { bold: true, color: { argb: '843C0C' } };
      tipoCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FCE4D6' } };
    }
  });

  // Dropdowns
  for (let r = 4; r <= 200; r++) {
    ws.getCell(`C${r}`).dataValidation = { type: 'list', allowBlank: true, formulae: [`"${tipos.join(',')}"`] };
    ws.getCell(`J${r}`).dataValidation = { type: 'list', allowBlank: true, formulae: [`"${motivos.join(',')}"`] };
    ws.getCell(`A${r}`).numFmt = 'yyyy-mm-dd';
  }

  ws.views = [{ state: 'frozen', xSplit: 0, ySplit: 3 }];
  ws.autoFilter = { from: 'A3', to: 'M3' };
}

// ─── Sheet 3: Ventas ───────────────────────────────────────────────────────
function buildVentas(wb) {
  const ws = wb.addWorksheet('💰 Ventas', { tabColor: { argb: 'FFC000' } });

  ws.columns = [
    { key: 'fecha', width: 14 },
    { key: 'nro_venta', width: 14 },
    { key: 'cliente', width: 24 },
    { key: 'tipo_cliente', width: 16 },
    { key: 'codigo', width: 14 },
    { key: 'producto', width: 28 },
    { key: 'cantidad', width: 12 },
    { key: 'precio_unit', width: 14 },
    { key: 'descuento', width: 12 },
    { key: 'subtotal', width: 14 },
    { key: 'forma_pago', width: 16 },
    { key: 'vendedor', width: 18 },
    { key: 'estado', width: 14 },
  ];

  addSheetTitle(ws, 'Registro de Ventas', 'Registrar cada venta realizada', 13);

  const headers = ['Fecha', 'N° Venta', 'Cliente', 'Tipo Cliente', 'Código', 'Producto', 'Cantidad', 'Precio Unit.', 'Descuento %', 'Subtotal', 'Forma de Pago', 'Vendedor', 'Estado'];
  const headerRow = ws.getRow(3);
  headerRow.height = 28;
  headers.forEach((h, i) => {
    const cell = headerRow.getCell(i + 1);
    cell.value = h;
    styleHeader(cell, 'B8860B');
  });

  const sampleVentas = [
    ['2026-03-26', 'VTA-00456', 'Restaurant El Gaucho', 'Mayorista', 'VT-002', 'Cabernet Sauvignon 750ml', 6, 1700, 10, null, 'Transferencia', 'Juan Pérez', 'Cobrada'],
    ['2026-03-28', 'VTA-00457', 'Cliente Mostrador', 'Minorista', 'SP-001', 'Espumante Brut 750ml', 3, 2200, 0, null, 'Efectivo', 'Juan Pérez', 'Cobrada'],
    ['2026-03-28', 'VTA-00458', 'Bar La Esquina', 'Mayorista', 'CE-001', 'Cerveza Artesanal IPA 1L', 12, 450, 5, null, 'Tarjeta', 'María García', 'Pendiente'],
  ];

  sampleVentas.forEach((row, idx) => {
    const r = ws.getRow(idx + 4);
    r.height = 22;
    const bg = idx % 2 === 0 ? COLORS.white : COLORS.lightGray;
    row.forEach((val, ci) => {
      const cell = r.getCell(ci + 1);
      if (ci === 9) {
        cell.value = { formula: `G${idx + 4}*H${idx + 4}*(1-I${idx + 4}/100)` };
        cell.numFmt = '"$"#,##0.00';
      } else {
        cell.value = val;
      }
      styleDataCell(cell, bg);
      if (ci === 7) cell.numFmt = '"$"#,##0.00';
      if (ci === 8) cell.numFmt = '0"%"';
    });
  });

  for (let r = 4; r <= 500; r++) {
    ws.getCell(`A${r}`).numFmt = 'yyyy-mm-dd';
    ws.getCell(`D${r}`).dataValidation = { type: 'list', allowBlank: true, formulae: ['"Minorista,Mayorista,Distribuidor,Interno"'] };
    ws.getCell(`K${r}`).dataValidation = { type: 'list', allowBlank: true, formulae: ['"Efectivo,Tarjeta,Transferencia,Cheque,Cuenta Corriente"'] };
    ws.getCell(`M${r}`).dataValidation = { type: 'list', allowBlank: true, formulae: ['"Cobrada,Pendiente,Cancelada"'] };
  }

  ws.views = [{ state: 'frozen', xSplit: 0, ySplit: 3 }];
  ws.autoFilter = { from: 'A3', to: 'M3' };
}

// ─── Sheet 4: Proveedores ──────────────────────────────────────────────────
function buildProveedores(wb) {
  const ws = wb.addWorksheet('🏭 Proveedores', { tabColor: { argb: '7030A0' } });

  ws.columns = [
    { key: 'codigo', width: 12 },
    { key: 'nombre', width: 28 },
    { key: 'contacto', width: 22 },
    { key: 'telefono', width: 16 },
    { key: 'email', width: 26 },
    { key: 'direccion', width: 30 },
    { key: 'cuit', width: 16 },
    { key: 'categoria', width: 18 },
    { key: 'dias_entrega', width: 14 },
    { key: 'condicion_pago', width: 18 },
    { key: 'activo', width: 10 },
    { key: 'notas', width: 28 },
  ];

  addSheetTitle(ws, 'Directorio de Proveedores', 'Lista completa de proveedores y datos de contacto', 12);

  const headers = ['Código', 'Nombre / Razón Social', 'Contacto', 'Teléfono', 'Email', 'Dirección', 'CUIT', 'Categoría', 'Días Entrega', 'Condición Pago', 'Activo', 'Notas'];
  const headerRow = ws.getRow(3);
  headerRow.height = 28;
  headers.forEach((h, i) => {
    const cell = headerRow.getCell(i + 1);
    cell.value = h;
    styleHeader(cell, '7030A0');
  });

  const sampleProv = [
    ['PROV-001', 'Bodega Sur S.A.', 'Carlos Romero', '+54 11 4000-1234', 'ventas@bodegasur.com', 'Ruta 7 Km 42, Mendoza', '30-12345678-9', 'Vinos', 7, '30 días', 'SI', ''],
    ['PROV-002', 'Viñedos Norte SRL', 'Ana Martínez', '+54 261 400-5678', 'comercial@vinedos.com', 'Av. San Martín 1200, Luján', '30-98765432-1', 'Vinos', 10, 'Contado', 'SI', 'Proveedor principal'],
    ['PROV-003', 'Brewery Local S.A.', 'Roberto Silva', '+54 11 3000-9012', 'info@brewerylocal.com', 'Calle 50 N°230, CABA', '30-11223344-5', 'Cervezas', 3, '15 días', 'SI', ''],
    ['PROV-004', 'Importadora Premium', 'Laura Gómez', '+54 11 5000-3456', 'lgomez@impremium.com', 'Paraguay 1500, CABA', '30-55667788-9', 'Destilados', 14, '30 días', 'SI', 'Importados'],
    ['PROV-005', 'Distribuidora ABC', 'Miguel Torres', '+54 11 2000-7890', 'ventas@distABC.com', 'Rivadavia 800, Córdoba', '30-99887766-3', 'Insumos', 5, 'Contado', 'SI', ''],
  ];

  sampleProv.forEach((row, idx) => {
    const r = ws.getRow(idx + 4);
    r.height = 22;
    const bg = idx % 2 === 0 ? COLORS.white : COLORS.lightGray;
    row.forEach((val, ci) => {
      const cell = r.getCell(ci + 1);
      cell.value = val;
      styleDataCell(cell, bg);
      if (ci === 4) cell.font = { color: { argb: '0563C1' }, underline: true };
    });
  });

  ws.views = [{ state: 'frozen', xSplit: 0, ySplit: 3 }];
  ws.autoFilter = { from: 'A3', to: 'L3' };
}

// ─── Sheet 5: Dashboard / Resumen ─────────────────────────────────────────
function buildDashboard(wb, nombreBodega) {
  const ws = wb.addWorksheet('📊 Dashboard', { tabColor: { argb: 'C00000' } });

  ws.columns = [
    { key: 'a', width: 30 },
    { key: 'b', width: 20 },
    { key: 'c', width: 20 },
    { key: 'd', width: 20 },
    { key: 'e', width: 20 },
  ];

  // Title
  ws.mergeCells('A1:E1');
  const t = ws.getCell('A1');
  t.value = `📊 Dashboard — ${nombreBodega}`;
  t.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.primary } };
  t.font = { bold: true, size: 18, color: { argb: COLORS.white } };
  t.alignment = { horizontal: 'center', vertical: 'middle' };
  ws.getRow(1).height = 44;

  ws.mergeCells('A2:E2');
  const sub = ws.getCell('A2');
  sub.value = `Generado: ${new Date().toLocaleDateString('es-AR')}  |  Resumen automático basado en las hojas de datos`;
  sub.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.secondary } };
  sub.font = { italic: true, size: 10, color: { argb: COLORS.white } };
  sub.alignment = { horizontal: 'center', vertical: 'middle' };
  ws.getRow(2).height = 18;

  // KPI section title
  ws.mergeCells('A4:E4');
  const kpiTitle = ws.getCell('A4');
  kpiTitle.value = '🔢 INDICADORES CLAVE';
  kpiTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.secondary } };
  kpiTitle.font = { bold: true, size: 13, color: { argb: COLORS.white } };
  kpiTitle.alignment = { horizontal: 'center', vertical: 'middle' };
  ws.getRow(4).height = 26;

  // KPI Cards
  const kpis = [
    { label: 'Total Productos en Inventario', formula: `COUNTA('📦 Inventario'!A4:A1000)`, format: null, color: COLORS.lightBlue },
    { label: 'Productos con Stock BAJO', formula: `COUNTIF('📦 Inventario'!K4:K1000,"*BAJO*")`, format: null, color: 'FCE4D6' },
    { label: 'Valor Total del Inventario', formula: `SUMPRODUCT(('📦 Inventario'!F4:F1000)*('📦 Inventario'!I4:I1000))`, format: '"$"#,##0.00', color: 'E2EFDA' },
    { label: 'Total Ventas del Mes', formula: `SUMIF('💰 Ventas'!M4:M500,"Cobrada",'💰 Ventas'!J4:J500)`, format: '"$"#,##0.00', color: 'FFF2CC' },
    { label: 'Cantidad de Ventas Cobradas', formula: `COUNTIF('💰 Ventas'!M4:M500,"Cobrada")`, format: null, color: COLORS.lightGray },
    { label: 'Ventas Pendientes de Cobro', formula: `SUMIF('💰 Ventas'!M4:M500,"Pendiente",'💰 Ventas'!J4:J500)`, format: '"$"#,##0.00', color: 'FCE4D6' },
    { label: 'Total Entradas de Stock', formula: `SUMIF('🔄 Movimientos'!C4:C1000,"ENTRADA",'🔄 Movimientos'!F4:F1000)`, format: null, color: 'E2EFDA' },
    { label: 'Total Salidas de Stock', formula: `SUMIF('🔄 Movimientos'!C4:C1000,"SALIDA",'🔄 Movimientos'!F4:F1000)`, format: null, color: 'FCE4D6' },
  ];

  kpis.forEach((kpi, idx) => {
    const row = 5 + idx * 2;
    ws.getRow(row).height = 22;
    ws.getRow(row + 1).height = 10;

    ws.mergeCells(row, 1, row, 3);
    const labelCell = ws.getCell(row, 1);
    labelCell.value = kpi.label;
    labelCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: kpi.color } };
    labelCell.font = { size: 11, bold: false };
    labelCell.alignment = { vertical: 'middle' };
    labelCell.border = { top: { style: 'thin', color: { argb: 'CCCCCC' } }, left: { style: 'thin', color: { argb: 'CCCCCC' } }, bottom: { style: 'thin', color: { argb: 'CCCCCC' } }, right: { style: 'thin', color: { argb: 'CCCCCC' } } };

    ws.mergeCells(row, 4, row, 5);
    const valCell = ws.getCell(row, 4);
    valCell.value = { formula: kpi.formula };
    if (kpi.format) valCell.numFmt = kpi.format;
    valCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: kpi.color } };
    valCell.font = { bold: true, size: 13, color: { argb: COLORS.primary } };
    valCell.alignment = { horizontal: 'right', vertical: 'middle' };
    valCell.border = { top: { style: 'thin', color: { argb: 'CCCCCC' } }, left: { style: 'thin', color: { argb: 'CCCCCC' } }, bottom: { style: 'thin', color: { argb: 'CCCCCC' } }, right: { style: 'thin', color: { argb: 'CCCCCC' } } };
  });

  // Instrucciones de uso
  const instrRow = 5 + kpis.length * 2 + 2;
  ws.mergeCells(instrRow, 1, instrRow, 5);
  const instrTitle = ws.getCell(instrRow, 1);
  instrTitle.value = '📋 INSTRUCCIONES DE USO';
  instrTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.secondary } };
  instrTitle.font = { bold: true, size: 13, color: { argb: COLORS.white } };
  instrTitle.alignment = { horizontal: 'center', vertical: 'middle' };
  ws.getRow(instrRow).height = 26;

  const instrucciones = [
    ['📦 Inventario', 'Mantené actualizado el stock de cada producto. Los colores indican si el stock es bajo (⚠️) o normal (✅).'],
    ['🔄 Movimientos', 'Registrá cada vez que entra o sale mercadería. Elegí el tipo (ENTRADA/SALIDA) del menú desplegable.'],
    ['💰 Ventas', 'Anotá cada venta: cliente, producto, cantidad y precio. El subtotal se calcula automáticamente.'],
    ['🏭 Proveedores', 'Completá los datos de cada proveedor para tener toda la información a mano.'],
    ['📊 Dashboard', 'Este panel se actualiza automáticamente. No requiere ninguna acción manual.'],
  ];

  instrucciones.forEach((instr, idx) => {
    const r = instrRow + 1 + idx;
    ws.getRow(r).height = 22;

    const cellA = ws.getCell(r, 1);
    cellA.value = instr[0];
    cellA.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.accent } };
    cellA.font = { bold: true, size: 11, color: { argb: COLORS.primary } };
    cellA.alignment = { vertical: 'middle' };
    cellA.border = { top: { style: 'thin', color: { argb: 'CCCCCC' } }, left: { style: 'thin', color: { argb: 'CCCCCC' } }, bottom: { style: 'thin', color: { argb: 'CCCCCC' } }, right: { style: 'thin', color: { argb: 'CCCCCC' } } };

    ws.mergeCells(r, 2, r, 5);
    const cellB = ws.getCell(r, 2);
    cellB.value = instr[1];
    cellB.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.white } };
    cellB.alignment = { vertical: 'middle', wrapText: true };
    cellB.border = { top: { style: 'thin', color: { argb: 'CCCCCC' } }, left: { style: 'thin', color: { argb: 'CCCCCC' } }, bottom: { style: 'thin', color: { argb: 'CCCCCC' } }, right: { style: 'thin', color: { argb: 'CCCCCC' } } };
  });
}

// ─── Main generator ────────────────────────────────────────────────────────
async function generateBodegaExcel(nombreBodega = 'Mi Bodega') {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'Sistema Bodega Automatizado';
  wb.created = new Date();
  wb.modified = new Date();
  wb.properties.date1904 = false;

  buildDashboard(wb, nombreBodega);
  buildInventario(wb, nombreBodega);
  buildMovimientos(wb);
  buildVentas(wb);
  buildProveedores(wb);

  return wb;
}

module.exports = { generateBodegaExcel };
