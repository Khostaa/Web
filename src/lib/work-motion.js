// Normalize mouse wheels and trackpads, then advance the same timeline direction.
export function wheelDistance(x,y,mode=0,pageSize=600){
  const amount=Math.max(Math.abs(x),Math.abs(y));
  if(!Number.isFinite(amount)||amount===0)return 0;
  return Math.min(300,amount*(mode===1?16:mode===2?pageSize:1))*1.35;
}
export function advanceLoopTime(time,duration,pixels,speed){
  if(!Number.isFinite(duration)||duration<=0||!Number.isFinite(speed)||speed<=0)return time;
  const next=time+pixels/speed*1000;
  return ((next%duration)+duration)%duration;
}
