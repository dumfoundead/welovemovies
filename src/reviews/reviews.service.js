const knex = require("../db/connection");

function read(review_id) {
  return knex("reviews").select("*").where({ review_id }).first();
}

function readCritic(critic_id) {
  return knex("critics").where({ critic_id }).first();
}

async function addCritic(review) {
  review.critic = await readCritic(review.critic_id);
  return review;
}

function update(updatedReview) {
  return knex("reviews")
    .where({ review_id: updatedReview.review_id })
    .update(updatedReview, "*")
    .then(() => read(updatedReview.review_id))
    .then(addCritic);
}

function destroy(reviewId) {
  return knex("reviews").where({ review_id: reviewId }).del();
}

module.exports = {
  read,
  update,
  delete: destroy,
};
