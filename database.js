const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGO_URL;
var ObjectId = require('mongodb').ObjectId; 

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function getCollection() {
    client.connect((error) => {
      if (error){
        return console.error(error);
      }
    });
    const collection = client.db("freeCodeCamp").collection("issueTracker");
    return collection;
};

async function addIssue(projectName, issueTitle, issueText, createdBy, assignedTo, statusText){
  const collection = getCollection();
  const timeNow = new Date();
  const issue = {
    projectName: projectName,
    issueTitle: issueTitle,
    issueText: issueText,
    createdBy: createdBy,
    assignedTo: assignedTo == null ? "" : assignedTo,
    statusText: statusText == null ? "" : statusText,
    createdOn: timeNow,
    updatedOn: timeNow,
    open: true,
  };
  await collection.insertOne(issue, (error, res) => {
    if (error){
      console.error(error);
      return {
        error: error
      };
    }
  });
  return {
    issue_title: issue.issueTitle,
    issue_text: issue.issueText,
    created_by: issue.createdBy,
    assigned_to: issue.assignedTo,
    status_text: issue.statusText,
    created_on: issue.createdOn,
    updated_on: issue.updatedOn,
    open: issue.open,
    _id: issue._id
  };
};

async function getAllIssues(projectName, filters){
  const collection = getCollection();
  let query = {
    projectName: projectName
  }

  if (Object.hasOwn(filters, "open")){
    if (filters.open.toLowerCase() === "true" || filters.open.toLowerCase() === "false"){
      query.open = (filters.open.toLowerCase() === "true");
    }
  }

  if (Object.hasOwn(filters, "created_on")){
    if (!isNaN(new Date(filters.created_on))){ // if a valid date is provided for createdOn
      query.createdOn = new Date(filters.created_on);
    }
  }

  if (Object.hasOwn(filters, "updated_on")){
    if (!isNaN(new Date(filters.updated_on))){ // if a valid date is provided for createdOn
      query.updatedOn = new Date(filters.updated_on);
    }
  }

  if (Object.hasOwn(filters, "_id")){
    query._id = new ObjectId(filters._id);
  }

  if (Object.hasOwn(filters, "project")){
    query.projectName = filters.project;
  }

  if (Object.hasOwn(filters, "issue_title")){
    query.issueTitle = filters.issue_title;
  }

  if (Object.hasOwn(filters, "issue_text")){
    query.issueText = filters.issue_text;
  }

  if (Object.hasOwn(filters, "created_by")){
    query.createdBy = filters.created_by;
  }

  if (Object.hasOwn(filters, "assigned_to")){
    query.assignedTo = filters.assigned_to;
  }

  if (Object.hasOwn(filters, "status_text")){
    query.statusText = filters.status_text;
  }

  const rawResult = await collection.find(query).toArray();
  const output = rawResult.map((item) => {
    return {
      _id: item._id,
      issue_title: item.issueTitle,
      issue_text: item.issueText,
      created_on: item.createdOn,
      updated_on: item.updatedOn,
      created_by: item.createdBy,
      assigned_to: item.assignedTo,
      open: item.open,
      status_text: item.statusText
    }
  });
  return output;
}

async function updateIssue(project, id, issueTitle, issueText, createdBy, assignedTo, statusText, open){
  let output;
  const collection = getCollection();
  let query;
  
  try{
    query = {
      _id: new ObjectId(id)
    }
  }
  catch (error){
    console.error(error);
    return {
        error: 'could not update',
        _id: id
      }
  }
  
  let object = {};

  if (typeof issueTitle != 'undefined' && issueTitle != ''){
    object.issueTitle = issueTitle;
  }

  if (typeof issueText != 'undefined' && issueText != ''){
    object.issueText = issueText;
  }

  if (typeof createdBy != 'undefined' && createdBy != ''){
    object.createdBy = createdBy;
  }

  if (typeof assignedTo != 'undefined' && assignedTo != ''){
    object.assignedTo = assignedTo;
  }

  if (typeof statusText != 'undefined' && statusText != ''){
    object.statusText = statusText;
  }

  object.open = open;
  object.updatedOn = new Date();
  const update = {
    $set: object
  };
  const existingIssue = (await collection.findOne(query) == null) ? false : true;
  
  if (existingIssue){
    await collection.findOneAndUpdate(query, update)
      .then(output = {
          result: 'successfully updated',
          _id: id
      })
      .catch((error) => {
        console.error(error);
        output = {
          error: 'could not update',
          _id: id
        }
      });
  }
  else{
    output = {
      error: 'could not update',
      _id: id
    }
  }

  return output;
}

async function deleteIssue(id){
  const collection = getCollection();
  let query;

  try{
    query = {
      _id: new ObjectId(id)
    };
  }
  catch (error){
    console.error(error);
    return {
      error: 'could not delete',
      _id: id
    }
  }

  const existingIssue = (await collection.findOne(query) == null) ? false : true;
  let output;
  
  if (existingIssue){
    await collection.findOneAndDelete(query)
      .then(output = {
        result: 'successfully deleted',
        _id: id
      })
      .catch((error) => {
        console.error(error);
        output = {
          error: 'could not delete',
          _id: id
        }
      });
  }
  else{
    output = {
      error: 'could not delete',
      _id: id
    }
  }

  return output;
}

module.exports = {
  addIssue,
  getAllIssues,
  updateIssue,
  deleteIssue
};