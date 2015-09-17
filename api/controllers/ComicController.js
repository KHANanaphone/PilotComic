/**
 * ComicController
 *
 * @description :: Server-side logic for managing comics
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	view: function(req, res){

		var slug = req.param('slug');

		if(!slug){
			Comic.find().limit(1).exec(function(err, obj){

				var comic = obj.length > 0 ? obj[0] : null;
				res.view({comic: comic});
			});
		}
		else {
			Comic.findOne({slug: slug}, function(err, obj){

				res.view({comic: obj});
			});
		}		
	},

	archive: function(req, res){

		return res.send('TDB archive');		
	}
};

