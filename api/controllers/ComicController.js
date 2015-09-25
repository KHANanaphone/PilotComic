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
				step2(comic);
			});
		}
		else {
			Comic.findOne({slug: slug}, function(err, obj){

				step2(obj);
			});
		}

		function step2(comic){

			if(!comic)
				return res.view('comic/nocomic.ejs');

			var params = {comic: comic};

			Comic.find().sort('date').exec(function(err, objs){

				params.first = objs[0].slug;
				if(params.first == comic.slug)
					params.first = null;

				params.last = objs[objs.length - 1].slug;
				if(params.last == comic.slug)
					params.last = null;

				for(var i = 0; i < objs.length; i++){

					var slug = objs[i].slug;

					if(slug == comic.slug){
						params.prev = objs[i - 1] ? objs[i - 1].slug : null;
						params.next = objs[i + 1] ? objs[i + 1].slug : null;
						break;
					}
				}

				res.view({params: params, isHome: !req.param('slug')});
			});
		}		
	},

	archive: function(req, res){

		Comic.find(function(err, obj){
			
			res.view({comics: obj});
		});	
	}
};

