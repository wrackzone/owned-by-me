var app = null;

Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    items:{ html:'<a href="https://help.rallydev.com/apps/2.0rc3/doc/">App SDK 2.0rc3 Docs</a>'},
    launch: function() {
        //Write app code here
        app = this;
        var currentContext = app.getContext();

		//Get the current user and project
		var user = currentContext.getUser();
		console.log("user",user.ObjectID);

		var storeConfig = {
			find : {
				"Owner" : user.ObjectID,
				"__At" : "current"
			},
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

		var grid = Ext.create('Rally.ui.grid.Grid', {

			columnCfgs: [
                            {text:'ID',dataIndex:'FormattedID'},
                            {text:'Name', dataIndex: 'Name'},
                            {text:'Type',dataIndex:'_TypeHierarchy',renderer : app.renderType}
                        ],

			store: snapshotStore

		});

		app.add(grid);
    },

    renderType : function(v) {
    	return _.last(v);
    }
});
