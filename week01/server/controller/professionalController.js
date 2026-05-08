import 'dotenv/config';
import { MongoClient } from 'mongodb';


const URI = process.env.MONGO_DB_URL;
const professionalFunctions = {};


/**
 * Retrieves and returns random entry data from mongoDB
 * 
 *  Data structure:
 *  {
 *    "_id": "",
 *    "professionalName": "",
 *    "base64Image": "",
 *    "primaryDescription": "",
 *    "workDescription1": "",
 *    "workDescription2": "",
 *    "linkTitleText": "",
 *    "nameLink": {
 *      "firstName": "",
 *      "url": ""
 *    },
 *    "linkedInLink": {
 *      "text": "",
 *      "link": ""
 *    },
 *    "githubLink": {
 *      "text": "",
 *      "link": ""
 *    }
 *  }
 * 
 */
professionalFunctions.getProfessionalData = async function (req, res, next) {
  const client = new MongoClient(URI);

  try {
    const data = await client.db('cse341').collection('week01-activity').find().toArray();
    const choice = Math.floor(Math.random() * data.length);

    res.send(data[choice]);
  } catch (e) {
    console.log(`Error in getProfessionalData: ${e}`)
    res.send({ status: `Error in getProfessionalData: ${e}` });
  } finally {
    await client.close();
  }
}


export default professionalFunctions;