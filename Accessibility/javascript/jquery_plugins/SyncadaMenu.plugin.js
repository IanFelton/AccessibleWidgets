(function( $ ){
	//Public methods  
	var methods = {
	    init : function( options ) {  
			//Default Settings
			var settings = {
				'css': 'EnterpriseCodeMenu'
		      };
			return this.each(function() {
				//If options exist, merge them with default settings
			  	if ( options ) { 
			    	$.extend( settings, options );
			  	}
				//Public Vars
				var $menuItems = $(this).find("li");
	
				//Render Base Control
				$(this).addClass(settings.css).attr("role","menu");
				$(this).hide();
				var menuControl = document.getElementById(this.id);
				menuControl.onclick = EnterpriseCode.associateObjWithEvent(this, "doOnClick");
				menuControl.onkeydown = EnterpriseCode.associateObjWithEvent(this, "doOnKeyDown");
				
				//Public references to event handlers
				this.doOnClick = function (event, element){
			        //this.handleClick(element, event);
			    }
			    this.doOnKeyDown=function(event, element){
			        handleKeyDown(element, event);
			    }
				
				$($menuItems).each( function() {
					$(this).attr("tabindex", "-1").attr("role", "menuitem");			
				});
			});		
		}
		};
		//Private methods
		//Priviledged functions
		this.handleKeyDown = function(domRef, evt){
			//Enter, Space, or the up or down arrow keys
			// opens the menu and places focus on the first menu item in the opened menu or child menu bar.
			if (evt.keyCode == EnterpriseCode.keyCode.SPACE || evt.keyCode == EnterpriseCode.keyCode.ENTER) {
				EnterpriseCode.preventDefault(evt);
				//Enter or Space invokes that menu action (which may be to open a submenu). 
			} 
			//Esc closes the open menu or submenu and returns focus to the parent menu item. 
			else if (evt.keyCode == EnterpriseCode.keyCode.ESCAPE){
				EnterpriseCode.preventDefault(evt);
				$(this.$jQueryId).hide();
			}
			//Up Arrow or Down Arrow keys cycle focus through the items in that menu. 
			else if (evt.keyCode == EnterpriseCode.keyCode.UP)
			{
				//evt.preventDefault();
				//remove focused class of selected item
				
				//move focus to next item in array
				this.focusPrev(evt);
				//if last item, return to top	
			}
			else if (evt.keyCode == EnterpriseCode.keyCode.DOWN)
			{
				//remove focused class of selected item				
				//move focus to next item in array
				this.focusNext(evt);
				//if last item, return to top
			}
			else if (evt.keyCode == EnterpriseCode.keyCode.RIGHT)
			{
				EnterpriseCode.preventDefault(evt);
				var submenu = $(evt.target).parent().find('ul:eq(0)');
				if (submenu.size() > 0) {
					$(evt.target).parent("li").addClass("parentnode");
					$(submenu[0]).addClass("opensubmenu");
					this.positionMenu(evt, submenu);
					$(submenu[0]).show();
					var nextLink = $(submenu[0]).find('a:eq(0)');
					if (nextLink.size() > 0) {
						nextLink.focus().select();
					}
				}
			}
			else if (evt.keyCode == EnterpriseCode.keyCode.LEFT)
			{
				var innerMenu = $(".opensubmenu:last").removeClass("opensubmenu").hide();
				var parentLInk = $(".parentnode:last").removeClass("parentnode").find('a:eq(0)').focus().select();
			}	
					
		}
		
		this.focusNext = function(event) {
			
			var nextLink = $(event.target).parent().next().find('a:eq(0)');
			if (nextLink.size() > 0) {
				nextLink.focus().select();
			}
			else{
				nextLink = $(".opensubmenu:last").find('a:eq(0)');
				nextLink.focus();
				nextLink.select();
			}
			this.checkForSubMenu(nextLink);	
		}
		
		this.focusPrev = function(event) {
			var prevLink = $(event.target).parent().prev().find('a:eq(0)');						
			if (prevLink.size() > 0) {
				prevLink.focus().select();
			}
			else{
				var idx = ($(".opensubmenu:last > li").size()) -1;
				prevLink = $(".opensubmenu:last").find('a:eq('+ idx + ')');
				prevLink.focus().select();
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
			var parentWidth = $(evt.target).width();
			var parentHeight = $(evt.target).height();
            var pos = $(evt.target).offset();
			$("#"+menu[0].id).css({'position': 'absolute', 'top': '-'+parentHeight});	
            var total = pos.left + parentWidth;                
		    $("#"+menu[0].id).css({'z-index' : '3000', 'position': 'absolute', "left" : parentWidth});
		} //end function

  
$.fn.EnterpriseCodeMenu = function(method) {
	// Method calling logic
    if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.EnterpriseCodeMenu' );
    }
};
})( jQuery );

