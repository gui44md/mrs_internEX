// Gerador de dados simulados da malha de subestações de tração/energia
// ao longo do corredor MG -> RJ -> SP operado pela MRS Logística.
// RNG com seed fixa para manter a demo estável entre reloads.

function mulberry32(seed) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const rng = mulberry32(19960)
const rand = (min, max) => min + rng() * (max - min)
const randInt = (min, max) => Math.round(rand(min, max))
const pick = (arr, n) => {
  const copy = [...arr]
  const out = []
  for (let i = 0; i < n && copy.length; i++) {
    out.push(copy.splice(Math.floor(rng() * copy.length), 1)[0])
  }
  return out
}

// Estações reais do corredor operado pela MRS (Minas Gerais -> Rio de Janeiro -> São Paulo)
const STATIONS = [
  { name: 'Itabira', uf: 'MG', km: 0 },
  { name: 'Ouro Preto', uf: 'MG', km: 6 },
  { name: 'Congonhas', uf: 'MG', km: 11 },
  { name: 'Belo Horizonte', uf: 'MG', km: 16 },
  { name: 'Barbacena', uf: 'MG', km: 24 },
  { name: 'Juiz de Fora', uf: 'MG', km: 30 },
  { name: 'Além Paraíba', uf: 'MG', km: 36 },
  { name: 'Três Rios', uf: 'RJ', km: 42 },
  { name: 'Barra do Piraí', uf: 'RJ', km: 49 },
  { name: 'Volta Redonda', uf: 'RJ', km: 55 },
  { name: 'Barra Mansa', uf: 'RJ', km: 58 },
  { name: 'Resende', uf: 'RJ', km: 63 },
  { name: 'Cruzeiro', uf: 'SP', km: 69 },
  { name: 'Aparecida', uf: 'SP', km: 73 },
  { name: 'Guaratinguetá', uf: 'SP', km: 77 },
  { name: 'Taubaté', uf: 'SP', km: 82 },
  { name: 'Jacareí', uf: 'SP', km: 86 },
  { name: 'São José dos Campos', uf: 'SP', km: 89 },
  { name: 'Mogi das Cruzes', uf: 'SP', km: 94 },
  { name: 'Evangelista de Souza', uf: 'SP', km: 100 },
]

const ALARM_POOL = [
  'Temperatura elevada no transformador',
  'Sobrecarga de corrente na barra',
  'Falha de comunicação com o SCADA',
  'Baixo nível de óleo isolante',
  'Disjuntor com falha de abertura',
  'Queda de tensão na barra principal',
  'Vibração anormal no banco de transformadores',
  'Falha no sistema de refrigeração',
]

function classify(score) {
  if (score >= 70) return 'Crítico'
  if (score >= 40) return 'Atenção'
  return 'Operacional'
}

export function generateSubstations() {
  const list = STATIONS.map((base, i) => {
    const isMaintenance = i === 7 || i === 15 // duas em manutenção programada

    const temperature = +rand(38, 92).toFixed(1)
    const consumptionMW = +rand(2.4, 18.5).toFixed(1)
    const availability = +rand(90, 99.97).toFixed(2)
    const failures90d = randInt(0, 6)
    const mttrHours = +rand(1, 14).toFixed(1)
    const mtbfHours = Math.round(rand(180, 2200))
    const alarmCount = failures90d === 0 ? randInt(0, 1) : randInt(0, 4)
    const alarms = pick(ALARM_POOL, Math.min(alarmCount, 3))

    // Pontuação de atenção: combina disponibilidade, MTTR, MTBF, alarmes e temperatura
    let score = 0
    score += Math.max(0, 98 - availability) * 6
    score += Math.min(mttrHours, 14) * 3
    score += Math.max(0, (900 - mtbfHours) / 900) * 25
    score += alarms.length * 9
    score += Math.max(0, temperature - 70) * 1.4
    score = Math.round(Math.min(100, score))

    const status = isMaintenance ? 'Manutenção' : classify(score)

    return {
      id: `SE-${String(i + 1).padStart(2, '0')}`,
      name: `SE ${base.name}`,
      uf: base.uf,
      km: base.km,
      temperature,
      consumptionMW,
      availability,
      failures90d,
      mttrHours,
      mtbfHours,
      alarms,
      status,
      score: isMaintenance ? 20 : score,
    }
  })

  return list
}

export function attentionReasons(se) {
  const reasons = []
  if (se.availability < 97) reasons.push(`Disponibilidade em ${se.availability}%`)
  if (se.mttrHours >= 6) reasons.push(`MTTR elevado (${se.mttrHours}h)`)
  if (se.mtbfHours < 500) reasons.push(`MTBF baixo (${se.mtbfHours}h)`)
  if (se.alarms.length > 0) reasons.push(`${se.alarms.length} alarme(s) ativo(s)`)
  if (se.temperature >= 78) reasons.push(`Temperatura em ${se.temperature}°C`)
  if (reasons.length === 0) reasons.push('Dentro dos parâmetros esperados')
  return reasons
}

export const FLEET_TARGETS = {
  availability: 98.5,
  temperature: 75,
  mttrHours: 5,
  mtbfHours: 800,
}
