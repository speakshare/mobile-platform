module.exports = function wave(opts) {
	var ctx;
	    var waveImage;
	    var canvasWidth;
	    var canvasHeight;
	    var needAnimate = false;
	    var img='data:image/png;base64,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';

	    function init (callback) {
	        var wave = opts.parent;
	        var canvas = document.createElement('canvas');
	        if (!canvas.getContext) return;
	        ctx = canvas.getContext('2d');
	        canvasWidth = wave.offsetWidth-2;
	        canvasHeight = wave.offsetHeight-2;
	        canvas.setAttribute('width', canvasWidth);
	        canvas.setAttribute('height', canvasHeight);
	        wave.appendChild(canvas);
	        waveImage = new Image();
	        waveImage.onload = function () {
	            waveImage.onload = null;
	            callback();
	        }

	        waveImage.src = img;
	    }

	    function animate () {
	        var waveX = 0;
	        var waveY = 0;
	        var waveX_min = -203;
	        var waveY_max = canvasHeight * 0.4;
	        var requestAnimationFrame = 
	            window.requestAnimationFrame || 
	            window.mozRequestAnimationFrame || 
	            window.webkitRequestAnimationFrame || 
	            window.msRequestAnimationFrame ||
	            function (callback) { window.setTimeout(callback, 1000 / 60); };
	        function loop () {
	            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
	            if (!needAnimate) return;
	            if (waveY < waveY_max) waveY += 1.5;
	            if (waveX < waveX_min) waveX = 0; else waveX -= 3;
	            
	            ctx.globalCompositeOperation = 'source-over';
	            ctx.beginPath();
	            ctx.arc(canvasWidth/2, canvasHeight/2, canvasHeight/2, 0, Math.PI*2, true);
	            ctx.closePath();
	            ctx.fill();

	            ctx.globalCompositeOperation = 'source-in';
	            ctx.drawImage(waveImage, waveX, canvasHeight - waveY);
	            
	            requestAnimationFrame(loop);
	        }
	        loop();
	    }

	    function start () {
	        if (!ctx) return init(start);
	        needAnimate = true;
	        setTimeout(function () {
	            if (needAnimate) animate();
	        }, 500);
	    }

	    function stop () {
	        needAnimate = false;
	    }
	    return {start: start, stop: stop};
}