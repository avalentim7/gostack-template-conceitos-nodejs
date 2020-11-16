const express = require("express");
const cors = require("cors");

const { v4: uuidv4, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function getRepositoryIndex(id) {
  return repositoryIndex = repositories.findIndex(repository => repository.id === id);
}

app.get("/repositories", (request, response) => {
  const { title } = request.params;

  const result = title
    ? repositories.filter(repository => repository.includes(title))
    : repositories;

  return response.json(result);
});

app.post("/repositories", (request, response) => {
  const { id, title, url, techs } = request.body;

  const repository = {
    id: uuidv4(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repository);

  return response.json(repository);

});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;

  const repositoryIndex = getRepositoryIndex(id);

  if (repositoryIndex < 0)
    return response.status(400).json({ error: 'Repository not found!' });

  const repository = { id, title, url, techs, likes: repositories[repositoryIndex].likes }

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = getRepositoryIndex(id);

  if (repositoryIndex < 0)
    return response.status(400).json({ error: 'Repository not found!' });

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = getRepositoryIndex(id);

  if (repositoryIndex < 0)
    return response.status(400).json({ error: 'Repository not found' });

  repositories[repositoryIndex].likes += 1;

  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
