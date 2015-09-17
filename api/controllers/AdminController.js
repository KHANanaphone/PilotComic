/**
 * AdminController
 *
 * @description :: Server-side logic for managing admins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	login: function(req, res){

		if(req.body){

			var user = req.body.username;
			var pass = req.body.password;
			User.findWithLoginInfo(user, pass, function(err, usr){

				if(usr && usr.admin){
					req.session.authed = true;
					res.redirect('/admin');
				}		
				else
					res.view({error: 'Invalid username or password'});
			});
		}
		else
			res.view();
	},

	index: function(req, res){

		if(!authCheck(req, res))
			return;

		Comic.find(function(err, obj){

			res.view({comics: obj});
		});
	},


	new: function(req, res){

		if(!authCheck(req, res))
			return;

		if(req.body)
			return checkAndSave(req, res, true);
		
		res.view();
	},

	edit: function(req, res){

		if(!authCheck(req, res))
			return;

		if(req.body)
			return checkAndSave(req, res, false);

		var slug = req.param('slug');

		Comic.findOne({slug: slug}).exec(function(err, comic){

			if(!comic)
				res.redirect('/admin');
			else
				res.view({comic: comic});
		});
	}
};

function checkAndSave(req, res, isNew){

	var file = req.file('comic');

	var comic = {
		title: req.param('title'),
		slug: req.param('slug'),
		date: isNew ? new Date() : req.param('date'),
		comment: req.param('comment')
	};

	if(!comic.title)
		res.view({
			comic: comic,
			error: 'A title is required.'
		});
	else if(!comic.slug)
		res.view({
			comic: comic,
			error: 'A valid slug is required. (Add letters or characters to the title)'
		});
	else if(isNew)
		Comic.findOne({slug: comic.slug}, function(err, obj){

			if(obj)
				res.view({
					comic: comic,
					error: 'This has the same slug as a different comic, choose a different one.'
				});
			else
				saveComic(comic, file, res, isNew);							
		});	
	else
		saveComic(comic, file, res, isNew);
};

function saveComic(comic, file, res, isNew){

	var path = require('path');
	var dir = path.resolve(sails.config.appPath, 'static/__comics')

	var uploadOptions = {
		dirname: dir,
		saveAs: function(file, cb){
			var name = comic.slug + path.extname(file.filename);
			console.log('saving as ' + dir + '/' + name);
			comic.url = '/__comics/' + name;
			cb(null, name);
		}
	};

	file.upload(uploadOptions, function(err, files){

		if(isNew)
			Comic.create(comic, cb);
		else
			Comic.update({slug: comic.slug}, comic, cb);
	});

	function cb(err, obj){

		res.redirect('/comics/' + comic.slug);
	};
};

function authCheck(req, res){

	if(!req.session.authed){
		res.redirect('/admin/login');
		return false;
	}
	return true;	
};
