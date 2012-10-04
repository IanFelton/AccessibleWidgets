/*
 * EnterpriseCode Menu
 * UL's must exist already on the client
# When a menu is open and focus is on a menu item in that open menu, then
    * Enter or Space invokes that menu action (which may be to open a submenu).
    * Esc closes the open menu or submenu and returns focus to the parent menu item.
    * If the menu item with focus has a submenu, pressing 
    * Enter, Space, or the right arrow key opens the submenu and puts focus on the first submenu item. 
# When a submenu is open and focus is on a menu item in that submenu:
    * Esc or the Left Arrow key closes the submenu and returns focus to the parent menu item. 
# Typing a letter (printable character) key moves focus to the next instance of a visible node 
	whose title begins with that printable letter.
# First item in menu bar should be in the tab order (tabindex=0).
# Disabled menu items receive focus but have no action when Enter or Left Arrow/Right Arrow is pressed. 
	It is important that the state of the menu item be clearly communicated to the user.
# With focus on a menu item and a sub menu opened via mouse behavior, 
	pressing down arrow moves focus to the first item in the sub menu.
# With focus on a menu item and a sub menu opened via mouse behavior, 
	pressing up arrow moves focus to the last item in the sub menu.
# With focus on a submenu item, the user must use arrows or the Esc key to progressively close submenus 
	and move up to the parent menu item(s).
 */
$.extend(EnterpriseCode, {
	Menu: function(options){		
		//Default Settings
		var settings = {
	        'id'		: 'EnterpriseCodeMenu',
			'css'		: 'EnterpriseCodeMenu',
			'submenus'	: []
	      };
		//If options exist, merge them with default settings
      	if ( options ) { 
        	$.extend( settings, options );
      	}
	
		//Public Vars
		this.$jQueryId = "#" + settings.id;
		this.$menuItems = $(this.$jQueryId).find("li");
		this.$submenus = settings.submenus;
		$(this.$jQueryId).find("ul").attr("role", "menu");
	
		//Render Base Control
		$(this.$jQueryId).addClass(settings.css).attr("role","menu");
		$(this.$jQueryId).hide();
		var menuControl = document.getElementById(settings.id);
		menuControl.onkeydown = EnterpriseCode.associateObjWithEvent(this, "doOnKeyDown");
		menuControl.onclick = EnterpriseCode.associateObjWithEvent(this, "doOnClick");
		
		this.doOnClick = function (event, element){
	        this.handleKeyDown(element, event);
	    }
		$(this.$menuItems).each( function() {
			$(this).attr("tabindex", "-1").attr("role", "menuitem");
			if ($(this).find('ul').length>0)
			    $(this).addClass("hasSubMenu");
		});
			
		//Public references to event handlers
	    this.doOnKeyDown=function(event, element){
	        this.handleKeyDown(element, event);
	    }
		
		//Priviledged functions
		this.handleKeyDown = function(domRef, event){
			//Enter, Space, or the up or down arrow keys
			// opens the menu and places focus on the first menu item in the opened menu or child menu bar.
			if (event.keyCode == EnterpriseCode.keyCode.SPACE || event.keyCode == EnterpriseCode.keyCode.ENTER) {
				//EnterpriseCode.preventDefault(event);
				//TODO: Space invokes that menu action (which may be to open a submenu). 
			} 
			//Esc closes the open menu or submenu and returns focus to the parent menu item. 
			else if (event.keyCode == EnterpriseCode.keyCode.ESCAPE){
				EnterpriseCode.preventDefault(event);
				$(this.$jQueryId).hide();
			}
			//Up Arrow or Down Arrow keys cycle focus through the items in that menu. 
			else if (event.keyCode == EnterpriseCode.keyCode.UP)
			{
				//move focus to next item in array
				EnterpriseCode.preventDefault(event);
				this.focusPrev(event);
			}
			else if (event.keyCode == EnterpriseCode.keyCode.DOWN)
			{			
				//move focus to next item in array
				EnterpriseCode.preventDefault(event);
				this.focusNext(event);
			}
			else if (event.keyCode == EnterpriseCode.keyCode.RIGHT || event.type=="click")
			{
				EnterpriseCode.preventDefault(event);
				var ele = (event.target||event.srcElement);
				var submenu = $(ele).parent().find('ul:eq(0)');
				//Check if any other sub menu is already open. If it is hide it.
				var visiMenu = $(ele).parent().parent().find('ul:visible');
				if (visiMenu.attr('ID')!=submenu.attr('ID'))
				    visiMenu.removeClass("opensubmenu").hide();
				if (event.type=="click" && $(submenu[0]).is(":visible"))
				{
				    $(".opensubmenu:last").removeClass("opensubmenu").hide();
				}
				else if (submenu.size() > 0) {
					$(ele).parent("li").addClass("parentnode");
					$(submenu[0]).addClass("opensubmenu");
					this.positionMenu(event, submenu);
					$(submenu[0]).show();
					var nextLink = $(submenu[0]).find('a:eq(0)');
					if (nextLink.size() > 0) {
						nextLink.focus();
					}
				}
			}
			else if (event.keyCode == EnterpriseCode.keyCode.LEFT)
			{
				//This doesn't work in IE for submenus
				$(".opensubmenu:last").removeClass("opensubmenu").hide();
				$(".parentnode:last").removeClass("parentnode").find('a:eq(0)').focus();
			}
			return false;
		}
		
		this.focusNext = function(event) {
			var ele = (event.target||event.srcElement);
			var nextLink = $(ele).parent().next().find('a:eq(0)');
			if (nextLink.size() > 0) {
				nextLink.focus();
			}
			else{
				nextLink = $(".opensubmenu:last").find('a:eq(0)');
				nextLink.focus();
			}
			this.checkForSubMenu(nextLink);	
		}
		
		this.focusPrev = function(event) {
			var ele = (event.target||event.srcElement);
			var prevLink = $(ele).parent().prev().find('a:eq(0)');						
			if (prevLink.size() > 0) {
				prevLink.focus();
			}
			else{
				var idx = ($(".opensubmenu:last > li").size()) -1;
				prevLink = $(".opensubmenu:last").find('a:eq('+ idx + ')');
				prevLink.focus();
			}
			this.checkForSubMenu(prevLink);	 		
		}
		
		this.checkForSubMenu = function(el){
			var submenu = $(el).parent().find('ul:eq(0)');
			if (submenu.size() > 0) {
				$(el).parent("li").attr("aria-haspopup","true");
			}
		}
		
		this.positionMenu = function(evt, menu) {
			var ele = (evt.target||evt.srcElement);
			//var parentWidth = $(ele).parent().width();
			var parentWidth = $(ele).parent().parent()[0].clientWidth;
			//var parentHeight = $(ele).parent().height();
			var parentHeight = $(ele).parent().parent()[0].clientHeight;
            var pos = $(ele).offset();
			$("#"+menu[0].id).css({'position': 'absolute', 'top': '-'+parentHeight});	
            var total = pos.left + parentWidth;                
		    $("#"+menu[0].id).css({'z-index' : '3000', 'position': 'absolute', "left" : parentWidth});
		} //end function		
		
		this.addItem = function(listID, listText) {
		    $(this.$jQueryId).append("<li id='"+listID+"'><a href=''>"+listText+"</a></li>");
		}
		this.removeItem = function(listID) {
		    $(listID).remove();
		}
	}
	
	}); //End Namespace
	
EnterpriseCode.Menu.prototype = {
	init : function() {
		
	},
	addSubMenu: function(submenu) {
		if (this.$submenus != null) {
			this.$submenus[this.$submenus.length] = submenu;	
		}
		else
		{
			this.$submenus = [];
			this.$submenus[0] = submenu;		
		}
	}  	
};	