const AWS = require("aws-sdk");
const sharp = require("sharp");
const proxy = require("proxy-agent");

if (process.env.PROXY) {
  AWS.config.update({
    httpOptions: { agent: proxy(process.env.PROXY) }
  });
}

const rekognition = new AWS.Rekognition();
const s3 = new AWS.S3();
const dynamodb = new AWS.DynamoDB();

const convertSpace = str => str.replace(/\s+/g, "-");
const convertHyphen = str => str.replace(/-+/g, " ");

exports.list = async (req, res) => {
  const collection_id = req.params.collection_id;
  const params = { CollectionId: collection_id };
  const response = await rekognition.listFaces(params).promise();
  const aws_name = `${process.env.APP_NAME}-${collection_id}`;
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

exports.create = async (req, res) => {
  const collection_id = req.params.collection_id;
  const aws_name = `${process.env.APP_NAME}-${collection_id}`;
  const person_name = convertSpace(req.body.name);
  const image = req.body.image;
  const buffer = new Buffer.from(
    image.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );
  const s3params = {
    Body: buffer,
    Bucket: aws_name,
    Key: person_name,
    ContentEncoding: "base64",
    ContentType: "image/jpeg"
  };
  const s3response = await s3.putObject(s3params).promise();
  const etag = s3response.ETag;
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

exports.delete = async (req, res) => {
  const collection_id = req.params.collection_id;
  const aws_name = `${process.env.APP_NAME}-${collection_id}`;
  const person_id = req.params.person_id;
  //  rekognition
  const params = {
    CollectionId: collection_id,
    FaceIds: [person_id]
  };
  await rekognition.deleteFaces(params).promise();
  // dynamodb
  const dbparams = {
    Key: { FaceId: { S: person_id } },
    TableName: aws_name
  };
  const tableItem = await dynamodb.getItem(dbparams).promise();
  await dynamodb.deleteItem(dbparams).promise();
  //  s3
  const s3params = {
    Bucket: aws_name,
    Key: tableItem.Item.Name.S
  };
  await s3.deleteObject(s3params).promise();

  return res.json({ id: person_id });
};

const searchFaceByBoundingBox = async (aws_name, collection_id, img, bb) => {
  const croppedImg = await img.extract({ ...bb }).toBuffer();
  var params = {
    CollectionId: collection_id,
    FaceMatchThreshold: 60,
    Image: {
      Bytes: croppedImg
    },
    MaxFaces: 1
  };
  try {
    const response = await rekognition.searchFacesByImage(params).promise();
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

exports.compare = async (req, res) => {
  const collection_id = req.params.collection_id;
  const aws_name = `${process.env.APP_NAME}-${collection_id}`;
  const image = req.body.image;
  const buffer = new Buffer.from(
    image.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );
  const sharpBuffer = await sharp(buffer);
  const meta = await sharpBuffer.metadata();
  var params = {
    Image: {
      Bytes: buffer
    }
  };
  const return_data = [];
  try {
    const response = await rekognition.detectFaces(params).promise();
    if (response.FaceDetails.length > 0) {
      for (let i of response.FaceDetails) {
        const bbox = {
          width: Math.ceil(i.BoundingBox.Width * meta.width),
          height: Math.ceil(i.BoundingBox.Height * meta.height),
          top: Math.ceil(i.BoundingBox.Top * meta.height),
          left: Math.ceil(i.BoundingBox.Left * meta.width)
        };
        console.log(bbox);
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
