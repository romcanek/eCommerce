const Item = require("../models/Item");
const User = require("../models/User");

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLSchema,
    GraphQLNonNull,
    GraphQLBoolean,
    GraphQLList,
} = require("graphql");

// User Type
const UserType = new GraphQLObjectType({
    name: "User",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        admin: { type: GraphQLBoolean },
        itemsIDs: { type: new GraphQLList(GraphQLID) },
    }),
});

// Item Type
const ItemType = new GraphQLObjectType({
    name: "Item",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        price: { type: GraphQLString },
        description: { type: GraphQLString },
        inStock: { type: GraphQLString },
        img: { type: GraphQLString },
    }),
});

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        users: {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
                return User.find({});
            },
        },
        user: {
            type: UserType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return User.findById(args.id);
            },
        },
        items: {
            type: new GraphQLList(ItemType),
            resolve(parent, args) {
                return Item.find({});
            },
        },
        item: {
            type: ItemType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Item.findById(args.id);
            },
        },
    },
});

// Mutations
const mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        // Add User
        addUser: {
            type: UserType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                email: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLString) },
            },
            async resolve(parent, args) {
                // Find if user already exists
                const userExists = await User.findOne({ email: args.email });

                const user = new User({
                    name: args.name,
                    email: args.email,
                    password: args.password,
                    admin: false,
                    itemsIDs: [],
                });

                if (!userExists) {
                    return user.save();
                } else {
                    return null;
                }
            },
        },
        // Buy item
        buyItem: {
            type: ItemType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                userId: { type: new GraphQLNonNull(GraphQLID) },
            },
            async resolve(parent, args) {
                const user = await User.findById(args.userId);

                if (user.itemsIDs.includes(args.id)) {
                    throw new Error("You already bought this item");
                }

                // Item is out of stock
                const item = await Item.findById(args.id);
                if (item.inStock === 0) {
                    throw new Error("This item is out of stock");
                }

                // Update items stock
                const update = await Item.findByIdAndUpdate(args.id, {
                    $inc: { inStock: -1 },
                });
                // Update users itemsIDs
                User.findByIdAndUpdate(
                    user._id,
                    {
                        $push: { itemsIDs: args.id },
                    },
                    function (err, docs) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(`${user.name} bought item with id ${args.id}`);
                        }
                    }
                );

                return Item.findById(args.id);
            },
        },
        // deleteBoughtItem
        deleteBoughtItem: {
            type: ItemType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                userId: { type: new GraphQLNonNull(GraphQLID) },
            },
            async resolve(parent, args) {
                const user = await User.findById(args.userId);

                if (!user.itemsIDs.includes(args.id)) {
                    throw new Error("You haven't bought this item");
                }

                // Update items stock
                const update = await Item.findByIdAndUpdate(args.id, {
                    $inc: { inStock: 1 },
                });
                // Update users itemsIDs
                User.findByIdAndUpdate(
                    user._id,
                    {
                        $pull: { itemsIDs: args.id },
                    },
                    function (err, docs) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(`${user.name} deleted item with id ${args.id}`);
                        }
                    }
                );

                return Item.findById(args.id);
            },
        },
        // Delete all bought items
        deleteAllBoughtItems: {
            type: ItemType,
            args: {
                userId: { type: new GraphQLNonNull(GraphQLID) },
            },
            async resolve(parent, args) {
                const user = await User.findById(args.userId);

                if (user.itemsIDs.length === 0) {
                    throw new Error("You haven't bought anything");
                }

                User.findByIdAndUpdate(
                    user._id,
                    {
                        $set: { itemsIDs: [] },
                    },
                    function (err, docs) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(`${user.name} deleted all items`);
                            console.log(docs);
                        }
                    }
                );

                return User.findById(args.userId);
            },
        },

        // Add Item
        addItem: {
            type: ItemType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                price: { type: new GraphQLNonNull(GraphQLString) },
                description: { type: new GraphQLNonNull(GraphQLString) },
                inStock: { type: new GraphQLNonNull(GraphQLString) },
                img: { type: new GraphQLNonNull(GraphQLString) },
            },
            async resolve(parent, args) {
                const item = new Item({
                    name: args.name,
                    price: args.price,
                    description: args.description,
                    inStock: args.inStock,
                    img: args.img,
                });

                return item.save();
            },
        },
    },
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation,
});
