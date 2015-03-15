/*
 * @version   $Id: Uploader.HTML5.js 10876 2013-05-30 06:23:01Z btowles $
 * @author    RocketTheme http://www.rockettheme.com
 * @copyright Copyright (C) 2007 - 2013 RocketTheme, LLC
 * @license   http://www.gnu.org/licenses/gpl-2.0.html GNU/GPLv2 only
 */
((function(){this.Uploader.HTML5=new Class({Implements:[Options,Events],options:{queued:1,target:"files-browse",container:null,fileSizeMax:0,fileSizeMin:0,fileListMax:0,fileListSizeMax:0,accept:"image/*",onFileSuccess:function(e,c){var d=new Hash(JSON.validate(c)?JSON.decode(c,true):{}||{});
if(d.get("status")=="success"){e.element.addClass("file-success");}else{e.element.addClass("file-failed");e.info.set("html","<strong>An error occured:</strong> "+(d.get("status")=="error"?d.get("message"):c));
}this.scrollbar.update();}},initialize:function(c,e,d){this.setOptions(d);this.status=document.id(c);this.list=document.id(e);this.form=this.status.getParent("form");
this.target=document.id(this.options.target);this.browse=new Element("input[type=file][name=Filedata][multiple]").inject(this.target);this.browse.set("accept",this.options.accept);
this.uploader=RokGallery.uploader;this.scrollbar=new Scrollbar(e,{triggerElement:"#popup .content",gutter:true,wrapStyles:{"float":"right"}});new Element("div.clr").inject(this.scrollbar.wrapper,"after");
this.files=[];this.filesBounds={remove:this.remove.bind(this)};this.values={size:0,files:{uploading:0,uploaded:0},bytes:{now:0,last:0},percent:0};this.bounds={upload:{progress:this.progress.bind(this),fileRequest:this.fileRequest.bind(this),fileComplete:this.fileComplete.bind(this)},drag:{dragover:this.dragover.bind(this),dragleave:this.dragout.bind(this),drop:this.drop.bind(this)},buttons:{upload:this.start.bind(this),browse:function(g){var f=Browser.firefox&&Browser.version>4&&g.target.get("tag")=="input";
if(!this.running&&!f){this.target.getElement("input[type=file]").click();}}.bind(this),change:this.enqueue.bind(this,false)}};this.queued=false;this.job=false;
this.render("init");this.attach();},attach:function(){document.id("files-upload").addEvent("click",this.bounds.buttons.upload);this.target.addEvent("click",this.bounds.buttons.browse);
this.browse.addEvent("change",this.bounds.buttons.change);$$(window.Popup.overlay,window.Popup.popup).addEvents(this.bounds.drag);this.addEvents(this.bounds.upload);
return this;},detach:function(){document.id("files-upload").removeEvent("click",this.bounds.buttons.upload);this.target.removeEvent("click",this.bounds.buttons.browse);
this.browse.removeEvent("change",this.bounds.buttons.change);$$(window.Popup.overlay,window.Popup.popup).removeEvents(this.bounds.drag);this.removeEvents(this.bounds.upload);
return this;},render:function(f){if(!f||f=="init"){var c=window.Popup;this.browse.setStyles({visibility:"hidden",position:"absolute"});if(Browser.opera){this.browse.setStyles({opacity:0.00001,height:30,width:this.browse.getSize().x,right:-1,top:-1,visibility:"visible"});
this.target.setStyle("overflow","hidden");}new Element("div.clr").inject(this.list,"after");this.clearall=new Element("span#files-clear",{text:"clear all"}).inject(this.target,"after");
c.popup.getElement(".ok").set("id","files-upload");this.overallTitle=this.status.getElement(".overall-title");this.currentText=this.status.getElement(".current-text");
var d=this.status.getElement(".overall-progress");this.overallProgress=new Progress(d);this.clearall.addEvent("click",function(){if(this.running){return;
}this.clear();this.overallProgress.reset();var g=this.form.getChildren(),h;h=g.shift().setStyle("display","block");g=g.slice(0,g.length-1);new Elements(g).setStyle("display","none");
this.clearall.setStyle("display","none");this.status.getElements("canvas").setStyle("display","block");this.status.getElement("#files-success").setStyle("display","none");
this.status.store("rendered:files",false);}.bind(this));this.status.store("rendered:init",true);}if(f=="files"){var e=this.form.getChildren();new Elements(e.slice(1,e.length-1)).setStyle("display","block");
this.list.setStyle("display","block");document.id("files-clear").setStyle("display","inline-block");document.id("files-empty-desc").setStyle("display","none");
this.status.store("rendered:files",true);}},setJobs:function(){window.Popup.popup.getElements(".button").setStyle("display","none");this.clearall.setStyle("display","none");
this.jobsInfo=new Element("div.job-info").inject(window.Popup.popup.getElement(".statusbar .clr"),"before");window.Popup.popup.getElement(".loading").setStyle("display","block");
return this;},setJobText:function(c){if(this.jobsInfo){this.jobsInfo.set("html",c);}},createJob:function(){this.uploader.attachUnload("You are about to leave this page with an upload job in progress.\n\nAre you sure you want to continue?");
this.setJobs();this.uploader.job.create();},setReady:function(){this.uploader.job.ready();},start:function(){clearTimeout(this.timer);if(this.queued.length||!this.files.length){return this;
}window.Popup.popup.removeEvents("dragover","dragleave","drop");this.detach().attach();this.fireEvent("beforeStart");if(!this.job){return this.createJob();
}var c=this.values;c.bytes.now=c.bytes.last=c.percent=c.uploaded=c.uploading=c.left=0;this.queued=Array.flatten([this.files]);this.running=true;this.timer=this.updateSpeed.periodical(500,this);
files=this.queued.splice(0,this.options.queued||this.files.length);(files.length?files:this.files).each(function(e,d){(function(){e.request.append("model","upload");
e.request.append("action","file");e.request.append("params",JSON.encode({id:this.job}));e.request.send({data:e.file});}.bind(this)).delay(5*d);},this);
return this;},progress:function(){var c=this.values.percent=Math.round(this.values.bytes.now*100/this.values.size);this.overallProgress.set(c);var d=this.overallTitle.retrieve("total");
this.overallTitle.set("html",d+'<br /><span style="color: #999;">'+Uploader.formatUnit(this.values.bytes.now,"b")+"</span>");this.currentText.set("html",c+"% <br />"+((this.rate)?Uploader.formatUnit(this.rate,"bps"):"- B"));
},fileRequest:function(c){this.values.files.uploading++;},fileComplete:function(e,d){var c=this.values.files;c.uploaded++;c.uploading--;this.setJobText("Uploading... ("+c.uploaded+"/"+this.files.length+")");
if(this.options.queued&&c.uploading<this.options.queued){var f=this.queued.splice(0,this.options.queued-c.uploading);f.each(function(h,g){(function(){h.request.append("model","upload");
h.request.append("action","file");h.request.append("params",JSON.encode({id:this.job}));h.request.send({data:h.file});}.bind(this)).delay(5*g);},this);
}if(c.uploaded==this.files.length){this.complete();}},complete:function(){clearTimeout(this.timer);this.status.removeClass("file-uploading");if(this.values.size){if(Browser.firefox){this.values.bytes.now=this.values.size;
}this.progress();this.overallProgress.set(100);this.values.files.uploaded=this.files.length;this.values.files.uploading=this.values.left=0;this.status.getElements("canvas").setStyle("display","none");
this.status.getElement("#files-success").setStyle("display","block");}else{this.overallProgress.set(0);this.status.getElements("canvas").setStyle("display","block");
this.status.getElement("#files-success").setStyle("display","none");}this.running=false;this.setReady();this.uploader.detachUnload();},updateSpeed:function(){var c=this.values.bytes.last,e=this.values.bytes.now,d=e-c;
if(!d){return;}this.values.bytes.last=e;this.rate=d*2;},enqueue:function(c){if(!c){c=this.browse.files;}if(this.files.length>=100||this.files.length+c.length>100){var d="#ed2e26";
window.Popup.counter.tween("color",d).tween("color","#999").tween("color",d).tween("color","#999").tween("color",d).tween("color","#999");}Object.each(c,this.add.bind(this));
if(!this.status.retrieve("rendered:files")&&this.files.length){this.render("files");}this.updateOverall();this.scrollbar.update();},add:function(d,c){if(this.files.length+1>100){return;
}if(this.validate(d)){var e=new Uploader.HTML5.File(this,d,{list:this.list});e.addEvents(this.filesBounds);this.files.push(e);window.Popup.counter.getElement("span").set("text",this.files.length);
}},clear:function(){clearTimeout(this.timer);window.Popup.counter.getElement("span").set("text",0);this.files.each(function(d,c){d.request.cancel();d.remove.delay(1*c,d);
},this);this.fireEvent("clear");},remove:function(c){this.files.erase(c);this.values.size-=c.file.size;this.updateOverall();window.Popup.reposition();this.scrollbar.update();
window.Popup.counter.getElement("span").set("text",this.files.length);this.fireEvent("fileRemove");},dragover:function(c){c.stop();c.dataTransfer.dropEffect=(this.running)?"none":"copy";
return this.fireEvent("dragOver");},dragout:function(c){return this.fireEvent("dragOut");},drop:function(c){c.stop();if(this.running){return false;}this.enqueue(c.dataTransfer.files);
document.body.focus();return this.fireEvent("drop");},validate:function(e){var f=this.options,g=MooTools.lang.get("Uploader","validationErrors"),c=false;
if(!e.type&&!e.size){return false;}if(!e.type.test(/^image\/(jp(e)?g|gif|png)$/)){return false;}if(f.fileSizeMax&&e.size>f.fileSizeMax){c="sizeLimitMax";
}else{if(f.fileSizeMin&&e.size<f.fileSizeMin){c="sizeLimitMin";}else{if(f.fileListSizeMax&&(e.size+this.values.size)>f.fileListSizeMax){c="fileListSizeMax";
}else{if(f.fileListMax&&this.files.length>=f.fileListMax){c="fileListMax";}}}}if(c){var d=this.error(e,g[c]);return false;}this.values.size+=e.size;return true;
},error:function(c,d){return new Element("li.validation-error",{html:d.substitute({name:c.name,size:Uploader.formatUnit(c.size,"b"),fileSizeMin:Uploader.formatUnit(this.options.fileSizeMin||0,"b"),fileSizeMax:Uploader.formatUnit(this.options.fileSizeMax||0,"b"),fileListMax:this.options.fileListMax||0,fileListSizeMax:Uploader.formatUnit(this.options.fileListSizeMax||0,"b")}),title:MooTools.lang.get("Uploader","removeTitle"),events:{click:function(){this.destroy();
window.Popup.reposition();}}}).inject(this.list,"top");},updateOverall:function(){this.overallTitle.set("html",MooTools.lang.get("Uploader","progressOverall").substitute({total:Uploader.formatUnit(this.values.size,"b")})).store("total",Uploader.formatUnit(this.values.size,"b"));
if(!this.values.size){this.currentText.set("html","");this.clearall.fireEvent("click");}}});this.Uploader.HTML5.File=new Class({Implements:[Options,Events],options:{list:null,file:null},initialize:function(e,d,c){this.setOptions(c);
this.list=document.id(this.options.list);this.file=d;this.base=e;this.bounds={onProgress:this.progress.bind(this),onRequest:this.request.bind(this),onSuccess:this.success.bind(this),onComplete:this.complete.bind(this)};
this.request=new Request.File({url:this.base.form.get("action")});this.request.addEvents(this.bounds);this.render();},render:function(){this.info=new Element("span",{"class":"file-info"});
this.canvas=new Element("canvas",{width:12,height:12,"class":"file-canvas"});this.element=new Element("li",{"class":"file file-"+Number.random(1,3)}).adopt(new Element("span",{"class":"file-name",html:this.file.name}),new Element("span",{"class":"file-size",html:"("+Uploader.formatUnit(this.file.size,"b")+")"}),new Element("a",{"class":"file-remove",href:"#",html:"<span>remove</span>",title:MooTools.lang.get("Uploader","removeTitle"),events:{"click:once":function(c){c.stop();
this.remove();}.bind(this)}}),this.info,this.canvas,new Element("div.clr")).inject(this.list);new Element("div.file-canvas-wrapper").wraps(this.canvas);
if(!this.progressBar){this.progressBar=new Progress(this.canvas);}this.fireEvent("add",this);},remove:function(){this.element.fade("out").retrieve("tween").chain(function(){Element.destroy(this.element);
this.fireEvent("remove",this);}.bind(this));},request:function(){this.element.addClass("file-uploading");this.progressBar.reset();this.element.store("loaded",0);
this.base.fireEvent("onFileRequest",this);},progress:function(c){var e=this.element.retrieve("loaded"),d=c.loaded;var f=Math.round(c.loaded*100/c.total);
this.progressBar.set(f);if(e<d){this.base.values.bytes.now+=((d-e)*this.file.size)/c.total;}this.element.store("loaded",d);this.base.fireEvent("progress",c.loaded);
},success:function(c){var d=this.element.retrieve("loaded");this.element.store("loaded",this.file.size);this.progressBar.set(100);this.element.addClass("file-success");
this.base.fireEvent("onFileSuccess",[this,c]);},complete:function(c){this.element.removeClass("file-uploading");this.base.fireEvent("onFileComplete",[this,c]);
}});var b=function(){},a=("onprogress" in new Browser.Request);Request.File=new Class({Extends:Request,options:{emulation:false,urlEncoded:false},initialize:function(c){this.xhr=new Browser.Request();
this.formData=new FormData();this.setOptions(c);this.headers=this.options.headers;},append:function(c,d){if(typeof c=="object"){if(c.constructor==File){return this.append("Filedata",c);
}for(var e in c){return this.append(e,c[e]);}}this.formData.append(c,d);return this.formData;},send:function(k){if(!this.check(k)){return this;}this.options.isSuccess=this.options.isSuccess||this.isSuccess;
this.running=true;var i=typeOf(k);if(i=="string"||i=="element"){k={data:k};}var f=this.options;k=Object.append({data:f.data,url:f.url,method:f.method},k);
var h=k.data,d=String(k.url),c=k.method.toLowerCase();switch(typeOf(h)){case"element":h=new FormData(h);break;case"object":case"hash":h=this.append(h);
}if(this.options.format){h.append("format",this.options.format);}if(this.options.emulation&&!["get","post"].contains(c)){h.append("_method",c);}if(this.options.urlEncoded&&["post","put"].contains(c)){var e=(this.options.encoding)?"; charset="+this.options.encoding:"";
this.headers["Content-type"]="application/x-www-form-urlencoded"+e;}if(!d){d=document.location.pathname;}var g=d.lastIndexOf("/");if(g>-1&&(g=d.indexOf("#"))>-1){d=d.substr(0,g);
}if(this.options.noCache){d+=(d.contains("?")?"&":"?")+String.uniqueID();}if(h&&c=="get"){d+=(d.contains("?")?"&":"?")+h;h=null;}var j=this.xhr;if(a){j.onloadstart=this.loadstart.bind(this);
j.onprogress=this.progress.bind(this);j.upload.onprogress=this.progress.bind(this);}j.open(c.toUpperCase(),d,this.options.async,this.options.user,this.options.password);
if(this.options.user&&"withCredentials" in j){j.withCredentials=true;}j.onreadystatechange=this.onStateChange.bind(this);Object.each(this.headers,function(m,l){try{j.setRequestHeader(l,m);
}catch(n){this.fireEvent("exception",[l,m]);}},this);this.fireEvent("request");j.send(h);if(!this.options.async){this.onStateChange();}if(this.options.timeout){this.timer=this.timeout.delay(this.options.timeout,this);
}return this;}});})());