const _ = require('lodash');
const {
  GraphQLObjectType, GraphQLString,
  GraphQLSchema, GraphQLID, GraphQLList
} = require('graphql');

let bookCounter = 4;
let authorCounter = 4;

// dummy data
const books = [
  {name: 'Name of the Wind', genre: 'Fantasy', id: '1', authorId: '3'},
  {name: 'The Final Empire', genre: 'Fantasy', id: '2', authorId: '1'},
  {name: 'The Long Earth', genre: 'Sci-Fi', id: '3', authorId: '2'}
];

const authors =  [
  {name: 'Patrick Rothfuss', age: 44, id:"1"},
  {name: 'Brandon Sanderson', age: 42, id:"2"},
  {name: 'Terry Pratchett', age: 66, id:"3"},
]

const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString},
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        return _.find(authors, { id: parent.authorId })
      }
    }
  })
});

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLString },
    books: {
      type: GraphQLList(BookType),
      resolve(parent, args) {
        return _.filter(books, { authorId: parent.id });
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return _.find(books, { id: args.id });
      }
    },
    books: {
      type: GraphQLList(BookType),
      resolve(parent, args) {
        return books;
      }
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID }},
      resolve(parent, args) {
        return _.find(authors, { id: args.id })
      }
    },
    authors: {
      type: GraphQLList(AuthorType),
      resolve(parent, args) {
        return authors;
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addBook: {
      type: BookType,
      args: {
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        authorId: { type: GraphQLID }
      },
      resolve(parent, args) {
        let newBook = {
          id: bookCounter,
          name: args.name,
          genre: args.genre,
          authorId: args.authorId
        };
        books.push(newBook);
        bookCounter++;
        return newBook;
      }
    },
    addAuthors: {
      type: AuthorType,
      args: {
        name: { type: GraphQLString },
        age: { type: GraphQLString },
        id: { type: GraphQLID }
      },
      resolve(parent, args) {
        let newAuthor = {
          id: authorCounter,
          name: args.name,
          genre: args.genre,
          authorId: args.authorId
        };
        authors.push(newAuthor);
        authorCounter++;
        return newAuthor;
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});