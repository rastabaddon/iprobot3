var display = [];
var refresh = false;
var canvas = false;
canvas = new fabric.Canvas('display0', {stateful: false,renderOnAddRemove: false});

function addCamera(id,url,login,pass)
{
	display[id] = { 
		'display' : false,
		'buffer' : false,
		'loading' : false,
		'url': false,
	};
	
	display[id].display = canvas;
	
	display[id].cmdurl = 'http://'+url+'/web/cgi-bin/hi3510/ptzctrl.cgi?-usr='+login+'&-pwd='+pass;
	
	display[id].url = 'img.php?usr='+login+'&pwd='+pass+'&ip='+url+'&cam='+id;
	//display[id].url = 'http://192.168.1.2/tmpfs/snap.jpg?usr='+login+'&pwd='+pass+'&cam='+id;
	
	display[id].loading = true;
	try {
		fabric.Image.fromURL(display[id].url+'&r'+Math.random(), function(img) {
			console.log('Loaded '.id);
			
			if(display[id].timer) { clearTimeout(display[id].timer);
						display[id].timer = false; 
					} 
					
			//img.filters.push(new fabric.Image.filters.Grayscale());
			//img.filters.push(new fabric.Image.filters.Invert());
	    	
			//img.setScaleY(0.5);
			//img.setScaleX(0.5);	
			display[id].buffer = img;
	        display[id].display.add(img);
	        display[id].loading = false;
	        //img.applyFilters(display[id].display.renderAll.bind(display[id].display));
	        
	        display[id].display.renderAll();
	        
	 	});
	 	
				
  } catch(e) {
  	console.log('error: ',e);
  }
    
    
}

function move(id,cmd)
{
	var u = display[id].cmdurl+'&-step=0&-act='+cmd+'&-speed=45';
	jQuery.ajax({ url: u, });	
}

function init()
{
	var id=0;
	for(var i in window.cameras)
	{
		addCamera(id,window.cameras[i].url,window.cameras[i].login,window.cameras[i].password);
		id++;
	}

	jQuery('#left').bind('mousedown',function(){
		move(0,'left');
	});
	
	jQuery('#left').bind('mouseup',function(){
		move(0,'stop');
	});
	
	jQuery('#right').bind('mousedown',function(){
		move(0,'right');
	});
	
	jQuery('#right').bind('mouseup',function(){
		move(0,'stop');
	});

//

	jQuery('#up').bind('mousedown',function(){
		move(0,'up');
	});
	
	jQuery('#up').bind('mouseup',function(){
		move(0,'stop');
	});
	
	jQuery('#down').bind('mousedown',function(){
		move(0,'down');
	});
	
	jQuery('#down').bind('mouseup',function(){
		move(0,'stop');
	});
			
	refreshBuffor();
}

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

function refreshBuffor()
{
	for(var ids in display)
	{
		
		if(display[ids].buffer && !display[ids].loading) { 
		
			if(ids==0) {
				setTimeout(function(){
					display[0].loading = false;
				},1000);
			}
			
			try {
				console.log('Req: ',ids);
				display[ids].loading = true;
				display[ids].buffer.setSrc(display[ids].url+'&r'+Math.random(),function(img){
					
					display[ids].display.renderAll();
					setTimeout(function(){
					display[ids].loading = false;
					},500);

				});
			} catch(e) {
				console.log('error: ',e);
				
				
			}
		} else {
					
		}
		
	}
	
	requestAnimFrame(refreshBuffor);
	
}

jQuery(window).ready(function(){
	console.log('Start');
	init();
	
});

console.log('Load and wait');
