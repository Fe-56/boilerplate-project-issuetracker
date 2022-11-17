const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const expect = chai.expect;

chai.use(chaiHttp);

const time = 4000;
let sampleId;

suite('Functional Tests', function() {
  test('Create an issue with every field: POST request to /api/issues/{project}', (done) => {
    chai
      .request(server)
      .post('/api/issues/project123')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({
        issue_title: "Title 1",
        issue_text: "Text 1",
        created_by: "Fuo En 1",
        assigned_to: "John Cena 1",
        status_text: "Status 1",
      })
      .end(function (err, res) {
        assert.deepEqual(res.status, 200);
        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal({
          "issue_title": "Title 1",
          "issue_text": "Text 1",
          "created_by": "Fuo En 1",
          "assigned_to": "John Cena 1",
          "status_text": "Status 1",
          "created_on": res.body.created_on,
          "updated_on": res.body.updated_on,
          "open": true,
          "_id": res.body._id
        });
        done();
      });
  });

  test('Create an issue with only required fields: POST request to /api/issues/{project}', (done) => {
    chai
      .request(server)
      .post('/api/issues/project123')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({
        issue_title: "Title 2",
        issue_text: "Text 2",
        created_by: "Fuo En 2"
      })
      .end(function (err, res) {
        assert.deepEqual(res.status, 200);
        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal({
          "issue_title": "Title 2",
          "issue_text": "Text 2",
          "created_by": "Fuo En 2",
          "assigned_to": "",
          "status_text": "",
          "created_on": res.body.created_on,
          "updated_on": res.body.updated_on,
          "open": true,
          "_id": res.body._id
        });
        done();
      });
  });

  test('Create an issue with missing required fields: POST request to /api/issues/{project}', (done) => {
    chai
      .request(server)
      .post('/api/issues/project123')
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({
        issue_title: "",
        issue_text: "",
        created_by: ""
      })
      .end(function (err, res) {
        assert.deepEqual(res.status, 200);
        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal({
          error: 'required field(s) missing'
        });
        done();
      });
  });

  test('View issues on a project: GET request to /api/issues/{project}', function (done){
    this.timeout(time);

    chai
      .request(server)
      .get('/api/issues/project123')
      .end(function (err, res) {
        assert.deepEqual(res.status, 200);
        expect(res.status).to.equal(200);
        expect(res.body).is.a('array');
        expect(res.body[0]).to.have.property('_id');
        expect(res.body[0]).to.have.property('issue_title');
        expect(res.body[0]).to.have.property('issue_text');
        expect(res.body[0]).to.have.property('created_by');
        expect(res.body[0]).to.have.property('assigned_to');
        expect(res.body[0]).to.have.property('status_text');
        expect(res.body[0]).to.have.property('open');
        expect(res.body[0]).to.have.property('created_on');
        expect(res.body[0]).to.have.property('updated_on');
        sampleId = res.body[0]._id;
        done();
      });
  });

  test('View issues on a project with one filter: GET request to /api/issues/{project}', function (done){
    this.timeout(time);

    chai
      .request(server)
      .get('/api/issues/project123?assigned_to=John Cena 1')
      .end(function (err, res) {
        assert.deepEqual(res.status, 200);
        expect(res.status).to.equal(200);
        expect(res.body).is.a('array');
        expect(res.body[0]).to.have.property('_id');
        expect(res.body[0]).to.have.property('issue_title');
        expect(res.body[0]).to.have.property('issue_text');
        expect(res.body[0]).to.have.property('created_by');
        expect(res.body[0]).to.have.property('assigned_to');
        expect(res.body[0].assigned_to).to.equal('John Cena 1');
        expect(res.body[0]).to.have.property('status_text');
        expect(res.body[0]).to.have.property('open');
        expect(res.body[0]).to.have.property('created_on');
        expect(res.body[0]).to.have.property('updated_on');
        done();
      });
  });

  test('View issues on a project with multiple filters: GET request to /api/issues/{project}', function (done){
    this.timeout(time);

    chai
      .request(server)
      .get('/api/issues/project123?assigned_to=John Cena 1&open=true')
      .end(function (err, res) {
        assert.deepEqual(res.status, 200);
        expect(res.status).to.equal(200);
        expect(res.body).is.a('array');
        expect(res.body[0]).to.have.property('_id');
        expect(res.body[0]).to.have.property('issue_title');
        expect(res.body[0]).to.have.property('issue_text');
        expect(res.body[0]).to.have.property('created_by');
        expect(res.body[0]).to.have.property('assigned_to');
        expect(res.body[0].assigned_to).to.equal('John Cena 1');
        expect(res.body[0]).to.have.property('status_text');
        expect(res.body[0]).to.have.property('open');
        expect(res.body[0].open).to.equal(true);
        expect(res.body[0]).to.have.property('created_on');
        expect(res.body[0]).to.have.property('updated_on');
        done();
      });
  });

  test('Update one field on an issue: PUT request to /api/issues/{project}', function (done){
    this.timeout(time);
    
    chai
      .request(server)
      .put('/api/issues/project123')
      .send({
        _id: sampleId,
        issue_title: "Title 3"
      })
      .end(function (err, res) {
        assert.deepEqual(res.status, 200);
        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal({
          result: 'successfully updated',
          _id: sampleId
        });
        done();
      });
  });

  test('Update multiple fields on an issue: PUT request to /api/issues/{project}', function (done){
    this.timeout(time);
    
    chai
      .request(server)
      .put('/api/issues/project123')
      .send({
        _id: sampleId,
        issue_title: "Title 4",
        issue_text: "Text 4"
      })
      .end(function (err, res) {
        assert.deepEqual(res.status, 200);
        expect(res.status).to.equal(200);
        expect(res.body). to.deep.equal({
          result: 'successfully updated',
          _id: sampleId
        });
        done();
      });
  });

  test('Update an issue with missing _id: PUT request to /api/issues/{project}', function (done){
    this.timeout(time);
    
    chai
      .request(server)
      .put('/api/issues/project123')
      .send({
        issue_title: "Title 4",
        issue_text: "Text 4"
      })
      .end(function (err, res) {
        assert.deepEqual(res.status, 200);
        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal({
          error: 'missing _id'
        });
        done();
      });
  });

  test('Update an issue with no fields to update: PUT request to /api/issues/{project}', function (done){
    this.timeout(time);
    
    chai
      .request(server)
      .put('/api/issues/project123')
      .send({
        _id: sampleId,
      })
      .end(function (err, res) {
        assert.deepEqual(res.status, 200);
        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal({
          error: 'no update field(s) sent',
          _id: sampleId
        });
        done();
      });
  });

  test('Update an issue with an invalid _id: PUT request to /api/issues/{project}', function (done){
    this.timeout(time);
    
    chai
      .request(server)
      .put('/api/issues/project123')
      .send({
        _id: 123456,
        issue_title: "Title 5",
      })
      .end(function (err, res) {
        assert.deepEqual(res.status, 200);
        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal({
          error: 'could not update',
          _id: 123456
        });
        done();
      });
  });
  
  test('Delete an issue: DELETE request to /api/issues/{project}', function (done){
    this.timeout(time);
    
    chai
      .request(server)
      .delete('/api/issues/project123')
      .send({
        _id: sampleId,
      })
      .end(function (err, res) {
        assert.deepEqual(res.status, 200);
        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal({
          result: 'successfully deleted',
          _id: sampleId
        });
        done();
      });
  });

  test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', function (done){
    this.timeout(time);
    
    chai
      .request(server)
      .delete('/api/issues/project123')
      .send({
        _id: 123456,
      })
      .end(function (err, res) {
        assert.deepEqual(res.status, 200);
        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal({
          error: 'could not delete',
          _id: 123456
        });
        done();
      });
  });

  test('Delete an issue with missing _id: DELETE request to /api/issues/{project}', function (done){
    this.timeout(time);
    
    chai
      .request(server)
      .delete('/api/issues/project123')
      .send({})
      .end(function (err, res) {
        assert.deepEqual(res.status, 200);
        expect(res.status).to.equal(200);
        expect(res.body).to.deep.equal({
          error: 'missing _id'
        });
        done();
      });
  });
});
