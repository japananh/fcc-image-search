"use strict";

const axios = require("axios");
const History = require("../models");

const defaultPage = 1;
const itemPerPage = 10;

async function getImagesInfo({
  term,
  page = defaultPage,
  per_page = itemPerPage,
}) {
  const url = "https://api.unsplash.com/search/photos";
  try {
    const result = await axios.get(url, {
      params: {
        query: term,
        page,
        per_page,
      },
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      },
    });
    if (result && result.data) return result.data;
    return;
  } catch (error) {
    console.error("Call api to get images info error", JSON.stringify(error));
    return;
  }
}

async function saveQuery({ term, type }) {
  return await History.create({ term, type });
}

module.exports = function (app) {
  app.route("/api/images/:term").get(async (req, res) => {
    const { term } = req.params;

    let { page } = req.query;
    if (page == null) page = defaultPage;
    page = +page;
    if (!page || page <= 0 || typeof page !== "number") {
      return res.json({ error: "Invalid input" });
    }

    const images = await getImagesInfo({ term, page });
    if (!images) return res.json({ total: 0, total_pages: 0, images: [] });

    const result = await saveQuery({ term, type: "images" });
    if (!result) return res.json({ error: "Server error" });

    const imagesInfo = images.results.map((image) => ({
      id: image.id,
      created_at: image.created_at,
      updated_at: image.updated_at,
      promoted_at: image.promoted_at,
      width: image.width,
      height: image.height,
      color: image.color,
      description: image.description,
      urls: image.urls,
      categories: image.categories,
      likes: image.likes,
    }));

    res.json({
      total: images.total,
      total_pages: images.total_pages,
      images: imagesInfo,
    });
  });

  app.route("/api/recent/images").get(async (_req, res) => {
    const data = await History.find().sort({ created_at: -1 });
    res.json(data || []);
  });
};
