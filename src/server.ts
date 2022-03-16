import axios from "axios";
import * as dotenv from "dotenv";

const API_ENDPOINT = "https://api.github.com/search/repositories";
dotenv.config();
const app = require("./index");

app.get("/getRepos", async function (req, res) {
  let createdAt = req.query.createdAt as string;
  let limit = req.query.limit as string;
  let language = req.query.language as string;
  if (limit && !isPositiveInteger(limit))
    return res.status(400).send("Invalid limit");
  if (createdAt && !dateIsValid(createdAt))
    return res.status(400).send("Invalid creation date");
  // not sure about list of languages, edge cases like C++
  //  should be encoded first
  //if (language && !languages.includes(language))
  //return res.status(400).send("Unsupported language");

  getRepos(createdAt, limit)
    .then((result) => {
      if (!result || !result.items)
        return res.status(404).send("No content found");
      const repos = result.items;

      const filteredRepos = language
        ? repos.filter(
            (repo: { language: string | undefined }) =>
              // make sure that language is defined and is equal to the
              // one provided in the request
              repo.language && repo.language === language
          )
        : repos;
      // not sure about which info we need, for example if only the name is required
      // a simple map would do .map((repo: { full_name: string; }) => repo.full_name);
      res.send(filteredRepos);
    })
    .catch((err) => {
      throw err;
    });
});

async function getRepos(creationDate?: string, limit?: string) {
  let queryString = "?q=";

  if (creationDate && dateIsValid(creationDate)) {
    queryString += `created:>${creationDate}&`;
  }

  if (limit && isPositiveInteger(limit)) {
    queryString += `stars:>0&sort=stars&per_page=${limit}`;
  } else {
    // no (valid) number provided, use 100 as default
    queryString += `stars:>0&sort=stars&per_page=100`;
  }

  try {
    let res = await axios({
      url: API_ENDPOINT + queryString,
      method: "get",
      // use 8 seconds, could be set up in .env file
      timeout: 15000,
      headers: {
        "Content-Type": "application/json",
      },
      validateStatus: function (status) {
        return status === 200; // Resolve only if the status code is 200, i.e. successfully retrieved the repos
      },
    });
    return res.data;
  } catch (error) {
    let errorMessage = "Request failed";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.log(errorMessage);
  }
}

// utility function to check if the NUMBER_OF_REPOS
// in the .env file is valid, i.e. positive integer
// so that in can be used as a query parameter
// for the per_page query param
const isPositiveInteger = (configParameter: string) => {
  if (typeof configParameter !== "string") {
    return false;
  }

  const num = Number(configParameter);

  if (Number.isInteger(num) && num > 0) {
    return true;
  }
  return false;
};

// utility function to check if the CREATION_DATE
// in the .env file is valid, i.e. YYYY-MM-DD format
// so that in can be used as a query parameter
// for the created query param
const dateIsValid = (dateString: string) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;

  if (dateString.match(regex) === null) {
    return false;
  }

  const date = new Date(dateString);

  const timestamp = date.getTime();

  if (typeof timestamp !== "number" || Number.isNaN(timestamp)) {
    return false;
  }

  return date.toISOString().startsWith(dateString);
};
