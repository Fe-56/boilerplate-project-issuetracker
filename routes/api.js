'use strict';

const database = require('../database.js');

module.exports = function (app) {

  app.route('/api/issues/:project')
    .get(async function (req, res){
      let project = req.params.project;
      let filters = req.query;
      const array = await database.getAllIssues(project, filters);           
      res.send(array);
    })
    
    .post(async function (req, res){
      let project = req.params.project;
      let issueTitle = req.body.issue_title;
      let issueText = req.body.issue_text;
      let createdBy = req.body.created_by;
      let assignedTo = req.body.assigned_to;
      let statusText = req.body.status_text;
      let json;

      if (issueTitle == null || issueText == null || createdBy == null
         || issueTitle === "" || issueText === "" || createdBy === ""){ // if there are any missing required field(s)
        json = {
          error: 'required field(s) missing'
        }
      }
      else{
        json = await database.addIssue(project, issueTitle, issueText, createdBy, assignedTo, statusText);
      }
      
      res.json(json);
    })
    
    .put(async function (req, res){
      let project = req.params.project;
      let id = req.body._id;
      let issueTitle = req.body.issue_title;
      let issueText = req.body.issue_text;
      let createdBy = req.body.created_by;
      let assignedTo = req.body.assigned_to;
      let statusText = req.body.status_text;
      let open = req.body.open;
      let json;

      if (id === '' || id == null){
        json = {
          error: 'missing _id'
        };
      }
      else if (
        (issueTitle === '' || issueTitle == null) &&
        (issueText === '' || issueText == null) &&
        (createdBy === '' || createdBy == null) &&
        (assignedTo === '' || assignedTo == null) &&
        (statusText === '' || statusText == null) &&
        (open === '' || open == null)
      ){
        json = {
          error: 'no update field(s) sent',
          _id: id
        };
      }
      else{
        open = (open == null) ? true : false;
        json = await database.updateIssue(project, id, issueTitle, issueText, createdBy, assignedTo, statusText, open);
      }
      res.json(json);
    })
    
    .delete(async function (req, res){
      let project = req.params.project;
      let id = req.body._id;
      let json;

      if (id == null){
        json = {
          error: 'missing _id'
        };
      }
      else{
        json = await database.deleteIssue(id);
      }
      
      res.json(json);
    });
};
