import $ from 'jquery';
export default function AIOSwip({dom,start = ()=>{},move = ()=>{},end = ()=>{},speedX = 1,speedY = 1,stepX = 1,stepY = 1}){
  let a = {
    init(){
      this.eventHandler(dom,'mousedown',$.proxy(this.mouseDown,this))
    },
    getClient(e){
      let touch = 'ontouchstart' in document.documentElement;
      return touch?{x: e.changedTouches[0].clientX,y:e.changedTouches[0].clientY }:{x:e.clientX,y:e.clientY}
    },
    eventHandler(selector, event, action,type = 'bind'){
      var me = { mousedown: "touchstart", mousemove: "touchmove", mouseup: "touchend" }; 
      event = 'ontouchstart' in document.documentElement ? me[event] : event;
      var element = typeof selector === "string"?(selector === "window"?$(window):$(selector)):selector; 
      element.unbind(event, action); 
      if(type === 'bind'){element.bind(event, action)}
    },
    mouseDown(e){
      this.so = {
        client:this.getClient(e)
      };
      if(start(this.so.client.x,this.so.client.y) === false){return}
      this.eventHandler('window','mousemove',$.proxy(this.mouseMove,this));
      this.eventHandler('window','mouseup',$.proxy(this.mouseUp,this))
    },
    mouseMove(e){
      let client = this.getClient(e);
      let dx = client.x - this.so.client.x;
      let dy = client.y - this.so.client.y;
      dx = Math.round(dx * speedX)
      dy = Math.round(dy * speedY)
      dx = Math.floor(dx / stepX) * stepX;
      dy = Math.floor(dy / stepY) * stepY;
      if(dx === this.dx && dy === this.dy){return}
      this.dx = dx;
      this.dy = dy;
      let dist = Math.round(Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2)))
      this.dist = dist;
      move(dx,dy,dist);
    },
    mouseUp(){
      this.eventHandler('window','mousemove',this.mouseMove,'unbind');
      this.eventHandler('window','mouseup',this.mouseUp,'unbind');
      end(this.dx,this.dy,this.dist)
    }
  }
  a.init();
}