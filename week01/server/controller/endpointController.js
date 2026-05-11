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
    const data = await mongoDB.getDatabase().db('cse341').collection('Contacts').findOne({ _id: String(mongoId) });
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


export default endpointFunctions;