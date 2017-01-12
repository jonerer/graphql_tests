var express = require('express'),
    graphqlHTTP = require('express-graphql')

var graphql = require('graphql')

var app = express()

var positionType = new graphql.GraphQLObjectType({
    name: "PositionType",
    fields: () => ({
        lat: {
            type: graphql.GraphQLString
        },
        lon: {
            type: graphql.GraphQLString
        }
    })
})

var vehicleType = new graphql.GraphQLObjectType({
    name: "VehicleType",
    fields: () => ({
        name: {
            type: graphql.GraphQLString,
        },
        vin: {
            type: graphql.GraphQLString
        },
        position: {
            type: positionType,
            resolve: (parent, args, ast) => {
                var permission = position_permissions.
                    filter(perm => perm.vehicle === parent.id)[0].
                    permitted

                // console.log(parent, permission)
                if (permission) {
                    return parent.position
                } else {
                    return null
                }

            }
        }
    })
})

var queryType = new graphql.GraphQLObjectType({
    name: 'RootQueryType',
    fields: () => ({
        vehicles: { // VehicleType
            type: new graphql.GraphQLList(vehicleType),
            description: 'the vehicles',
            resolve: (parent, args, ast) => {
                return vehicles
            }
        },
    })
})

var position_permissions = [{
    vehicle: "1",
    permitted: true
}, {
    vehicle: "2",
    permitted: false
}]

var vehicles = [{
    name: "the go-cart",
    id: "1",
    vin: "VINVINVIN123",
    position: {
        lat: "5",
        lon: "6"
    }
}, {
    name: "top secret car",
    id: "2",
    vin: "VINVINVIN2345",
    position: {
        position: {
            lat: "10",
            lon: "12"
        }
    }
}]

var schema = new graphql.GraphQLSchema({
    query: queryType
})

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}))

app.get('/', (req, res) => {
    res.send('hello')
})

app.listen(3000)
