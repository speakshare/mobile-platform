/**
 * Created by chenguodong on 2017/5/17.
 */
$.fn.RangeSlider = function(cfg){
    this.sliderCfg = {
        min: cfg && !isNaN(parseFloat(cfg.min)) ? Number(cfg.min) : null,
        max: cfg && !isNaN(parseFloat(cfg.max)) ? Number(cfg.max) : null,
        value: cfg && !isNaN(parseFloat(cfg.value)) ? Number(cfg.value) : null,
        step: cfg && Number(cfg.step) ? cfg.step : 1,
        callback: cfg && cfg.callback ? cfg.callback : null
    };

    var $input = $(this);
    var min = this.sliderCfg.min;
    var max = this.sliderCfg.max;
    var step = this.sliderCfg.step;
    var value = this.sliderCfg.value;
    var callback = this.sliderCfg.callback;

    $input.attr('min',min).attr('max',max).attr('step',step);
    if(min == max){
        $input.css({'background-size':100 + '% 100%'});
    }else{
        $input.css({'background-size':parseFloat(1-(max-value)/(max-min))*100 + '% 100%'});
    }

    $input.bind("input",function(e){
        $input.attr('value',this.value);
        $input.css({'background-size':parseFloat(1-(max-this.value)/(max-min))*100 + '% 100%'});
        // $input.css( 'background', 'linear-gradient(to right, #ff5532, white ' + this.value + '%, white)' );
        if ($.isFunction(callback)){
            callback(this);
        }
    });
};