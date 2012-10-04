/*
 * EnterpriseCode MenuBar
 * # Tabbing out of the menu component closes any open menus.
 */
$.extend(EnterpriseCode, {
	MenuBar: function(options){
		//private vars
		var focusedIdx = 0;
			
		//Default Settings
		var settings = {
	        'id'         : 'EnterpriseCodeMenuButton',
			'buttons' : null
	      };
		//If options exist, merge them with default settings
      	if ( options ) { 
        	$.extend( settings, options );
      	}
	
		//Public Vars
		this.$jQueryId = "#" + settings.id;
		this.buttons = settings.buttons;
			
		//Render Base Control
		if (settings.id != null)
		{
			var menuBarControl = document.getElementById(settings.id);
			menuBarControl.onkeydown = EnterpriseCode.associateObjWithEvent(this, "doOnKeyDown");
		}
		$(this.$jQueryId).attr("role", "menubar")
		$(this.buttons[0].$jQueryId).attr("tabindex", "0");
		//add the role and default state attributes
        if (!$(this.$jQueryId).parent().is('[role]')) {
            $(this.$jQueryId).parent().attr('role', 'application');
        }
		else if(!$('body').is('[role]')) {
            $('body').attr('role', 'application');
        }
		
		//Public references to event handlers
	    this.doOnKeyDown=function(event, element){
	        this.handleKeyDown(element, event);
	    }

		//Priviledged functions	
		this.nextMenuButton = function() {
			var next = $(this.buttons[focusedIdx+1]);
			if (next.length != 0) {
				$(this.buttons[focusedIdx].$jQueryId).attr("tabindex","-1");
				$(this.buttons[focusedIdx+1].$jQueryId).attr("tabindex", "0");
				$(next[0].$jQueryId).focus();
			}
		} //end function
			
		this.prevMenuButton = function() {
			var prev = $(this.buttons[focusedIdx-1]);
			if (prev.length != 0) {
				$(this.buttons[focusedIdx].$jQueryId).attr("tabindex","-1");
				$(this.buttons[focusedIdx-1].$jQueryId).attr("tabindex", "0");
				$(prev[0].$jQueryId).focus();
			}
		} //end function
		
		this.handleKeyDown = function(domRef, evt){
			//Enter, Space, or the up or down arrow keys
			// opens the menu and places focus on the first menu item in the opened menu or child menu bar.
			if (evt.keyCode == EnterpriseCode.keyCode.RIGHT) {
				this.nextMenuButton();
			} 
			//At the top level, Esc key closes any sub menus and keeps focus at the top level menu.
			else if (evt.keyCode == EnterpriseCode.keyCode.LEFT){
				this.prevMenuButton();
			}			
		}
		
		$(this.$jQueryId).delegate( "*", "focus", {id:this.$jQueryId, buttons:this.buttons}, function(event) {
			$.each(event.data.buttons, function(index, value){
				if (value.$jQueryId == "#"+event.target.id) {
					setCurrentIndex(index);
				}
			});
		} );
		
		//Private functions
		function setCurrentIndex(idx){
			focusedIdx = idx;	
		}
	}	
	}); //End Namespace
EnterpriseCode.MenuBar.prototype = {
	init: function() {
		
	}  	
};	
