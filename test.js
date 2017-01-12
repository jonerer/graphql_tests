var request = require('request')
require('./app') // start the server
var expect = require('chai').expect

var baseurl = 'http://localhost:3000/'

var query = `query K {
  vehicles {
    name,
    vin,
    position {
      lat
      lon
    }
  }
}`

var success = `{
  "data": {
    "vehicles": [
      {
        "name": "the go-cart",
        "vin": "VINVINVIN123",
        "position": {
          "lat": "5",
          "lon": "6"
        }
      },
      {
        "name": "top secret car",
        "vin": "VINVINVIN2345",
        "position": null
      }
    ]
  }
}`

var normalizedSuccess = JSON.stringify(JSON.parse(success))

describe('the graphql server', () => {
    it('should return on /', (cb) => {
        request(baseurl, (err, res, body) => {
            expect(body).to.eql('hello')
            cb()
        })
    })

    it('should take a query with application/json', (cb) => {
        request({
            method: 'POST',
            uri: baseurl + 'graphql',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                query: query
            })
        }, (err, res, body) => {
            var normalizedResponse = JSON.stringify(JSON.parse(body))
            expect(normalizedResponse).to.eql(normalizedSuccess)
            cb()
        })
    })

    it('should take a query with application/graphql', (cb) => {
        request({
            method: 'POST',
            uri: baseurl + 'graphql',
            headers: {
                'content-type': 'application/graphql',
            },
            body: query
        }, (err, res, body) => {
            var normalizedResponse = JSON.stringify(JSON.parse(body))
            expect(normalizedResponse).to.eql(normalizedSuccess)
            cb()
        })
    })
})
