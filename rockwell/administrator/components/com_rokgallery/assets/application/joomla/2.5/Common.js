/*
 * @version   $Id: Common.js 10876 2013-05-30 06:23:01Z btowles $
 * @author    RocketTheme http://www.rockettheme.com
 * @copyright Copyright (C) 2007 - 2013 RocketTheme, LLC
 * @license   http://www.gnu.org/licenses/gpl-2.0.html GNU/GPLv2 only
 */
((function(){if(!Browser.Engine){if(Browser.Platform.ios){Browser.Platform.ipod=true;
}Browser.Engine={};var d=function(g,f){Browser.Engine.name=g;Browser.Engine[g+f]=true;Browser.Engine.version=f;};if(Browser.ie){Browser.Engine.trident=true;
switch(Browser.version){case 6:d("trident",4);break;case 7:d("trident",5);break;case 8:d("trident",6);}}if(Browser.firefox){Browser.Engine.gecko=true;if(Browser.version>=3){d("gecko",19);
}else{d("gecko",18);}}if(Browser.safari||Browser.chrome){Browser.Engine.webkit=true;switch(Browser.version){case 2:d("webkit",419);break;case 3:d("webkit",420);
break;case 4:d("webkit",525);}}if(Browser.opera){Browser.Engine.presto=true;if(Browser.version>=9.6){d("presto",960);}else{if(Browser.version>=9.5){d("presto",950);
}else{d("presto",925);}}}if(Browser.name=="unknown"){switch((ua.match(/(?:webkit|khtml|gecko)/)||[])[0]){case"webkit":case"khtml":Browser.Engine.webkit=true;
break;case"gecko":Browser.Engine.gecko=true;}}this.$exec=Browser.exec;}var b=(Function.attempt(function(){return navigator.plugins["Shockwave Flash"].description;
},function(){return new ActiveXObject("ShockwaveFlash.ShockwaveFlash").GetVariable("$version");})||"0 r0").match(/\d+/g);Browser.Plugins.Flash={version:Number(b[0]||"0."+b[1])||0,fullversion:b.join("."),build:Number(b[2])||0};
if(MooTools.lang){MooTools.lang.set("en-US","Uploader",c);}else{MooTools.lang={get:function(g,f){return c[f];}};}if(!this.Uploader){this.Uploader={};}this.UploaderSupport={ready:false,load:function(g){g=g||"";
var f=UploaderSupport.check();if(!f){return;}new Asset.javascript(g+"Uploader."+f+".js",{onLoad:function(){this.inject(document.head);UploaderSupport.ready=true;
RokGallery.uploader=new Uploader("toolbar-upload");}});},check:function(){if((Browser.name=="firefox"&&Browser.version>3.6)||Browser.Engine.webkit){return"HTML5";
}if(Browser.Plugins.Flash&&Browser.Plugins.Flash.version>=9){return"Flash";}var f=function(g){if(g=="notice"){if(!Browser.Plugins.Flash||!Browser.Plugins.Flash.version){return"it looks like you don't have Flash plugin installed.";
}else{var h=Browser.Plugins.Flash;return"your Flash plugin version <strong>"+h.fullversion+"</strong> is too old.";}}if(g=="link"){return'<p>Alternatively you can install or update your <a href="http://get.adobe.com/flashplayer/">Flash plugin</a> to the latest version</p>';
}};window.Popup.setPopup({type:"warning",title:"Unsupported Browser",message:"<p>Your browser <strong>"+Browser.name.capitalize()+"</strong> v<strong>"+Browser.version+"</strong> does not support modern files uploading specs and "+f("notice")+'</p><p>In order to be able to upload files it is highly suggested to use a more modern browser such as <a href="http://www.mozilla.com/firefox">Firefox</a>, <a href="http://www.google.com/chrome/">Chrome</a> or <a href="http://www.apple.com/safari/">Safari</a>.</p> '+f("link"),buttons:{ok:{show:true,label:"close"}},"continue":function(){var g=(document.id("uploader")||document.id("toolbar-upload")).set("tween",{duration:200});
g.retrieve("tween").start("opacity",0).chain(g.dispose.bind(g));this.close();}}).open();return false;}};var e={Frames:function(){var j=new Element("div#test3d"),h=false,g=["animationName","WebkitAnimationName","MozAnimationName","OAnimationName","msAnimationName","KhtmlAnimationName"];
for(var f=g.length-1;f>=0;f--){h=h?h:j.style[g[f]]!=undefined;}return h;},"2D":function(){var j=new Element("div#test3d"),h=false,g=["transformProperty","WebkitTransform","MozTransform","OTransform","msTransform"];
for(var f=g.length-1;f>=0;f--){h=h?h:j.style[g[f]]!=undefined;}return h;},"3D":function(){var k=new Element("div#test3d"),j=false,g=["perspectiveProperty","WebkitPerspective","MozPerspective","OPerspective","msPerspective"];
for(var f=g.length-1;f>=0;f--){j=j?j:k.style[g[f]]!=undefined;}if(j&&"webkitPerspective" in document.documentElement.style){var h=document.createElement("style");
h.textContent="@media (-webkit-transform-3d){#test3d{height:3px}}";document.head.appendChild(h);k.inject(document.body);j=k.offsetHeight===3;h.dispose();
k.dispose();}return j;}};var a=this.RokGallerySqueezeBox={linkElement:"slice-linkdata",dataElement:"slice-link",setData:function(m,l,h,i){var g=l.replace(/ /g,"-").toLowerCase(),f=document.id(a.linkElement)||document.getElement(a.linkElement),k=document.id(a.dataElement)||document.getElement(a.dataElement),j;
j={type:i,id:m,title:l,link:"index.php?option=com_content&view=article&id="+m+":"+g+"&catid="+h};f.addClass("disabled").set("value",l);k.set("value",JSON.encode(j));
RokGallery.editPanel.disableSliceLink();},getData:function(){var f=document.id(a.linkElement)||document.getElement(a.linkElement),h=document.id(a.dataElement)||document.getElement(a.dataElement),g;
g=JSON.validate(h.get("value"))?JSON.decode(h.get("value")):{};return g;}};this.jSelectArticle_jform_request_id=function(h,g,f){a.setData(h,g,f,"article");
SqueezeBox.close();};window.addEvent("domready",function(){for(var f in e){this["Supports"+f]=e[f]();}if(typeof SqueezeBox!="undefined"){SqueezeBox.addEvents({onOpen:function(){this.overlay.setStyle("width","200%");
},onClose:function(){this.overlay.setStyle("width","100%");}});}});var c={progressOverall:"{total}",currentTitle:"File Progress",currentFile:'Uploading "{name}"',currentProgress:"Upload: {bytesLoaded} with {rate}, {timeRemaining} remaining.",fileName:"{name}",remove:"remove",removeTitle:"Click to remove this entry.",fileError:"Upload failed",validationErrors:{duplicate:"File <em>{name}</em> is already added, duplicates are not allowed.",sizeLimitMin:"File <em>{name}</em> (<em>{size}</em>) is too small, the minimal file size is {fileSizeMin}.",sizeLimitMax:"File <em>{name}</em> (<em>{size}</em>) is too big, the maximal file size is <em>{fileSizeMax}</em>.",fileListMax:"File <em>{name}</em> could not be added, amount of <em>{fileListMax} files</em> exceeded.",fileListSizeMax:"File <em>{name}</em> (<em>{size}</em>) is too big, overall filesize of <em>{fileListSizeMax}</em> exceeded."},errors:{httpStatus:"Server returned HTTP-Status <code>#{code}</code>",securityError:"Security error occured ({text})",ioError:"Error caused a send or load operation to fail ({text})"}};
})());