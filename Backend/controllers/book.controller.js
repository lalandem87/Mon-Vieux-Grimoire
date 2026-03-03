const Book = require("../models/book.model");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find({});
    res.status(200).json(books);
  } catch (e) {
    res.status(500).json({ message: e });
  }
};

exports.getBooksById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    res.status(200).json(book);
  } catch (e) {
    res.status(500).json({ message: e });
  }
};

exports.createBooks = async (req, res) => {
  try {
    const { title, author, year, genre } = JSON.parse(req.body.book);
    const userId = req.auth.userId;
    console.log(req.body);
    console.log(req.file);

    if (!req.file) {
      return res.status(400).json({ message: "Image requise" });
    }

    const imagePath = `images/${req.file.filename}.webp`;

    console.log(req.file.path);
    await sharp(req.file.path).resize(800).toFormat("webp").toFile(imagePath);
    await fs.promises.unlink(`tmp/${req.file.filename}`);
    const book = new Book({
      userId,
      title,
      author,
      imageUrl: `${req.protocol}://${req.get("host")}/${imagePath}`,
      year,
      genre,
      ratings: [],
      averageRating: 0,
    });

    await book.save();
    res.status(201).json(book);
  } catch (e) {
    res.status(500).json({ message: e });
  }
};

exports.editBooks = async (req, res) => {
  try {
    const id = req.params.id;
    const book = await Book.findById(id);

    if (book.userId !== req.auth.userId) {
      return res.status(403).json({ message: "requete non autorisée" });
    }

    if (req.file) {
      const imagePath = `images/${req.file.filename}.webp`;
      await sharp(req.file.path).resize(800).toFormat("webp").toFile(imagePath);
      await fs.promises.unlink(req.file.path);
    }

    const updatedBook = req.file
      ? {
          ...JSON.parse(req.body.book),
          imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}.webp`,
        }
      : req.body;

    await Book.updateOne({ _id: req.params.id }, { ...updatedBook });
    res.status(200).json({ message: "Livre modifié" });
  } catch (e) {
    res.status(500).json({ message: e });
  }
};

exports.removeBooks = async (req, res) => {
  try {
    const id = req.params.id;
    const book = await Book.findById(id);

    if (book.userId !== req.auth.userId) {
      return res.status(403).json({ message: "Accès non autorisé" });
    }

    const imagePath = book.imageUrl.split("/images/")[1];

    fs.unlink(`images/${imagePath}`, (err) => {
      if (err) console.log(err);
    });
    await Book.deleteOne({ _id: id });
    res.status(200).json({ message: "Livre correctement supprimé" });
  } catch (e) {
    res.status(500).json({ message: e });
  }
};

exports.giveRating = async (req, res) => {
  try {
    const id = req.params.id;
    const book = await Book.findById(id);

    const { userId, rating } = req.body;
    console.log(req.body);

    const alreadyRated = book.ratings.find((r) => r.userId === userId);
    if (alreadyRated) {
      return res.status(400).json({ message: "Vous avez déjà noté ce livre" });
    }

    book.ratings.push({ userId, grade: rating });
    book.averageRating =
      book.ratings.reduce((acc, r) => acc + r.grade, 0) / book.ratings.length;
    await book.save();
    res.status(200).json(book);
  } catch (e) {
    res.status(500).json({ message: e });
  }
};

exports.getBestRating = async (req, res) => {
  try {
    const books = await Book.find({}).sort({ averageRating: -1 }).limit(3);
    res.status(200).json(books);
  } catch (e) {
    res.status(500).json({ message: e });
  }
};
