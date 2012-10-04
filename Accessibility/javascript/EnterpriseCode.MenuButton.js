/*
 * EnterpriseCode MenuButton
 * Enter, Space, or the up or down arrow keys
	opens the menu and places focus on the first menu item in the opened menu or child menu bar.
 * At the top level, Esc key closes any sub menus and keeps focus at the top level menu.
 */
$.extend(EnterpriseCode, {    
	MenuButton: function(options){			
		//Default Settings
		var settings = {
	        'id'         : 'EnterpriseCodeMenuButton',
			'targetMenu' : null,
			'animationSpeed': 'fast',
			'offSetHt':0
	      };
		//If options exist, merge them with default settings
      	if ( options ) { 
        	$.extend( settings, options );
      	}
	
		//Public Vars
		this.$jQueryId = "#" + settings.id;
		this.$menuId = "#" + settings.targetMenu;
		this.publicSettings = settings;
		
		//Render Base Control
		if (settings.targetMenu != null)
		{
			var buttonControl = document.getElementById(settings.id);
			buttonControl.onclick = EnterpriseCode.associateObjWithEvent(this, "doOnClick");
			buttonControl.onkeydown = EnterpriseCode.associateObjWithEvent(this, "doOnKeyDown");
		}
		$(this.$jQueryId).attr("tabindex","-1").attr("role", "menuitem");
		
		//Public references to event handlers
		this.doOnClick = function (event, element){
	        this.toggle();
	    }
	    this.doOnKeyDown=function(event, element){
	        this.handleKeyDown(element, event);
	    }

		$(this.$menuId).delegate( "li", "keydown", {id:this.$jQueryId}, function(event) {
			 if (event.keyCode == EnterpriseCode.keyCode.ESCAPE || event.keyCode == EnterpriseCode.keyCode.LEFT){
				EnterpriseCode.preventDefault(event);
				$(event.data.id).focus();
				return false;
			 }
		});

		//Priviledged functions
		this.toggle = function(){ 
			this.positionMenu();
			$(this.$menuId).toggle(settings.animationSpeed);
			this.focusChild();							
		}
		
		this.handleKeyDown = function(domRef, event){
			//Enter, Space, or the up or down arrow keys
			// opens the menu and places focus on the first menu item in the opened menu or child menu bar.
			if (event.keyCode == EnterpriseCode.keyCode.SPACE || event.keyCode == EnterpriseCode.keyCode.ENTER || event.keyCode == EnterpriseCode.keyCode.DOWN) {
				EnterpriseCode.preventDefault(event); 
				this.positionMenu();
				$(this.$menuId).show(settings.animationSpeed);
				$(this.$menuId).addClass("opensubmenu");
				this.focusChild();				
			} 
			//At the top level, Esc key closes any sub menus and keeps focus at the top level menu.
			else if (event.keyCode == EnterpriseCode.keyCode.ESCAPE){
				$(this.$jQueryId).focus();
				$(this.$menuId).removeClass("opensubmenu");
				$(this.$menuId).hide(settings.animationSpeed);
			}			
		}
		
		this.focusChild = function(event) {
			var nextLink = $(this.$menuId).find('a:eq(0)');
			if (nextLink.size() > 0) {
				nextLink.focus();
			}; 		
		}
		
		//Begin priviledged functions		
		this.positionMenu = function() {
			var width = $(document).width();
            var pos = $(this.$jQueryId).offset();
            //var finalPos = $(this.$jQueryId).height(); //height for buttons was less than the actual height.
            var finalPos = $(this.$jQueryId)[0].offsetHeight;
			$(this.$menuId).css('top', pos.top + finalPos + settings.offSetHt);	
            var shift = 0;
            var total = pos.left + $(this.$menuId).width();               
            if (total > $(document).width()) {
                shift = total - $(document).width();  
            }  
		    $(this.$menuId).css({'z-index' : '3000', 'position': 'absolute', "left" : pos.left - shift});
		    this.hidePrevMenu();
		} //end function	
		
		//To hide previously opened menu when new menu is shown
		this.hidePrevMenu = function() {
		    if (EnterpriseCode.MenuButton.prevMenuId!="" && EnterpriseCode.MenuButton.prevMenuId!=this.$menuId) {		    
			    $(EnterpriseCode.MenuButton.prevMenuId).hide();
			    $(EnterpriseCode.MenuButton.prevMenuId).find('ul').removeClass("opensubmenu").hide();
			}
			EnterpriseCode.MenuButton.prevMenuId=this.$menuId;
		}
		//To enable disable menus.
		this.enableMenus = function(arrayMenus, flag) {
		    if (arrayMenus!=null && arrayMenus.length>0) {
                var len=arrayMenus.length
                for (ii=0; ii<len; ii++)
                   if (flag){                   
                     $(arrayMenus[ii]).removeAttr("disabled")
                     $(arrayMenus[ii]).find('a').removeClass("menuDisabled")                     
                   }
                   else{
                        $(arrayMenus[ii]).attr('disabled','disabled') 
                        $(arrayMenus[ii]).find('a').addClass("menuDisabled")                        
                    }                       
            }         
		}		
	}
	
	}); //End Namespace
EnterpriseCode.MenuButton.prototype = {
	closeMenu: function() {
		$(this.$menuId).hide(this.publicSettings.animationSpeed);
	}  	
};
EnterpriseCode.MenuButton.prevMenuId="";