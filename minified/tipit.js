!function(t,i){"use strict";var e=function(t){var e=function(t){var i=o.indexOf(r.attr("data-tipit-placement")),e=i>=0?o[i]:o[0],n=f.html(r.attr("data-tipit-content"))&&f.html(),d=r.attr("data-tipit-class"),u=r.offset(),p=r.outerWidth(!1),l=r.outerHeight(!1),s=f.outerWidth(!1),c=f.outerHeight(!1),h=["left","right"].indexOf(e)>=0,m=["right","bottom"].indexOf(e)>=0,v={left:h?m?u.left+p+a:u.left-s-a:u.left+p/2-s/2,top:h?u.top+l/2-c/2:m?u.top+l+a:u.top-c-a};return f.data("timeout.id")&&clearTimeout(f.data("timeout.id")),!!n&&(f.addClass("fx "+e+(d?" "+d:"")),void f.css({left:v.left.toFixed(2)+"px",top:v.top.toFixed(2)+"px"}))},n=function(t){f.removeClass("fx")},d=$("body")[0].appendChild(i.createElement("div")),f=$(d).addClass("tipit"),r=$(t);$([t,d]).on("mouseout",function(t){var i=setTimeout(n,150);f.data("timeout.id",i)}).on("mouseover",e),t.showTipit=e,t.hideTipit=n},o=["left","right","top","bottom"],a=15;$(i).ready(function(){for(var t=$("[data-tipit-content]"),i=t.length,o=0;i>o;o++)e(t[o]);$.fn.tipit=function(){this.each(function(){e(this)})}})}(0,document);