const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const mongoose = require('mongoose');
const Item = require('../models/item');

const { expect } = chai;
chai.use(chaiHttp);

describe('Item API', function () {
    // before(function (done) {
    //     mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true });
    //     const db = mongoose.connection;
    //     db.on('error', console.error.bind(console, 'connection error'));
    //     db.once('open', function () {
    //         console.log('Connected to test database.');
    //         done();
    //     });
    // });

    // after(function (done) {
    //     mongoose.connection.close(function () {
    //         console.log('Disconnected from test database.');
    //         done();
    //     });
    // });
    describe('POST /api/items', function () {
        it('should create a new item', function (done) {
            chai
                .request(app)
                .post('/api/items')
                .send({
                    name: 'New Item',
                    price: 10,
                    description: 'This is a new item.',
                })
                .end(function (err, res) {
                    expect(res).to.have.status(201);
                    expect(res.body.name).to.equal('New Item');
                    expect(res.body.price).to.equal(10);
                    expect(res.body.description).to.equal('This is a new item.');
                    done();
                });
        });

    });

    describe('GET /api/items/:id', function () {
        let itemId;

        before(async () => {
            const item = new Item({
                name: 'Test Item',
                price: 9.99,
                description: 'A test item for testing',
            });
            const savedItem = await item.save();
            itemId = savedItem._id;
        });
        it('should get a single item by id', function (done) {
            chai
                .request(app)
                .get(`/api/items/${itemId}`)
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body.name).to.equal('Test Item');
                    expect(res.body.price).to.equal(9.99);
                    expect(res.body.description).to.equal('A test item for testing');
                    done();
                });
        });
    });

    describe('PUT /api/items/:id', function () {
        let itemId;

        before(async () => {
            const item = new Item({
                name: 'Test Item',
                price: 9.99,
                description: 'A test item for testing',
            });
            const savedItem = await item.save();
            itemId = savedItem._id;
        });
        it('should update an item', function (done) {
            chai
                .request(app)
                .put(`/api/items/${itemId}`)
                .send({
                    name: 'Updated Item',
                    price: 20,
                    description: 'This item has been updated.',
                })
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body.name).to.equal('Updated Item');
                    expect(res.body.price).to.equal(20);
                    expect(res.body.description).to.equal('This item has been updated.');
                    done();
                });
        });
    });

    describe('DELETE /api/items/:id', function () {
        let itemId;

        before(async () => {
            // Create an item to delete
            const item = new Item({
                name: 'Test Item',
                price: 9.99,
                description: 'A test item for delete testing',
            });
            const savedItem = await item.save();
            itemId = savedItem._id;
        });

        after(async () => {
            // Clean up the created item
            await Item.findByIdAndDelete(itemId);
        });

        it('should delete an existing item', (done) => {
            chai
                .request(app)
                .delete(`/api/items/${itemId}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message').to.equal('Item deleted successfully');
                    done();
                });
        });

        it('should return 404 if item not found', (done) => {
            chai
                .request(app)
                .delete('/api/items/123456789012')
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    expect(res.body).to.have.property('message').to.equal('Item not found');
                    done();
                });
        });
    });
});
