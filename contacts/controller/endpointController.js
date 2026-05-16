import 'dotenv/config';
import mongoDB from '../data/database.js';
import { ObjectId } from 'mongodb';


const endpointFunctions = {};


endpointFunctions.getData = async function (req, res, next) {
  try {
    const data = await mongoDB.getDatabase().db('cse341').collection('Contacts').find();
    data.toArray().then((users) => {
      res.setHeader('Content-Type', 'application/json')
      res.status(200).json(users);
    })
  } catch (e) {
    console.log(`Error in getProfessionalData: ${e}`)
    res.send({ status: `Error in getProfessionalData: ${e}` });
  }
}


endpointFunctions.getDataById = async function (req, res, next) {
  const mongoId = new ObjectId(req.params.id);
  try {
    const data = await mongoDB.getDatabase().db('cse341').collection('Contacts').findOne({ _id: mongoId });
    if (data) {
      res.setHeader('Content-Type', 'application/json')
      res.status(200).json(data);
    } else {
      res.send({status: `Could not find contact with id: ${mongoId}.`});
    }
  } catch (e) {
    console.log(`Error in getProfessionalData: ${e}`)
    res.send({ status: `Error in getProfessionalData: ${e}` });
  }
}

endpointFunctions.createUser = async function (req, res) {
  const user = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    favoriteColor: req.body.favoriteColor,
    birthday: req.body.birthday
  }
  const response = await mongoDB.getDatabase().db('cse341').collection('Contacts').insertOne(user);

  if (response.acknowledged) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occurred while updating the user.');
  }
}


endpointFunctions.updateUser = async function (req, res) {
  const userId = new ObjectId(req.params.id);
  const user = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    favoriteColor: req.body.favoriteColor,
    birthday: req.body.birthday
  }
  const response = await mongoDB.getDatabase().db('cse341').collection('Contacts').replaceOne({ _id: userId }, user);
  if (response.modifiedCount > 0)  {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occurred while updating the user.');
  }
}

endpointFunctions.deleteUser = async function (req, res) {
  const userId = new ObjectId(req.params.id);
  const response = await mongoDB.getDatabase().db('cse341').collection('Contacts').deleteOne({ _id: userId });
  if (response.deletedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occurred while updateing the user.');
  }
}


export default endpointFunctions;