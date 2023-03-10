import { pollsCollection } from "../database/db.js";

export async function createPoll(req, res) {
  const poll = res.locals.poll;

  try {
    const existPoll = await pollsCollection.findOne({ title: poll.title });

    if (existPoll) {
      return res.status(409).send("A enquete já existe!");
    }

    await pollsCollection.insertOne(poll);

    return res.status(201).send("Enquete criada com sucesso");
  } catch (err) {
    return res.status(500).send("Problema no servidor");
  }
}

export async function findPolls(req, res) {
  try {
    const polls = await pollsCollection.find().toArray();

    return res.status(201).send(polls);
  } catch (err) {
    return res.status(500).send("Problema no servidor");
  }
}
