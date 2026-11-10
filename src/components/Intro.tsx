import {useEffect,useState} from 'react';
import {motion,AnimatePresence} from 'motion/react';
import {ArrowRight,Layers3,SkipForward} from 'lucide-react';

export function Intro({onDone}:{onDone:()=>void}){
 const [done,setDone]=useState(false);
 useEffect(()=>{if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){setDone(true);return} const t=window.setTimeout(()=>setDone(true),4800);return()=>clearTimeout(t)},[]);
 useEffect(()=>{if(done){const t=window.setTimeout(onDone,430);return()=>clearTimeout(t)}},[done,onDone]);
 return <AnimatePresence><motion.div className="intro-overlay" initial={{opacity:1}} exit={{opacity:0}} animate={{opacity:done?0:1}} transition={{duration:.42}} aria-label="Presentación SismoTwin 4D">
  <div className="intro-grid"/>
  <div className="intro-inner">
   <div className="intro-kicker"><Layers3 size={15}/> INGENIERÍA + ARQUITECTURA + SIMULACIÓN</div>
   <div className="intro-tower" aria-hidden="true"><div className="intro-tower-halo"/><div className="intro-ground"/>{Array.from({length:8},(_,i)=><div key={i} className="intro-floor" style={{bottom:`${i*27+25}px`,animationDelay:`${.2+i*.21}s`}}><div className="intro-pane"/><div className="intro-pane"/><div className="intro-pane"/><div className="intro-pane"/></div>)}<div className="intro-roof"/></div>
   <motion.h1 initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:1,duration:.7}} className="intro-name">SISMO<span>TWIN</span><sup>4D</sup></motion.h1>
   <motion.p initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:1.4,duration:.6}} className="intro-slogan">Diseña el futuro. Simula sus desafíos.</motion.p>
   <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.8}} className="intro-flow"><span>DISEÑA</span><i/> <span>CONSTRUYE</span><i/> <span>SIMULA</span><i/> <span>COMPARA</span></motion.div>
   <div className="intro-progress"><span/></div>
   <button className="intro-enter" onClick={()=>setDone(true)}><SkipForward size={15}/> Omitir introducción <ArrowRight size={15}/></button>
  </div>
 </motion.div></AnimatePresence>;
}
