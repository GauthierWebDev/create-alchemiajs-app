import * as middlewares from "@/middlewares";
import express from "express";

const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(middlewares.minify);

export default server;
