/*
 * Up Arrow and Down arrow keys move between visible nodes.
 * Left arrow key on an expanded node closes the node.
 * Left arrow key on a closed or end node moves focus to the node's parent.
 * Right arrow key expands a closed node, moves to the first child of an open node, or does nothing on an end node.
 * Enter key performs the default action on end nodes.
 * TD: Typing a letter key moves focus to the next instance of a visible node whose title begins with that letter.
 * Home key moves to the top node in the tree view.
 * End key moves to the last visible node in the tree view.
 * *(asterisk) on keypad expands all nodes.
 */
$.extend(EnterpriseCode, {
    Tree: function(options){
        //Default Settings
        this.settings = {
            'selector': '#EnterpriseCodeTree',
            'css': 'EnterpriseCodeTree',
            'data': []
        };
        //If options exist, merge them with default settings
        if (options) {
            $.extend(this.settings, options);
        }
        
        //save reference to tree UL
        var tree = $(this.settings.selector);
        
        //add the role and default state attributes
        if (!$('body').is('[role]')) {
            $('body').attr('role', 'application');
        }
        //add role and class of tree
        tree.attr({'role': 'tree'}).addClass('tree');
        //set first node's tabindex to 0
        tree.find('li:eq(0)').attr('tabindex', '0');
        //set all others to -1
        tree.find('li:gt(0)').attr('tabindex', '-1');
		//anchor tags must not be in tabindex
		tree.find('a').attr('tabindex', '-1');
        //add group role and tree-group-collapsed class to all ul children
        tree.find('ul').attr('role', 'group').addClass('tree-group-collapsed');
        //add treeitem role to all li children
        tree.find('li').attr('role', 'treeitem');
        //find tree group parents
        tree.find('li:has(ul)').prepend('<img src="../images/treeContracted.gif" class="headerImg" role="presentation">').attr('aria-expanded', 'false').addClass('tree-parent tree-parent-collapsed');        
        //bind the custom events
        tree //expand a tree node
		.bind('expand', function(event){
            var target = $(event.target) || tree.find('li[tabindex=0]');
            target.removeClass('tree-parent-collapsed');
            target.children('ul').removeClass('tree-group-collapsed').slideDown(150, function(){
                target.attr('aria-expanded', 'true').children('img').attr({src: "../images/treeExpanded.gif"});
            });
        }) //collapse a tree node
		.bind('collapse', function(event){
            var target = $(event.target) || tree.find('a[tabindex=0]');
            target.addClass('tree-parent-collapsed');
            target.children('ul').slideUp(150, function(){
                target.attr('aria-expanded', 'false').children('img').attr({src: "../images/treeContracted.gif"});
                $(this).addClass('tree-group-collapsed');
            });
        }).bind('toggle', function(event){
            var target = $(event.target) || tree.find('li[tabindex=0]');
            //check if target parent LI is collapsed
            if (target.is('[aria-expanded=false]')) {
                //call expand function on the target
                target.trigger('expand');
            }
            //otherwise, parent must be expanded
            else {
                //collapse the target
                target.trigger('collapse');
            }
        }) //shift focus down one item             
		.bind('traverseDown', function(event){
            var targetLi = $(event.target) || tree.find('li[tabindex=0]');
            if (targetLi.is('[aria-expanded=true]')) {
                targetLi.children('ul').find('li').eq(0).focus();
            }
            else if (targetLi.next('li').length) {
            	targetLi.next('li').focus();
            }
            else {
            	targetLi.parents('li').next().focus();
            }
        }) //shift focus up one item
		.bind('traverseUp', function(event){
            var targetLi = $(event.target) || tree.find('li[tabindex=0]');
            if (targetLi.length) {
				if (targetLi.prev().is('[aria-expanded=true]')) {
                    targetLi.prev().find('li:visible:last').focus();
                }
                else {
					if (targetLi.prev('li').length) {
                    	targetLi.prev('li').focus();
                	}
                	else {
                    	targetLi.parent('ul').parent('li').focus();
                	}                   
                }
            }
            else {
                targetLi.parents('li:eq(0)').focus();
            }
        }) //shift focus home
		.bind('goHome', function(event){
            var target = $(event.target) || tree.find('a[tabindex=0]');
            tree.find('a').eq(0).focus();
        })//shift focus to last
		.bind('goEnd', function(event){
            var target = $(event.target) || tree.find('a[tabindex=0]');
            tree.find('a').eq(-1).focus();
        }) //expand all   
		.bind('expandAll', function(event){
    		tree.find('li:has(ul)').attr('aria-expanded', 'true').find('>a').removeClass('tree-parent-collapsed').next().removeClass('tree-group-collapsed');
		});           
        //native events
        tree.focus(function(event){
            //deactivate previously active tree node, if one exists
            tree.find('[tabindex=0]').attr('tabindex', '-1').removeClass('tree-item-active');
            //assign 0 tabindex to focused item
            $(event.target).attr('tabindex', '0').addClass('tree-item-active');
        }).click(function(event){
            //save reference to event target's anchor
            var target = $(event.target).closest('li');
            //check if target is a tree node
            if (target.is('li.tree-parent')) {
                target.trigger('toggle');
                target.eq(0).focus();
            }
        }).keydown(function(event){
            var target = tree.find('li[tabindex=0]');
            //check for arrow keys
            if (event.keyCode == EnterpriseCode.keyCode.RIGHT || event.keyCode == EnterpriseCode.keyCode.LEFT || event.keyCode == EnterpriseCode.keyCode.DOWN || event.keyCode == EnterpriseCode.keyCode.UP) {
                //if key is left arrow and list is collapsed
                if (event.keyCode == EnterpriseCode.keyCode.LEFT && target.is('[aria-expanded=true]')) {
                    target.trigger('collapse');
                }
                //if key is right arrow and list is collapsed
                if (event.keyCode == EnterpriseCode.keyCode.RIGHT && target.is('[aria-expanded=false]')) {
                    target.trigger('expand');
                }
                //if key is up arrow
                if (event.keyCode == EnterpriseCode.keyCode.UP) {
                    target.trigger('traverseUp');
                }
                //if key is down arrow
                if (event.keyCode == EnterpriseCode.keyCode.DOWN) {
                    target.trigger('traverseDown');
                }
            }
            //Home goes to first node in the tree
            else if (event.keyCode == EnterpriseCode.keyCode.HOME) {
            	target.trigger('goHome');
            }
            //End goes to last visible node in the tree
            else if (event.keyCode == EnterpriseCode.keyCode.END) {
                target.trigger('goEnd');
            }
            //check if enter or space was pressed on a tree node
	        else if ((event.keyCode == EnterpriseCode.keyCode.ENTER || event.keyCode == EnterpriseCode.keyCode.SPACE) && target.is('tree-parent')) {
	            target.trigger('toggle');
	        }
			//If * is pressed, expand all the nads
            else if (event.keyCode == EnterpriseCode.keyCode.EIGHT && event.shiftKey) {
            	target.trigger('expandAll');
            }          
        });
    }
});