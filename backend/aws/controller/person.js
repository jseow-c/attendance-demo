const AWS = require("aws-sdk");
const sharp = require("sharp");
const proxy = require("proxy-agent");

// adds proxy to aws config if required
// proxy stated in environment as PROXY
if (process.env.PROXY) {
  AWS.config.update({
    httpOptions: { agent: proxy(process.env.PROXY) }
  });
}

// initialize aws components
const rekognition = new AWS.Rekognition();
const s3 = new AWS.S3();
const dynamodb = new AWS.DynamoDB();

// format name to convert them between what is stored in AWS and shown in UI
const convertSpace = str => str.replace(/\s+/g, "-");
const convertHyphen = str => str.replace(/-+/g, " ");

/**
 * Returns a list of people based on collection_id from AWS
 * @param {string} req.params.collection_id id of collection
 * @return {json} [{collection_id, person_id, name, thumbnail}, ...] - an array of details of people
 */
exports.list = async (req, res) => {
  const collection_id = req.params.collection_id;
  const aws_name = `${process.env.APP_NAME}-${collection_id}`;

  // get a list of faces based on id of collection
  const params = { CollectionId: collection_id };
  const response = await rekognition.listFaces(params).promise();

  // populate the thumbnail based on the list of faces
  // by going to s3
  const return_data = [];
  for (let i of response.Faces) {
    const s3params = {
      Bucket: aws_name,
      Key: i.ExternalImageId
    };
    const s3response = await s3.getObject(s3params).promise();
    const thumbnail = new Buffer.from(s3response.Body, "binary").toString(
      "base64"
    );
    return_data.push({
      collection_id,
      person_id: i.FaceId,
      name: convertHyphen(i.ExternalImageId),
      thumbnail
    });
  }
  return res.json(return_data);
};

/**
 * Enroll a person into a collection based on collection_id in AWS
 * @param {string} req.params.collection_id id of collection
 * @param {string} req.body.name name of person
 * @param {base64 string} req.body.image base64 string of an image
 * @return {json} {collection_id, person_id, name, thumbnail} - details of the person
 */
exports.create = async (req, res) => {
  const collection_id = req.params.collection_id;
  const aws_name = `${process.env.APP_NAME}-${collection_id}`;
  const person_name = convertSpace(req.body.name);
  const image = req.body.image;
  const buffer = new Buffer.from(
    image.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );

  // create an image object in s3
  const s3params = {
    Body: buffer,
    Bucket: aws_name,
    Key: person_name,
    ContentEncoding: "base64",
    ContentType: "image/jpeg"
  };
  const s3response = await s3.putObject(s3params).promise();
  const etag = s3response.ETag;

  // index the face into rekognition collection
  // by referencing to the s3 image object from earlier
  const params = {
    CollectionId: collection_id,
    DetectionAttributes: [],
    ExternalImageId: person_name,
    MaxFaces: 1,
    Image: {
      S3Object: {
        Bucket: aws_name,
        Name: person_name
      }
    }
  };
  const response = await rekognition.indexFaces(params).promise();
  const person_id = response.FaceRecords[0].Face.FaceId;

  // create a row in the dynamodb table based on person
  const dbParams = {
    Item: {
      FaceId: { S: person_id },
      Name: { S: person_name },
      ETag: { S: etag }
    },
    ReturnConsumedCapacity: "TOTAL",
    TableName: aws_name
  };
  await dynamodb.putItem(dbParams).promise();

  return res.json({
    collection_id,
    person_id,
    name: convertHyphen(person_name),
    thumbnail: new Buffer.from(buffer, "binary").toString("base64")
  });
};

/**
 * Delete a person from a collection based on collection_id in AWS
 * @param {string} req.params.collection_id id of collection
 * @param {string} req.params.person_id id of a person
 * @return {json} {id} - id of the person
 */
exports.delete = async (req, res) => {
  const collection_id = req.params.collection_id;
  const aws_name = `${process.env.APP_NAME}-${collection_id}`;
  const person_id = req.params.person_id;

  //  delete person from rekognition collection
  const params = {
    CollectionId: collection_id,
    FaceIds: [person_id]
  };
  await rekognition.deleteFaces(params).promise();

  // delete row of person's details in dynamodb table
  const dbparams = {
    Key: { FaceId: { S: person_id } },
    TableName: aws_name
  };
  const tableItem = await dynamodb.getItem(dbparams).promise();
  await dynamodb.deleteItem(dbparams).promise();

  //  delete s3 image object referenced by person in s3
  const s3params = {
    Bucket: aws_name,
    Key: tableItem.Item.Name.S
  };
  await s3.deleteObject(s3params).promise();

  return res.json({ id: person_id });
};

/**
 * Crops an image based on bounding box and search for closest match in collection
 * @param {string} aws_name generic name used for label in AWS
 * @param {string} collection_id id of a collection
 * @param {sharped buffer} img sharp version of an image to be searched
 * @param {json} bb {width, height, top, left} - details of bounding box to crop image
 * @return {json} {collection_id, person_id, confidence, person_name, thumbnail} - details of the analysis
 */
const searchFaceByBoundingBox = async (aws_name, collection_id, img, bb) => {
  // crop the image based on bounding box
  const croppedImg = await img.extract({ ...bb }).toBuffer();

  try {
    // find closest person match based on image
    var params = {
      CollectionId: collection_id,
      FaceMatchThreshold: 60,
      Image: {
        Bytes: croppedImg
      },
      MaxFaces: 1
    };
    const response = await rekognition.searchFacesByImage(params).promise();

    // get person's image from s3 if there's a match
    if (response.FaceMatches.length > 0) {
      const face = response.FaceMatches[0];
      const confidence = face.Similarity / 100;
      const s3params = {
        Bucket: aws_name,
        Key: face.Face.ExternalImageId
      };
      const s3response = await s3.getObject(s3params).promise();
      const thumbnail = new Buffer.from(s3response.Body, "binary").toString(
        "base64"
      );
      return {
        collection_id,
        person_id: face.Face.FaceId,
        confidence,
        person_name: convertHyphen(face.Face.ExternalImageId),
        thumbnail
      };
    } else return null;
  } catch {
    return null;
  }
};

/**
 * Compares an image and find the closest match for each face in the image
 * @param {string} req.params.collection_id id of the collection
 * @param {base64 string} req.body.image base64 string of the image to be compared
 * @return {json} [{collection_id, person_id, confidence, person_name, thumbnail}, ...] - an array of details of matched faces in the image
 */
exports.compare = async (req, res) => {
  const collection_id = req.params.collection_id;
  const aws_name = `${process.env.APP_NAME}-${collection_id}`;
  const image = req.body.image;
  const buffer = new Buffer.from(
    image.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );

  // get image's metadata
  const sharpBuffer = await sharp(buffer);
  const meta = await sharpBuffer.metadata();

  const return_data = [];
  try {
    // find all faces in image (no labels of faces yet)
    const params = {
      Image: {
        Bytes: buffer
      }
    };
    const response = await rekognition.detectFaces(params).promise();

    // in the event of faces found, proceed to do cropping and analysis
    if (response.FaceDetails.length > 0) {
      for (let i of response.FaceDetails) {
        const bbox = {
          width: Math.ceil(i.BoundingBox.Width * meta.width),
          height: Math.ceil(i.BoundingBox.Height * meta.height),
          top: Math.ceil(i.BoundingBox.Top * meta.height),
          left: Math.ceil(i.BoundingBox.Left * meta.width)
        };
        const person = await searchFaceByBoundingBox(
          aws_name,
          collection_id,
          sharpBuffer,
          bbox
        );
        if (person) return_data.push(person);
      }
    }
  } catch (error) {
    console.log(error, error.stack);
  }

  return res.json(return_data);
};
