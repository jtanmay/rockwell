((function(){this.Galleries=new Class({Implements:[Options,Events],options:{url:""},initialize:function(a){this.setOptions(a);this.request=new Request({url:this.options.url,onSuccess:this.success.bind(this)});
["get","create","update","order","publish","delete"].each(this.actions.bind(this,false));["get"].each(this.actions.bind(this,true));},success:function(a){if(!JSON.validate(a)){return this.error("Invalid JSON response.");
}a=JSON.decode(a);if(a.status!="success"){return this.error(a.message);}if(this.action=="create"){this.id=a.payload.job;}this.fireEvent(this.action,[a,this.id]);
if(this.queue){this[this.queue].delay(10,this);this.queue=null;return this;}this.done(a);return this;},start:function(){this.fireEvent("start",this.id);
},done:function(a){this.fireEvent("done",[this.id,a]);},error:function(a){this.fireEvent("error",[a,this.action]);},actions:function(a,c){var b=(!a&&c=="get")?"getSingle":c;
this[b]=function(e,d){this.start();this.fireEvent("before"+b.capitalize());this.action=b;var f={model:(!a)?"gallery":"galleries",action:c};if(e&&c!="delete"&&c!="order"){if(this.id){if(!d){f.params=JSON.encode({id:this.id.toInt(),gallery:e});
}else{f.params=JSON.encode({id:this.id.toInt(),gallery:e,order:d});}}else{f.params=JSON.encode({gallery:e});}}else{if(c=="order"){f.params=JSON.encode({id:this.id.toInt(),order:e});
}else{if(c=="delete"){if(this.id){f.params=JSON.encode({id:this.id.toInt(),delete_slices:e});}}else{if(this.id){f.params=JSON.encode({id:this.id.toInt()});
}else{f.params=JSON.encode({});}}}}this.request.send({data:f});return this;};}.protect()});this.GalleryOrder=new Class({Extends:Galleries,options:{url:"",element:".galleries-mini-thumbs",onBeforeOrder:function(){this.statusBar.getElement(".loading").setStyle("display","block");
},onOrder:function(){this.statusBar.getElement(".loading").setStyle("display","none");this.hide();},onBeforeGetSingle:function(){this.element.getElement(".mini-thumbs-loading").setStyle("display","block");
this.statusBar.getElement(".loading").setStyle("display","block");this.scrollbar.update();},onGetSingle:function(a){this.element.getElement(".mini-thumbs-loading").setStyle("display","none");
this.statusBar.getElement(".loading").setStyle("display","none");if(!a.payload.gallery.Slices.length){this.applyButton.setStyle("display","none");this.element.getElement(".mini-thumbs-list").addClass("empty");
}else{this.applyButton.setStyle("display","block");this.element.getElement(".mini-thumbs-list").set("html",a.payload.html);this.sortable=new GallerySort(this.element.getElement(".mini-thumbs-list ul"),{constrain:true,clone:function(c,b,d){var e=b.clone(true).setStyles({margin:0,position:"absolute",visibility:"hidden",width:b.getStyle("width")}).addEvent("mousedown",function(f){b.fireEvent("mousedown",f);
});return e.inject(this.list).setPosition(b.getPosition(b.getOffsetParent()));},revert:true,opacity:0.55});}this.scrollbar.update();},onError:function(a,b){this.statusBar.getElement(".loading").setStyle("display","none");
window.Popup.setPopup({type:"warning"});if(b=="get"){window.Popup.content.getElement(".galleries-loading").set("html",a);}else{this.galleriesInfo.set("text",a);
}}},initialize:function(a){this.setOptions(a);this.parent(a);this.element=document.id(this.options.element)||document.getElement(this.options.element)||null;
this.element.set("tween",{duration:400,transition:"expo:out",unit:"%",onStart:this.tweenStart.bind(this),onComplete:this.tweenComplete.bind(this)});var b=window.Popup.popup.getElement(".galleries-info");
this.galleriesInfo=b||new Element("div.galleries-info").inject(window.Popup.popup.getElement(".statusbar .clr"),"before");this.statusBar=window.Popup.statusBar;
this.closeButton=this.element.getElement(".button.cancel");this.applyButton=this.element.getElement(".button.ok");this.id=null;this.isOpen=false;this.bounds={close:this.hide.bind(this),apply:this.apply.bind(this)};
this.scrollbar=new Scrollbar(this.element.getElement(".mini-thumbs-list"),{gutter:true,fixed:true,wrapStyles:{width:"100%",height:"100%"}});this.attach();
return this;},tweenStart:function(b){var c=b.retrieve("tween"),a=c.from[0].value;if(this.isOpen){this.element.getParent(".galleries-content-container").removeClass("overflow-visible").addClass("overflow-hidden");
}},tweenComplete:function(b){var c=b.retrieve("tween"),a=c.to[0].value;if(a==0){this.isOpen=true;}else{this.isOpen=false;}if(this.isOpen){this.element.getParent(".galleries-content-container").removeClass("overflow-hidden").addClass("overflow-visible");
}},attach:function(){this.closeButton.addEvent("click",this.bounds.close);this.applyButton.addEvent("click",this.bounds.apply);return this;},detach:function(){this.closeButton.removeEvent("click",this.bounds.close);
this.applyButton.removeEvent("click",this.bounds.apply);return this;},getOrder:function(){return this.sortable.serialize(function(a){return a.get("data-id");
});},setID:function(a){this.id=a;return this;},load:function(){this.cleanList();this.getSingle();return this;},apply:function(){this.order(this.getOrder());
return this;},show:function(){this.element.tween("right",0);return this;},hide:function(){this.element.tween("right",-100);return this;},cleanList:function(){this.element.getElement(".mini-thumbs-list").removeClass("empty").empty();
}});this.GalleriesManager=new Class({Extends:Galleries,options:{required:["name"],onGet:function(a){this.autodelete=a.payload.delete_slices.toInt()||false;
window.Popup.popup.getElement(".button.ok").setStyle("display","block");this.statusBar.getElement(".loading").setStyle("display","none");this.content=window.Popup.content;
this.defaultValue=this.content.getElement("#gallery-name").get("value");this.galleries=a.payload.galleries;this.manualOrder=new GalleryOrder({url:this.options.url});
this.manualButton=this.content.getElement(".manual-order-gallery");this.manualWrapper=this.content.getElement(".manual-order-wrapper");var b=this.content.getElement("#fixed-gallery").get("value");
this.fixedGallery=(b=="false"||b==false||b=="0"||b==0)?false:true;this.publishButton=this.content.getElement(".publish-gallery");this.basedOn=this.content.getElement(".button.base-on-gallery").removeEvents().setStyle("display","none");
this.publishButton.removeEvents().setStyle("display","none");this.manualButton.removeEvents();this.manualWrapper.setStyle("display","none");this.manualButton.addEvent("click",this.manualAction.bind(this));
this.publishButton.addEvent("click",this.publishAction.bind(this));this.basedOn.addEvent("click",this.basedOnAction.bind(this));this.build();},onBeforeCreate:function(){this.statusBar.getElement(".loading").setStyle("display","block");
},onCreate:function(b){this.statusBar.getElement(".loading").setStyle("display","none");var c=b.payload.gallery;var a=new Element("li[data-id="+c.id+"]").set("html","<span>"+c.name+"</span>");
a.store("data",c);a.inject(this.content.getElement(".galleries-list ul"));this.galleriesList.push(a);this.attachGalleries(a);window.Popup.setPopup({type:"success"});
window.Popup.select(c.id,c.name,"gallery_id");},onBeforeUpdate:function(){this.statusBar.getElement(".loading").setStyle("display","block");},onUpdate:function(b){this.statusBar.getElement(".loading").setStyle("display","none");
var c=b.payload.gallery;var a=this.content.getElement("li[data-id="+c.id+"]"),d=this.content.getElement(".galleries-list .title");a.set("html","<span>"+c.name+"</span>");
d.set("text",c.name);a.store("data",c);window.Popup.setPopup({type:"success"});window.Popup.select(c.id,c.name,"gallery_id");},onPublish:function(a){window.Popup.setPopup({type:"success"});
(function(){window.Popup.setPopup({type:""});}).delay(2000);},onDelete:function(d){var f=d.payload.id,c=this.content.getElement("li[data-id="+f+"]");this.galleriesList.erase(c);
c.dispose();this.galleriesList[0].fireEvent("click");var e=document.getElement("#file-edit .file-gallery-list ul");if(e){var b=e.getElement("li[data-key="+f+"]");
if(b){b.dispose();}RokGallery.editPanel.setGalleries();}var a=document.getElement(".filters-gallery-list ul li[data-key="+f+"]");if(a){a.dispose();}window.Popup.setPopup({type:"success"});
(function(){window.Popup.setPopup({type:""});}).delay(2000);},onError:function(a,b){this.statusBar.getElement(".loading").setStyle("display","none");window.Popup.setPopup({type:"warning"});
if(b=="get"){window.Popup.content.set("html",'<div class="error"><p>'+a+"</p></div>");}else{this.galleriesInfo.set("text",a);}}},initialize:function(b,a){this.parent(a);
this.element=document.id(b)||document.getElement(b)||null;if(!this.element){this.open();}else{this.element.addEvent("click",function(c){c.stop();this.open();
}.bind(this));}this.properties={};this.id=null;},build:function(){this.inputs=this.content.getElements("input");this.galleriesList=this.content.getElements(".galleries-dropdown li");
this.saveButton=this.statusBar.getElement(".button.ok");this.saveButton.addEvent("click",this.saveAction.bind(this));this.storeGalleries();this.attachGalleries();
this.updateProps();this.AspectAndForce();var b=this.content.getElement("#load-gallery");if(b){var c=b.get("value");var a=this.galleriesList.filter(function(d){return d.get("data-id")==c;
});if(a.length){a[0].fireEvent("click");}}},storeGalleries:function(){this.galleries.each(function(b){var a=this.content.getElement("li[data-id="+b.id+"]");
if(a){a.store("data",b);}},this);},attachGalleries:function(b){var a;a=(!b)?this.galleriesList:b;a=Array.from(a);a.forEach(function(c){c.removeEvents("click");
c.addEvent("click",function(){var d=c.retrieve("data");this.id=c.get("data-id");this.manualOrder.setID(this.id);this.content.getElement(".galleries-list").addClass("rokhidden");
this.content.getElement(".galleries-list .title").set("text",(d)?d.name:c.get("text"));document.addEvent("mousemove:once",function(){this.content.getElement(".galleries-list").removeClass("rokhidden");
}.bind(this));if(!d&&!this.id){this.manualWrapper.setStyle("display","none");this.publishButton.setStyle("display","none");this.basedOn.setStyle("display","none");
this.id=null;this.manualOrder.hide();this.resetInputs();return;}this.manualWrapper.setStyle("display","block");this.publishButton.setStyle("display","block");
this.basedOn.setStyle("display","block");this.manualOrder.load();this.updateInputs(c.retrieve("data"));}.bind(this));},this);},manualAction:function(){if(!this.id){return;
}this.manualOrder.show();},publishAction:function(){if(!this.id){return;}this.publish();},deleteAction:function(){if(!this.id){return;}var a=this.inputs.filter(function(b){return b.get("id")=="gallery-delete_slices";
},this);if(a.length){a=a[0].get("checked");}else{a=false;}this["delete"](a);},basedOnAction:function(){var a=this.content.getElement("li[data-id="+this.id+"]").retrieve("data");
this.galleriesList[0].fireEvent("click");this.updateInputs(a);this.content.getElement("#gallery-name").set("value","");this.id=null;this.manualOrder.setID(this.id);
},updateProps:function(){this.inputs.each(function(a){if(a.get("type")=="rokhidden"){return;}var b=a.get("id").replace(/^gallery\-/,"");this.properties[b]={value:(a.get("type")=="checkbox")?a.get("checked"):a.get("value"),input:a};
},this);},AspectAndForce:function(){var a=this.content.getElement("#gallery-keep_aspect"),b=this.content.getElement("#gallery-force_image_size");if(this.fixedGallery){a.set("disabled","disabled").set("checked","");
b.set("disabled","disabled").set("checked","checked");return;}a.removeEvents("click").addEvent("click",function(){if(a.get("checked")){b.set("checked","").set("disabled","disabled");
}else{b.set("disabled","");}});b.removeEvents("click").addEvent("click",function(){if(b.get("checked")){a.set("checked","").set("disabled","disabled");
}else{a.set("disabled","");}});},checkAspectAndForce:function(){var a=this.content.getElement("#gallery-keep_aspect"),b=this.content.getElement("#gallery-force_image_size");
if(this.fixedGallery){a.set("disabled","disabled").set("checked","");b.set("disabled","disabled").set("checked","checked");return;}if(a.get("checked")){b.set("checked","").set("disabled","disabled");
}if(b.get("checked")){a.set("checked","").set("disabled","disabled");}if(!b.get("checked")&&!a.get("checked")){b.set("disabled","");a.set("disabled","");
}},updateInputs:function(a){this.resetInputs();Object.forEach(a,function(d,c){var b=this.content.getElement("#gallery-"+c);if(b){if(b.get("type")=="rokhidden"){return;
}if(b.get("type")=="checkbox"){b.set("checked",d);}else{if(typeOf(d)=="array"){d=(d.length)?d.join(", "):"";}b.set("value",d);}}},this);this.checkAspectAndForce();
},resetInputs:function(){this.inputs.each(function(a){if(a.get("type")=="rokhidden"){return;}if(a.get("type")=="checkbox"){a.set("checked",(a.get("id")=="gallery-auto_publish")?true:false);
}else{a.set("value",(a.get("id")=="gallery-name")?this.defaultValue:"");}},this);this.checkAspectAndForce();},getProps:function(){var a={};Object.forEach(this.properties,function(d,b){var c=d.value;
if(b=="filetags"){c=c.clean().replace(/,\s/,",");c=c.length?c.split(","):[];}a[b]=c;},this);return a;},getOrder:function(){if(!this.manualOrder.sortable){return[];
}return this.manualOrder.sortable.serialize(function(a){return a.get("data-id");});},open:function(){var a=window.Popup.popup.getElement(".galleries-info");
this.galleriesInfo=a||new Element("div.galleries-info").inject(window.Popup.popup.getElement(".statusbar .clr"),"before");this.popup({type:"",title:"Galleries Manager",message:'<div class="galleries-loading">Retrieving list of Galleries...</div>'});
this.statusBar=window.Popup.statusBar;this.statusBar.getElement(".loading").setStyle("display","block");window.Popup.popup.getElement(".button.ok").setStyle("display","none");
this.get();this.isOpen=true;},close:function(){this.statusBar.getElement(".loading").setStyle("display","none");window.Popup.popup.getElement(".button.ok").setStyle("display","none");
this.isOpen=false;},saveAction:function(){this.galleriesInfo.set("text","");window.Popup.setPopup({type:""});this.statusBar.getElement(".loading").setStyle("display","block");
this.updateProps();var a=this.checkRequired();if(a){if(this.id){this.update(this.getProps(),this.getOrder());}else{this.create(this.getProps());}}},checkRequired:function(){this.statusBar.getElement(".loading").setStyle("display","none");
var a=true;this.options.required.forEach(function(e){if(!this.properties[e].value){a=false;var b=this.properties[e].input,c=b.getPrevious("label"),d="#ed2e26";
c.set("tween",{duration:350,link:"chain",transition:"quad:out"});b.set("tween",{duration:350,link:"chain",transition:"quad:out"});c.tween("color",d).tween("color","#888").tween("color",d).tween("color","#888");
b.tween("border-color",d).tween("border-color","#ddd").tween("border-color",d).tween("border-color","#ddd");}},this);return a;},popup:function(a){var b={type:"warning",title:"Galleries Manager - Error",message:"",buttons:{ok:{show:true,label:"save"},cancel:{show:true,label:"close"}}};
window.Popup.setPopup(Object.merge(b,a)).open();}});this.GallerySort=new Class({Extends:Sortables,options:{onStart:function(a,b){if(!this.placeholder){this.placeholder=new Element("li",{"class":"mini-thumb-placeholder",styles:{opacity:0,width:0}});
this.placeholderOut=new Element("li",{"class":"mini-thumb-placeholder out",styles:{opacity:0,width:0}});$$(this.placeholder,this.placeholderOut).store("size",{x:70,y:70}).set("tween",{duration:200,transition:"expo:in:out",link:"cancel"});
this.placeholder.setStyle("width",this.placeholder.retrieve("size").x);}this.placeholder.inject(a,"before");b.setStyles({"z-index":2,opacity:0.55});a.setStyle("display","none").inject(document.body);
}},insert:function(d,c){var b="inside";if(this.lists.contains(c)){this.list=c;this.drag.droppables=this.getDroppables();}else{b=this.placeholder.getAllPrevious("[class!=mini-thumb-placeholder]").contains(c)?"before":"after";
}var a=this.placeholder.retrieve("location");if(!a||a.element!=c||a.where!=b){this.placeholder.store("location",{element:c,where:b});this.placeholderOut.setStyle("width",this.placeholder.retrieve("size").x).inject(this.placeholder,b).tween("width",0);
this.placeholder.setStyle("width",0).inject(c,b).tween("width",this.placeholder.retrieve("size").x).retrieve("tween").chain(function(){}.bind(this));}this.fireEvent("sort",[this.element,this.clone]);
},end:function(){var b=this.element;this.drag.detach();this.element.setStyle("display","inline-block").set("opacity",this.opacity);if(this.placeholder){this.element.setStyle("opacity",0).inject(this.placeholder,"before");
this.placeholder.dispose();this.placeholderOut.dispose();}if(this.effect){var c=this.element.getStyles("width","height"),e=this.clone,d=e.computePosition(this.element.getPosition(this.clone.getOffsetParent()));
var a=function(){this.removeEvent("cancel",a);e.destroy();b.setStyle("opacity",1);};this.effect.element=e;this.effect.start({top:d.top,left:d.left,width:c.width,height:c.height,opacity:0.55}).addEvent("cancel",a).chain(a);
}else{this.clone.destroy();}this.reset();}});this.Drag.Move.implement({checkDroppables:function(){var a=this.droppables.filter(function(d,c){d=this.positions?this.positions[c]:this.getDroppableCoordinates(d);
var b=this.mouse.now;return(b.x>(d.left+(d.width/2))&&b.x<(d.right+(d.width/2))&&b.y<(d.bottom+(d.height/2))&&b.y>(d.top+(d.height/2)));},this).getLast();
if(this.overed!=a){if(this.overed){this.fireEvent("leave",[this.element,this.overed]);}if(a){this.fireEvent("enter",[this.element,a]);}this.overed=a;}}});
window.addEvent("domready",function(){window.Popup={popup:document.id("popup"),content:document.getElement(".content",true),statusBar:document.getElement(".statusbar",true),setPopup:function(){return window.Popup;
},open:function(){return window.Popup;},select:function(c,b,a){window.parent.document.getElementById("jform_params_"+a+"_id").value=c;window.parent.document.getElementById("jform_params_"+a+"_name").value=b;
window.Popup.close();},close:function(){window.parent.SqueezeBox.close();}};document.id(document.body).getElement(".statusbar .button.cancel").addEvent("click",window.Popup.close);
new GalleriesManager(null,{url:RokGallery.url});});})());