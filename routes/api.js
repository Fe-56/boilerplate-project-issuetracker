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

      if (issueTitle == null || issueText == null || createdBy == null){ // if there are any missing required field(s)
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

      if (id == null){
        res.json({
          error: 'missing _id'
        }) ;
      }
      else if (Object.keys(req.body).length < 2){
        res.json({
            error: 'no update field(s) sent',
            _id: id
        });
      }
      else{
        json = await database.updateIssue(project, id, issueTitle, issueText, createdBy, assignedTo, statusText, open);
        res.json(json);
      }
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      
    });
    
};
