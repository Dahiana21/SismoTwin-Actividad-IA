import {useMemo,useState} from 'react';
import {Activity,BarChart3,BookOpen,Info,Layers} from 'lucide-react';
import {compute,type SimResult} from '../lib/simulation';
import type {Config,Seismic} from '../lib/model';

export const scenarios=[
 {name:'Pulso suave',detail:'0,06 g · 0,8 Hz · 10 s',amplitude:.06,frequency:.8,duration:10},
 {name:'Oscilación sostenida',detail:'0,18 g · 1,35 Hz · 12 s',amplitude:.18,frequency:1.35,duration:12},
 {name:'Movimiento intenso',detail:'0,36 g · 2,4 Hz · 15 s',amplitude:.36,frequency:2.4,duration:15},
] as const;
const f=(n:number,d=2)=>n.toLocaleString('es-CO',{maximumFractionDigits:d});
function maxIndex(xs:number[]){return xs.reduce((best,x,i)=>x>xs[best]?i:best,0)}
export function SeismicInsights({config,seismic,sim,frame,onScenario}:{config:Config;seismic:Seismic;sim:SimResult;frame:number;onScenario:(s:Partial<Seismic>)=>void}){
 const [details,setDetails]=useState(false);
 const present=sim.floors[Math.min(frame,sim.steps)];
 const current=present.map((x,i)=>Math.abs(x-(i?present[i-1]:0)));
 const governing=maxIndex(sim.drift),peak=sim.drift[governing];
 const runs=useMemo(()=>scenarios.map(s=>({s,result:compute(config,{...seismic,amplitude:s.amplitude,frequency:s.frequency,duration:s.duration})})),[config,seismic]);
 const estimate=sim.period;
 return <section className="seismic-insights" aria-label="Análisis avanzado de respuesta sísmica">
  <div className="insights-head"><div><span className="insights-kicker">SISMOTWIN ANALYTICS · EDUCACIONAL</span><h2><Layers size={19}/> Mapa de derivas y explicación de respuesta</h2></div><span className="insights-tag">Cálculo determinista</span></div>
  <div className="insights-cols">
   <div className="insight-box"><div className="insight-title">Deriva de entrepiso por nivel <small>en el instante t = {f(sim.time[Math.min(frame,sim.steps)],2)} s</small></div>
    <div className="drift-bars">{[...current].map((v,i)=><div className="drift-row" key={i}><span>Piso {i+1}</span><div className="drift-track"><div style={{width:`${Math.max(1,v/(Math.max(peak,1e-12))*100)}%`,background:v/(Math.max(peak,1e-12))>.66?'#fb7185':v/(Math.max(peak,1e-12))>.33?'#fbbf59':'#2ac7e9'}}/></div><strong>{f(v*1000,3)} mm</strong></div>)}</div>
    <div className="insight-legend"><span>■ Cian: menor valor</span><span>■ Ámbar: intermedio</span><span>■ Rosa: mayor valor</span></div>
    <p className="insight-note">Escala de colores relativa al máximo calculado para este ensayo; no representa niveles de daño. El color 3D usa esta misma escala.</p>
   </div>
   <div className="insight-box"><div className="insight-title"><BookOpen size={15}/> ¿Qué explican estos resultados?</div>
    <div className="reason-stat"><small>Entrepiso con mayor deriva en todo el ensayo</small><strong>Piso {governing+1} · {f(peak*1000,3)} mm</strong></div>
    <p>La máxima deriva normalizada es <b>{f((peak/config.floorHeight)*100,4)} %</b> respecto a la altura del piso. El piso más exigido se identifica recorriendo todos los tiempos y niveles calculados.</p>
    <p>La respuesta depende de la relación entre la <b>frecuencia de excitación ({f(seismic.frequency,2)} Hz)</b>, las masas y rigideces idealizadas, y el amortiguamiento ({f(seismic.damping*100,1)} %).</p>
    <p>Periodo proxy del entrepiso: <b>{f(estimate,3)} s</b>. Este valor <b>no</b> es el periodo modal del edificio y no se utiliza para certificar resonancia.</p>
    <button className="explain-button" onClick={()=>setDetails(!details)}>{details?'Ocultar supuestos':'Ver método y supuestos'} <Info size={14}/></button>
    {details&&<p className="insight-note">Modelo de cortante lineal con un desplazamiento lateral por piso; masas iguales, rigidez uniforme y amortiguamiento proporcional a rigidez. Integración Newmark-β, intervalo 0,02 s. No contempla fisuración, plastificación, interacción suelo-estructura ni capacidad resistente.</p>}
   </div>
  </div>
  <div className="insight-box"><div className="insight-title"><Activity size={16}/> Ensayos sísmicos reproducibles <small>misma geometría · mismo amortiguamiento</small></div><p className="insight-note">Selecciona un ensayo para aplicar exactamente sus parámetros a la animación y a la gráfica principal. Las cifras de esta tabla son resultados reales del modelo para cada señal sintética.</p>
   <div className="scenario-grid">{runs.map(({s,result})=><button className={`scenario-item ${Math.abs(s.amplitude-seismic.amplitude)<.001&&Math.abs(s.frequency-seismic.frequency)<.001&&s.duration===seismic.duration?'chosen':''}`} key={s.name} onClick={()=>onScenario({amplitude:s.amplitude,frequency:s.frequency,duration:s.duration})}><span className="scenario-name"><BarChart3 size={15}/>{s.name}</span><small>{s.detail}</small><strong>{f(result.maxDisp*1000,2)} mm</strong><small>Máx. desplazamiento</small><strong>{f(result.maxDrift*1000,2)} mm</strong><small>Máx. deriva entre pisos</small><span className="scenario-action">Aplicar ensayo</span></button>)}</div>
  </div>
  <p className="insight-disclaimer">Los ensayos son señales artificiales y los parámetros son ilustrativos. Un desplazamiento menor no demuestra mayor seguridad estructural. La resistencia, el daño y el colapso requieren análisis no lineales y datos reales validados.</p>
 </section>;
}
