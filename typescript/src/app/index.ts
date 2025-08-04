import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import JWTService from "../services/jwtService";
import { Express } from "express";
import { User } from "./user";
export async function initServer(): Promise<Express>{
  const app=express();
  app.use(cors());
  app.use(bodyParser.json());
  const server=new ApolloServer({
   typeDefs:`
   ${User.Types}
   type Query{
     ${User.queries}
   }
   type Mutation{
     ${User.mutations}
   }
    `,
    resolvers:{
      Query:{
        ...User.resolvers.queries
       },
       Mutation:{
        ...User.resolvers.mutations
       }
    },
  });
  await server.start();
  app.use("/graphql", expressMiddleware(server, {
    context: async ({ req }) => {
      return {
        user: req.headers.authorization ? await JWTService.decodeToken(req.headers.authorization.split('Bearer ')[1] || '') : undefined
      };
    }
  }) as unknown as express.RequestHandler);
  return app;
}