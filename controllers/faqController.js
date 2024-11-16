const FAQ = require('../model/FAQ');

// Créer une FAQ
exports.createFAQ = async (req, res) => {
  try {
    const faq = new FAQ(req.body);
    await faq.save();
    res.status(201).json(faq);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de la FAQ', error });
  }
};

// Obtenir toutes les FAQs
exports.getAllFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find();
    res.status(200).json(faqs);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des FAQs', error });
  }
};

// Obtenir une FAQ par ID
exports.getFAQById = async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);
    if (!faq) return res.status(404).json({ message: 'FAQ non trouvée' });
    res.status(200).json(faq);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de la FAQ', error });
  }
};

// Mettre à jour une FAQ
exports.updateFAQ = async (req, res) => {
  try {
    const updatedFAQ = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedFAQ) return res.status(404).json({ message: 'FAQ non trouvée' });
    res.status(200).json(updatedFAQ);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la FAQ', error });
  }
};

// Supprimer une FAQ
exports.deleteFAQ = async (req, res) => {
  try {
    const deletedFAQ = await FAQ.findByIdAndDelete(req.params.id);
    if (!deletedFAQ) return res.status(404).json({ message: 'FAQ non trouvée' });
    res.status(200).json({ message: 'FAQ supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de la FAQ', error });
  }
};
