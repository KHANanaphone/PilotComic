/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	name: {
  		type: 'string',
  		unique: true
  	},
  	password: {
  		type: 'string'
  	},
  	admin: {
  		type: 'boolean'
  	}
  },

  findWithLoginInfo: function(name, pass, cb){

  	User.findOne({name: name, password: pass}).exec(cb);
  }
};

