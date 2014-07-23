var app = null;

Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    items:{  },
    launch: function() {
        //Write app code here
        app = this;
        var currentContext = app.getContext();

		//Get the current user and project
		var user = currentContext.getUser();
		console.log("user",user.ObjectID);

		var search = Ext.create( 'Rally.ui.combobox.UserSearchComboBox', {
			project: currentContext.getProject(),
			listeners: {
				select : function(combo,records,eOpts) {
					console.log("records",records);
					app.update(records[0]);
				}
			}
		});

		app.add(search);

		var storeConfig = {
			filters: app.createFilters(currentContext,user.ObjectID),
			fetch   : ["FormattedID","Name","_TypeHierarchy"],
			hydrate : ["_TypeHierarchy"],
			autoLoad : true,
			pageSize : 10000,
			limit    : 'Infinity',
			listeners : {
				scope : this,
				load  : function(store,snapshots,success) {
					console.log(snapshots);
				}
			}
		};

		var snapshotStore = Ext.create('Rally.data.lookback.SnapshotStore', storeConfig);

		app.grid = Ext.create('Rally.ui.grid.Grid', {

			columnCfgs: [
                            {text:'ID',dataIndex:'FormattedID'},
                            {text:'Name', dataIndex: 'Name'},
                            {text:'Type',dataIndex:'_TypeHierarchy',renderer : app.renderType}
                        ],

			store: snapshotStore

		});

		app.add(app.grid);
    },

    update : function( user ) {
    	console.log("Filter to user:" + user.get("UserName") + " : " + user.get("ObjectID"));
    	app.grid.store.clearFilter(true);
    	var filters = app.createFilters(app.getContext(), user.get("ObjectID"));
		app.grid.store.filter( filters );
    },

    createFilters : function(ctx, userID) {
    	return [
				{
					property: "_ProjectHierarchy",
					operator : "in",
					value : [ctx.getProject().ObjectID]
				},
		        {
		            property: 'Owner',
		            operator: '=',
		            value: userID
		        },
                {
		            property: '__At',
		            operator: '=',
		            value: "current"
		        }
    	];
    },

    renderType : function(v) {
    	return _.last(v);
    }
});
