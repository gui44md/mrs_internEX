import { jsPDF } from 'jspdf'
import { attentionReasons } from '../data/substations'

const NAVY = [0, 53, 91]
const TANGERINE = [255, 207, 0]
const CRITICAL = [200, 40, 40]
const WARNING = [153, 110, 0]
const OK = [30, 120, 75]
const MUTED = [90, 100, 110]

const STATUS_COLOR = {
  Crítico: CRITICAL,
  Atenção: WARNING,
  Operacional: OK,
}

export function exportAttentionReportPdf(substations) {
  const ranked = [...substations]
    .filter((s) => s.status !== 'Manutenção')
    .sort((a, b) => b.score - a.score)

  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const marginX = 40
  let y = 0

  doc.setFillColor(...NAVY)
  doc.rect(0, 0, pageWidth, 70, 'F')
  doc.setTextColor(...TANGERINE)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.text('MRS · Central de Monitoramento de Ativos', marginX, 30)
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text('Relatório — ativos que precisam de atenção', marginX, 48)
  doc.setFontSize(9)
  doc.setTextColor(220, 220, 220)
  doc.text(
    `Gerado em ${new Date().toLocaleString('pt-BR')}`,
    pageWidth - marginX,
    48,
    { align: 'right' },
  )

  y = 95

  const criticalCount = ranked.filter((s) => s.status === 'Crítico').length
  const attentionCount = ranked.filter((s) => s.status === 'Atenção').length
  doc.setTextColor(30, 30, 30)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.text(
    `${criticalCount} ativo(s) crítico(s) · ${attentionCount} em atenção · ${ranked.length} avaliados`,
    marginX,
    y,
  )
  y += 20

  const colX = { rank: marginX, asset: marginX + 30, status: 300, score: 370, reasons: 420 }
  const rowHeight = 34
  const bottomLimit = doc.internal.pageSize.getHeight() - 50

  function drawTableHeader() {
    doc.setFillColor(240, 240, 240)
    doc.rect(marginX, y - 12, pageWidth - marginX * 2, 20, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8.5)
    doc.setTextColor(...MUTED)
    doc.text('#', colX.rank + 4, y + 2)
    doc.text('ATIVO', colX.asset, y + 2)
    doc.text('STATUS', colX.status, y + 2)
    doc.text('SCORE', colX.score, y + 2)
    doc.text('MOTIVOS', colX.reasons, y + 2)
    y += 20
  }

  drawTableHeader()

  ranked.forEach((se, i) => {
    if (y + rowHeight > bottomLimit) {
      doc.addPage()
      y = 50
      drawTableHeader()
    }

    const reasons = attentionReasons(se).join('  ·  ')
    const reasonLines = doc.splitTextToSize(reasons, pageWidth - marginX - colX.reasons)

    doc.setDrawColor(230, 230, 230)
    doc.line(marginX, y - 8, pageWidth - marginX, y - 8)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(120, 120, 120)
    doc.text(String(i + 1), colX.rank + 4, y + 2)

    doc.setFont('helvetica', 'bold')
    doc.setTextColor(20, 20, 20)
    doc.text(se.name, colX.asset, y + 2)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    doc.setTextColor(...MUTED)
    doc.text(`${se.id} · ${se.uf}`, colX.asset, y + 12)

    const statusColor = STATUS_COLOR[se.status] || MUTED
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(...statusColor)
    doc.text(se.status.toUpperCase(), colX.status, y + 2)

    doc.setTextColor(20, 20, 20)
    doc.text(String(se.score), colX.score, y + 2)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(70, 70, 70)
    doc.text(reasonLines, colX.reasons, y + 2)

    y += Math.max(rowHeight, reasonLines.length * 10 + 14)
  })

  doc.save(`mrs-ranking-atencao-${new Date().toISOString().slice(0, 10)}.pdf`)
}