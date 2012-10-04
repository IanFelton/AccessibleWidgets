/**
* @class EnterpriseCode root namespace
* @constructor
* @return The root namespace
*/
EnterpriseCode = new function(){
	/* A general function that associates an object instance with an event
	 handler. The returned inner function is used as the event handler.*/
	this.associateObjWithEvent = function(obj, methodName){
	
		/* The returned inner function is intended to act as an event
		 handler for a DOM element:-
		 */
		return (function(e){
			/* The event object that will have been parsed as the - e -
			 parameter on DOM standard browsers is normalised to the IE
			 event object if it has not been passed as an argument to the
			 event handling inner function
			 */
			e = e || window.event;
			/* The event handler calls a method of the object - obj - with
			 the name held in the string
			 */
			return obj[methodName](e, this);
		});
	}
	
	/*IE broke Jquery cross-browser event propagation disabling
	 * Call this to handle FF and IE*/
	this.preventDefault = function(event){
		if (event.preventDefault) { 
			event.preventDefault(); 
		} 
		else { 
			event.returnValue = false; 
		}
	}
	
	this.textContent= function(node){
		 return node.innerHTML;
	}
}

$.extend(EnterpriseCode,{keyCode: {
		ALT: 18,
		BACKSPACE: 8,
		CAPS_LOCK: 20,
		COMMA: 188,
		COMMAND: 91,
		COMMAND_LEFT: 91,
		COMMAND_RIGHT: 93,
		CONTROL: 17,
		DELETE: 46,
		DOWN: 40,
		EIGHT: 56, 
		END: 35,
		ENTER: 13,
		ESCAPE: 27,
		HOME: 36,
		INSERT: 45,
		LEFT: 37,
		MENU: 93, 
		NUMPAD_ADD: 107,
		NUMPAD_DECIMAL: 110,
		NUMPAD_DIVIDE: 111,
		NUMPAD_ENTER: 108,
		NUMPAD_MULTIPLY: 106,
		NUMPAD_SUBTRACT: 109,
		PAGE_DOWN: 34,
		PAGE_UP: 33,
		PERIOD: 190,
		RIGHT: 39,
		SHIFT: 16,
		SPACE: 32,
		TAB: 9,
		UP: 38,
		WINDOWS: 91
	}
});
