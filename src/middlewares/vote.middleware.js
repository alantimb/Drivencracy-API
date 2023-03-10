import dayjs from "dayjs";
import { ObjectId } from "mongodb";
import { choicesCollection } from "../database/db.js";
import { voteSchema } from "../schema/vote.schema.js";

export async function voteValidation(req, res, next) {
  const id = req.params.id;

  const vote = {
    createdAt: dayjs().format("YYYY-MM-DD HH:mm"),
    choiceId: id,
  };

  try {
    const { error } = voteSchema.validate(vote, { abortEarly: false });

    if (error) {
      const errorMessages = error.details.mapa((detail) => detail.message);
      return res.status(422).send(errorMessages);
    }

    const existChoice = await choicesCollection.findOne({
      _id: ObjectId(vote.choiceId),
    });

    if (!existChoice) {
      return res.status(404).send("Opção de voto não existe");
    }

    const existPoll = await pollsCollection.findOne({
      _id: ObjectId(existChoice.pollId),
    });

    const pollDate = existPoll.expireAt;
    const expiredPoll = dayjs().isAfter(pollDate, "day");

    if (expiredPoll) {
      return res.status(403).send("Enquete expirada");
    }

    res.locals.vote = vote;

    return next();
  } catch (err) {
    return res.status(500).send("Problema no servidor");
  }
}
