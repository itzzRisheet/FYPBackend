import postmanToOpenApi from "postman-to-openapi";

const postmanCollection = "./collection.json";
const outputfile = "./api/collection.yml";

// Async/await
try {
  const result = await postmanToOpenApi(postmanCollection, outputfile, {
    defaultTag: "General",
  });
  // Without save the result in a file
  const result2 = await postmanToOpenApi(postmanCollection, null, {
    defaultTag: "General",
  });
  console.log(`OpenAPI specs: ${result}`);
} catch (err) {
  console.log(err);
}

// Promise callback style
postmanToOpenApi(postmanCollection, outputfile, { defaultTag: "General" })
  .then((result) => {
    console.log(`OpenAPI specs: ${result}`);
  })
  .catch((err) => {
    console.log(err);
  });
