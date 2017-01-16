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

// https://github.com/mugli/learning-graphql/blob/master/7.%20Deep%20Dive%20into%20GraphQL%20Type%20System.md
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
        vehicle: {
            type: vehicleType,
            description: 'Single vehicle',
            args: {
                'vin': {
                    type: new graphql.GraphQLNonNull(graphql.GraphQLString)
                }
            },
            resolve: (parent, args, ast) => {
                var vehicle = vehicles.filter((vehicle) => {
                    return vehicle.vin === args.vin
                })
                return vehicle[0]
            }
        }
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
    res.send('Hello. You probably want this: <a href="/graphql">GraphiQL</a>')
})

app.listen(3000, () => {
    console.log('Listening on 3000')
})
